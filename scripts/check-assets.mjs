#!/usr/bin/env node
/**
 * Verifies every asset the built site actually references exists in the
 * export with EXACTLY matching case.
 *
 * Windows and macOS are case-insensitive, so /images/automotive/x.jpg
 * resolves happily to out/images/Automotive/x.jpg during development —
 * and then every Linux host, Cloudflare Pages included, returns 404 for
 * the same URL. The fault is invisible locally and only shows up once
 * deployed.
 *
 * This reads the generated HTML rather than the source, so paths
 * assembled at runtime (`/images/automotive/${n}-lg.jpg`) are checked as
 * the concrete URLs they become. Runs after every build.
 */

import { readFileSync, readdirSync, existsSync, statSync, rmSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";

if (!existsSync(OUT)) {
  console.error(`No ${OUT}/ directory — run the build first.`);
  process.exit(1);
}

/** Every .html file in the export. */
function htmlFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return full.endsWith(".html") ? [full] : [];
  });
}

const referenced = new Set();
for (const file of htmlFiles(OUT)) {
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(/["'(](\/(?:images|videos)\/[^"'()\s\\]+)/g)) {
    // Strip srcset descriptors and query strings.
    referenced.add(m[1].split(/[?#]/)[0]);
  }
}

const problems = [];

for (const url of referenced) {
  let dir = OUT;
  let ok = true;

  for (const segment of url.split("/").filter(Boolean)) {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      problems.push({ url, why: `missing (no ${dir})` });
      ok = false;
      break;
    }
    // Exact match first; if only a different case exists, that is the bug.
    if (entries.includes(segment)) {
      dir = join(dir, segment);
      continue;
    }
    const other = entries.find((e) => e.toLowerCase() === segment.toLowerCase());
    problems.push({
      url,
      why: other
        ? `case mismatch — URL says "${segment}", file is "${other}"`
        : `missing — no "${segment}" in ${dir}`,
    });
    ok = false;
    break;
  }
  if (!ok) continue;
}

/**
 * Anything Next copied into the export that nothing references is dead
 * weight. With video served from a CDN that is out/videos — 106MB of it,
 * which would otherwise take the deploy from 13MB to 119MB and risk the
 * 25MB per-file limit on Cloudflare Pages. Decided from the built output
 * rather than an env var, because .env values are not visible to npm
 * lifecycle scripts. Source files under public/ are untouched.
 */
const localVideos = [...referenced].some((u) => u.startsWith("/videos/"));
if (!localVideos && existsSync(join(OUT, "videos"))) {
  rmSync(join(OUT, "videos"), { recursive: true, force: true });
  console.log("• nothing references /videos — removed it from the export");
}

// Same for the full-size stills once they resolve to the CDN: Next
// copies all of public/, so they would ship unused. Thumbnails are left
// alone — the grids paint from those.
if (![...referenced].some((u) => u.endsWith("-lg.jpg"))) {
  let n = 0, freed = 0;
  const sweep = (dir) => {
    for (const e of readdirSync(dir)) {
      const full = join(dir, e);
      if (statSync(full).isDirectory()) sweep(full);
      else if (e.endsWith("-lg.jpg")) { freed += statSync(full).size; rmSync(full); n++; }
    }
  };
  if (existsSync(join(OUT, "images"))) sweep(join(OUT, "images"));
  if (n) console.log(`• ${n} full-size stills resolve to the CDN — removed ${(freed / 1048576).toFixed(1)}MB from the export`);
}

if (problems.length) {
  console.error(`\n✗ ${problems.length} broken asset reference(s):\n`);
  for (const { url, why } of problems) console.error(`  ${url}\n    ${why}\n`);
  console.error(
    "Linux hosts are case-sensitive — these would 404 in production.\n"
  );
  process.exit(1);
}

console.log(
  `✓ ${referenced.size} asset URLs verified in ${OUT}/ (present, exact case)`
);
