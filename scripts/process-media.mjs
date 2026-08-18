#!/usr/bin/env node
/**
 * Turns assets-source/masters/<genre>/<project>/ into web assets plus a
 * manifest the site reads.
 *
 *   node scripts/process-media.mjs <genre>
 *
 * Photos produce two sizes:
 *   -sm (700px)  -> public/  — grid thumbnails, same-origin so the grid
 *                             paints without a second connection
 *   -lg (1800px) -> public/  — full-size, only fetched when a frame is
 *                             opened; moved to R2 by the upload script
 *
 * True pixel dimensions are recorded per file. Guessing them is what
 * produced wrongly-cropped portraits last time.
 */
import { readdirSync, statSync, mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { execFileSync } from "node:child_process";

const FF = process.env.FFMPEG ||
  "C:/Users/mhdib/AppData/Local/Temp/claude/C--Users-mhdib/91e4326a-fe6b-4579-974e-c0a82c665077/scratchpad/fftool/node_modules/ffmpeg-static/ffmpeg.exe";

const genre = process.argv[2];
if (!genre) { console.error("Usage: node scripts/process-media.mjs <genre>"); process.exit(1); }

const SRC = join("assets-source/masters", genre);
const IMG_OUT = join("public/images", genre);
const VID_OUT = join("public/videos", genre);
const MANIFEST = "lib/media-manifest.json";

const isPhoto = (f) => /\.(jpe?g|png)$/i.test(f);
const isVideo = (f) => /\.(mp4|mov|m4v)$/i.test(f);

/** Reads real dimensions rather than assuming them. */
function dimensions(file) {
  const out = execFileSync(FF, ["-i", file], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })
    .toString();
  const m = out.match(/,\s(\d{2,5})x(\d{2,5})[\s,]/);
  return m ? { width: +m[1], height: +m[2] } : null;
}
function probe(file) {
  try { execFileSync(FF, ["-i", file], { stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { return (e.stderr || "").toString(); }
  return "";
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
manifest[genre] = manifest[genre] || {};

const projects = readdirSync(SRC).filter((d) => statSync(join(SRC, d)).isDirectory());

for (const project of projects) {
  const dir = join(SRC, project);
  const files = readdirSync(dir).filter((f) => statSync(join(dir, f)).isFile());
  const photos = files.filter(isPhoto).sort();
  const videos = files.filter(isVideo).sort();
  if (!photos.length && !videos.length) { console.log(`- ${project}: empty, skipped`); continue; }

  mkdirSync(join(IMG_OUT, project), { recursive: true });
  const entry = { photos: [], clips: [] };

  photos.forEach((f, i) => {
    const n = String(i + 1).padStart(2, "0");
    const src = join(dir, f);
    const info = probe(src);
    const m = info.match(/,\s(\d{2,5})x(\d{2,5})[\s,]/);
    const ow = m ? +m[1] : 0, oh = m ? +m[2] : 0;
    const lgW = Math.min(1800, ow || 1800);
    const lgH = Math.round((oh / ow) * lgW);
    for (const [suffix, w, q] of [["lg", lgW, 4], ["sm", 700, 4]]) {
      execFileSync(FF, ["-y", "-i", src, "-vf", `scale=${w}:-2:flags=lanczos`, "-q:v", String(q),
        join(IMG_OUT, project, `${n}-${suffix}.jpg`)], { stdio: "ignore" });
    }
    entry.photos.push({ file: n, width: lgW, height: lgH });
  });

  for (const f of videos) {
    const src = join(dir, f);
    const info = probe(src);
    const m = info.match(/,\s(\d{2,5})x(\d{2,5})[\s,]/);
    const w = m ? +m[1] : 1920, h = m ? +m[2] : 1080;
    const hasAudio = /Audio:/.test(info);
    const slug = basename(f, extname(f)).toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
    mkdirSync(VID_OUT, { recursive: true });
    const outFile = join(VID_OUT, `${slug}.mp4`);
    // Cap the long edge at 1920 so verticals stay 1080x1920 and
    // landscape stays 1920x…; never upscale.
    const scale = w >= h ? `scale='min(1920,iw)':-2` : `scale=-2:'min(1920,ih)'`;
    const args = ["-y", "-i", src, "-vf", `${scale},format=yuv420p`,
      "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "24",
      "-maxrate", "5000k", "-bufsize", "10M", "-movflags", "+faststart"];
    if (hasAudio) args.push("-c:a", "aac", "-b:a", "128k"); else args.push("-an");
    args.push(outFile);
    execFileSync(FF, args, { stdio: "ignore" });
    const od = probe(outFile).match(/,\s(\d{2,5})x(\d{2,5})[\s,]/);
    execFileSync(FF, ["-y", "-ss", "2", "-i", outFile, "-frames:v", "1",
      "-vf", "scale=700:-2", "-q:v", "4",
      join(IMG_OUT, project, `${slug}-poster.jpg`)], { stdio: "ignore" });
    entry.clips.push({ slug, width: od ? +od[1] : w, height: od ? +od[2] : h, audio: hasAudio });
  }

  manifest[genre][project] = entry;
  console.log(`✓ ${project}: ${entry.photos.length} photos, ${entry.clips.length} clips`);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nmanifest written: ${MANIFEST}`);
