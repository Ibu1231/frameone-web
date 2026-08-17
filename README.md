# FrameOne — website

Marketing site for **FrameOne Global**, a Bangalore-based media production
company working across live events, corporate films, fashion, and automotive.

Built with Next.js (App Router) and exported as a fully static site, so it can
be hosted on any static host with no server runtime.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Building

```bash
npm run build
```

`output: "export"` writes a complete static site to `./out`. That folder is what
gets deployed. It is gitignored — the host rebuilds it from source on every push.

To preview the built output exactly as it will be served:

```bash
npx serve out
```

## How the page is put together

The site is a single scrolling page made of **full-viewport sticky panels**.
Each section is a `.chapter` (a tall spacer) containing a `.panel` that is
`position: sticky; top: 0; height: 100svh`. As you scroll, each panel pins in
place and is then covered by the next one, which produces the layered,
cinematic pacing.

`components/ScrollChoreography.tsx` runs a single `requestAnimationFrame` loop
that reads each chapter's scroll progress and maps it to transforms — the hero
photo plane lifting away, work photographs slowly pushing in, titles rising out
of their masks. It is one loop rather than per-component scroll listeners so
everything stays on the same frame and there is no listener pile-up.

### Where things live

| Path | What it is |
|---|---|
| `lib/content.ts` | **All site copy, projects, and disciplines.** Edit here to change what the site says. |
| `app/layout.tsx` | Fonts, `<head>` metadata, Open Graph tags |
| `app/globals.css` | Design tokens and the sticky panel system |
| `components/` | One component per panel, each with its own CSS module |
| `public/images/` | Photography |

### Changing content

Almost all copy, project names, and image captions live in `lib/content.ts`.
Adding a project means adding an entry to the `projects` array and dropping the
photo into `public/images/`.

## Images

Photographs are served as real files from `public/images/` and referenced with
explicit `width`/`height` so the browser reserves space and the layout does not
shift while they load. Below-the-fold images are lazy-loaded.

Next's built-in image optimizer needs a server, so it is disabled
(`images.unoptimized`) for the static export. When the high-resolution
photography lands, the intended upgrade is to generate AVIF/WebP variants at
multiple widths and serve them via `srcset`, or point a custom image loader at
a CDN (Cloudflare Images / Cloudinary).

## Accessibility and motion

- Every animation is disabled or reduced under `prefers-reduced-motion`.
- The decorative split headline is `aria-hidden`; the document's real `<h1>` is
  visually hidden but present for screen readers and search engines.
- Interactive controls are real `<button>`s with labels, and focus is visible.

## Deploying

The build output is static, so any of Cloudflare Pages, Netlify, or Vercel works.

- **Build command:** `npm run build`
- **Output directory:** `out`

The production domain is `frameonehq.com`.

## Media hosting

Video is the heaviest thing on the site. It currently ships **from the
repo** — `public/videos` is committed, so a clean clone builds a working
site with no external dependency. That is deliberate for now.

Every video URL resolves through `lib/media.ts`. Set one environment
variable and the same paths resolve to a CDN instead, with no component
changes:

```
NEXT_PUBLIC_MEDIA_CDN=https://media.frameonehq.com
```

It is read at build time (this is a static export), so switching means
setting the variable in the host's build settings and redeploying.

### Moving video to Cloudflare R2

1. Create an R2 bucket, then enable public access on it (or attach a
   custom domain such as `media.frameonehq.com`).
2. `npx wrangler login` once.
3. Upload — paths are preserved, so `/videos/automotive/gt-cup.mp4`
   lands at the same path in the bucket:

   ```bash
   npm run media:upload -- --bucket <bucket-name>
   ```

   Add `--dry-run` first to see what would go.
4. Set `NEXT_PUBLIC_MEDIA_CDN` in the host's environment and rebuild.
5. Confirm the deployed site plays video from the CDN, **then** remove
   `public/videos/*.mp4` from the repo and add them to `.gitignore`.
   Doing that before step 4 is verified would ship a site with no video.

Stills stay in the repo either way: a few MB in total, needed for first
paint, and simpler same-origin.

### Why R2 rather than Cloudflare Stream

R2 is a straight file swap — the site keeps its own `<video>` elements
and the encodes already made. Stream would add adaptive bitrate, so a
viewer on a weak connection gets a lower rendition instead of buffering,
but it needs an HLS player and a different embed. Worth moving to if
buffering shows up in practice; not worth the indirection before then.

### Masters

Camera and edit masters live in `assets-source/`, outside the deploy
path, and are gitignored by container type (`.mov`, `.mxf`, `.mkv`,
`.avi`). Anything under `public/` is copied verbatim into the export, so
masters must never be placed there — they would be served to visitors.
