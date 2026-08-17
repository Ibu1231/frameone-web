#!/usr/bin/env node
/**
 * Pushes everything under public/videos to a Cloudflare R2 bucket,
 * preserving paths so /videos/automotive/gt-cup.mp4 in the site maps to
 * videos/automotive/gt-cup.mp4 in the bucket.
 *
 *   npm run media:upload -- --bucket frameone-media
 *   npm run media:upload -- --bucket frameone-media --dry-run
 *
 * Uses wrangler, Cloudflare's own CLI, rather than adding an S3 SDK to
 * the project: it is only ever run by hand, and wrangler already owns
 * the login. Run `npx wrangler login` once first.
 *
 * Nothing here touches credentials directly — wrangler holds them.
 */

import { readdirSync, statSync } from "node:fs";
import { join, posix, sep } from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const bucket = args[args.indexOf("--bucket") + 1];
const dryRun = args.includes("--dry-run");

if (!bucket || bucket.startsWith("--")) {
  console.error("Usage: npm run media:upload -- --bucket <name> [--dry-run]");
  process.exit(1);
}

const ROOT = "public/videos";

/** Every file under public/videos, as repo-relative paths. */
function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(ROOT).filter((f) => f.endsWith(".mp4"));

if (files.length === 0) {
  console.error(`No .mp4 files found under ${ROOT}`);
  process.exit(1);
}

let total = 0;
console.log(`\n${files.length} file(s) → r2://${bucket}\n`);

for (const file of files) {
  // public/videos/automotive/gt-cup.mp4 -> videos/automotive/gt-cup.mp4
  const key = file.split(sep).join(posix.sep).replace(/^public\//, "");
  const mb = statSync(file).size / 1048576;
  total += mb;
  console.log(`  ${mb.toFixed(1).padStart(6)} MB  ${key}`);

  if (dryRun) continue;

  const res = spawnSync(
    "npx",
    [
      "wrangler",
      "r2",
      "object",
      "put",
      `${bucket}/${key}`,
      "--file",
      file,
      "--content-type",
      "video/mp4",
      // A year: these files are immutable — a new cut gets a new name.
      "--cache-control",
      "public, max-age=31536000, immutable",
      "--remote",
    ],
    { stdio: "inherit", shell: true }
  );

  if (res.status !== 0) {
    console.error(`\nFailed on ${key}. Nothing after it was uploaded.`);
    process.exit(res.status ?? 1);
  }
}

console.log(
  `\n${dryRun ? "Would upload" : "Uploaded"} ${total.toFixed(1)} MB.\n` +
    `Then set NEXT_PUBLIC_MEDIA_CDN to the bucket's public URL and rebuild.\n`
);
