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
