/**
 * Where the heavy media is served from.
 *
 * Unset, every file resolves to the copy committed under /public — the
 * site works from a clean clone with no external dependency, which is
 * what we want for local work and for a first deploy.
 *
 * Set NEXT_PUBLIC_MEDIA_CDN to an R2 (or any CDN) base URL and the same
 * paths resolve there instead, so the video files can leave the repo
 * without a single component changing. The value is read at build time —
 * this is a static export — so switching means setting the variable and
 * rebuilding.
 *
 *   NEXT_PUBLIC_MEDIA_CDN=https://media.frameonehq.com
 *
 * Posters and stills deliberately stay in the repo: they total a few MB,
 * they are needed for first paint, and same-origin keeps them simple.
 */
const BASE = (process.env.NEXT_PUBLIC_MEDIA_CDN ?? "").replace(/\/+$/, "");

/** Resolves a /videos/... path against the CDN when one is configured. */
export function media(path: string): string {
  if (!BASE) return path;
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** True when media is being served from a CDN rather than the repo. */
export const usingCdn = BASE.length > 0;
