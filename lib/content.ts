/**
 * Site content. Edit copy, categories, projects, and galleries here —
 * the components read from this file.
 *
 * PLACEHOLDER IMAGERY: everything under /images/reel is a still pulled
 * from the BA 2024 showreel, standing in until the client photo sets
 * arrive. Swap the `photos` arrays below and nothing else needs to move.
 */

import { media } from "./media";
import manifest from "./media-manifest.json";

export type Photo = {
  src: string;
  /** 700px variant, served to small slots via srcset. */
  srcSmall: string;
  alt: string;
  width: number;
  height: number;
};

export type Clip = {
  src: string;
  poster: string;
  alt: string;
  /** True dimensions. The set is not one shape — 9:16 social cuts sit
   *  alongside 4:3 and 16:9 edits — so each clip carries its own ratio
   *  rather than being forced into a shared slot. */
  width: number;
  height: number;
};

/** Reel stills are all 1400x788 (16:9 from the 4K master). */
const reel = (file: string, alt: string): Photo => ({
  src: `/images/reel/${file}.jpg`,
  srcSmall: `/images/reel/${file}-sm.jpg`,
  alt,
  width: 1400,
  height: 788,
});

export const photos = {
  beam: { src: "/images/beam.jpg", srcSmall: "/images/beam-sm.jpg", alt: "Laser rig fanning out over a live DJ set", width: 1301, height: 704 },
  mask: { src: "/images/mask.jpg", srcSmall: "/images/mask-sm.jpg", alt: "Masked performer on stage against an LED wall", width: 1247, height: 854 },
  confetti: { src: "/images/confetti.jpg", srcSmall: "/images/confetti-sm.jpg", alt: "Guitarist walking through falling confetti", width: 893, height: 590 },
} satisfies Record<string, Photo>;

export const heroVideo = {
  src: media("/videos/hero-1080.mp4"),
  srcMobile: media("/videos/hero-720.mp4"),
  poster: "/images/hero-poster.jpg",
  width: 1920,
  height: 1080,
  alt: "FrameOne showreel",
};

/** Full-bleed backdrop for Who We Are. Seamlessly looped. */
export const studioVideo = {
  src: media("/videos/athirappalli-1080.mp4"),
  srcMobile: media("/videos/athirappalli-720.mp4"),
  poster: "/images/athirappalli-poster.jpg",
  alt: "Figure silhouetted against Athirappilly falls at golden hour",
};

export const studio = {
  name: "FrameOne",
  legalName: "FrameOne Global",
  tagline: "Crafting stories, frame by frame.",
  email: "frameone.global@gmail.com",
  /* Digits only for wa.me and tel:; the display form is derived. */
  phone: "918197402298",
  phoneDisplay: "+91 81974 02298",
  location: "Bangalore, IN",
  reach: "Worldwide",
  intro: "Media production. Bangalore, operating worldwide.",
  disciplineSummary: [
    "Live events",
    "Corporate films",
    "Fashion · Automotive",
    "Sports, Concerts & Festivals",
  ],
};

export const heroLines = ["Crafting stories,", "frame by frame."];

/* ---------------- Page 2 — Who We Are ---------------- */
export const whoWeAre = {
  label: "Who we are",
  heading: "We don't just cover the room. We make you feel like you were in it.",
  body: "We don't just capture moments — we turn them into stories people remember. From high-energy live events and cinematic brand films to fashion and automotive productions, we bring together creative vision, technical precision, and flawless execution to create visuals that demand attention. With an end-to-end production approach and a team that thrives under pressure, we transform ideas into powerful visual experiences — because every frame should have a purpose, and every story deserves to be unforgettable.",
};

/* ---------------- Automotive — client media ----------------
 * Built from lib/media-manifest.json, which scripts/process-media.mjs
 * writes when it encodes a genre. Dimensions come from the encoded
 * files rather than being declared by hand — assuming them is what
 * cropped the portrait frames last time.
 *
 * Titles live here because a folder slug is not a display name.
 */
type ManifestPhoto = { file: string; width: number; height: number };
type ManifestClip = { slug: string; width: number; height: number; audio: boolean };
type ManifestProject = { photos: ManifestPhoto[]; clips: ManifestClip[] };
type Manifest = Record<string, Record<string, ManifestProject>>;

const PROJECT_INFO: Record<string, { title: string; meta: string }> = {
  "f1-abudhabi": { title: "F1 Abu Dhabi 2025", meta: "Motorsport · Stills & film" },
  "flying-flea": { title: "Royal Enfield Flying Flea Launch", meta: "Launch · Brand" },
  "jawa-ride-blr": { title: "Jawa Ride Shoot", meta: "Ride · Bangalore" },
  "re-odyssey": { title: "Royal Enfield Himalayan Odyssey 2026", meta: "Expedition · Brand film" },
  akon: { title: "Akon, Bangalore", meta: "Live · Film" },
  "almost-human": { title: "Almost Human", meta: "Live · Stills" },
  "ben-bohmer": { title: "Ben Böhmer", meta: "Live · Film" },
  "calvin-harris": { title: "Calvin Harris", meta: "Live · Stills" },
  "karan-aujla": { title: "Karan Aujla", meta: "Live · Stills" },
  "lolla-25-shawn-mendez": { title: "Lollapalooza 2025 — Shawn Mendes", meta: "Festival · Stills" },
  "lolla-26-linkin-park": { title: "Lollapalooza 2026 — Linkin Park", meta: "Festival · Stills" },
  "lolla-26-playboi-carti": { title: "Lollapalooza 2026 — Playboi Carti", meta: "Festival · Stills & film" },
  "mix-before-2026": { title: "Selected Work — before 2026", meta: "Live · Stills" },
  "sula-fest-26": { title: "Sula Fest 2026", meta: "Festival · Stills" },
  "un-40": { title: "UN 40", meta: "Live · Stills" },
};

/** Builds a genre's projects from the manifest. */
function projectsFrom(genre: string): Project[] {
  const genreEntry = (manifest as Manifest)[genre] ?? {};
  return Object.entries(genreEntry)
    .map(([slug, entry]) => {
      const info = PROJECT_INFO[slug] ?? { title: slug, meta: "Project" };
      const photos: Photo[] = entry.photos.map((p) => ({
        // Both sizes are served from the repo. Cloudflare Pages already
        // delivers /public from the same edge network as R2, so there is
        // no speed gain in moving them — and same-origin avoids a second
        // connection handshake. Only video is on the CDN, for deploy size.
        src: `/images/${genre}/${slug}/${p.file}-lg.jpg`,
        srcSmall: `/images/${genre}/${slug}/${p.file}-sm.jpg`,
        // Neutral by design: these describe position, not content. Real
        // captions need someone who has seen the frames.
        alt: `${info.title} — frame ${p.file}`,
        width: p.width,
        height: p.height,
      }));
      const clips: Clip[] = entry.clips.map((c) => ({
        src: media(`/videos/${genre}/${c.slug}.mp4`),
        poster: `/images/${genre}/${slug}/${c.slug}-poster.jpg`,
        alt: `${info.title} — film`,
        width: c.width,
        height: c.height,
      }));
      return {
        slug,
        title: info.title,
        meta: info.meta,
        cover: photos[0],
        photos,
        clips: clips.length ? clips : undefined,
      } as Project;
    })
    .filter((p) => p.photos.length > 0 || (p.clips?.length ?? 0) > 0);
}

/** A spread of automotive frames for the collage panel, taken across
 *  projects rather than all from one shoot. */
function automotiveCollageFrames(): Photo[] {
  const all = projectsFrom("automotive").flatMap((p) => p.photos);
  if (all.length <= 4) return all;
  const step = Math.floor(all.length / 4);
  return [0, 1, 2, 3].map((i) => all[i * step]);
}

/* ---------------- Page 3 — Collage ----------------
 * Three self-contained slideshows. Each pulls only from its own genre;
 * nothing is shared between them.
 */
export type CollagePanel = {
  key: string;
  label: string;
  frames: Photo[];
};

export const collage = {
  heading: "Image first, every frame is a decision.",
  label: "Selected frames",
  panels: [
    {
      key: "artist",
      label: "Artist",
      frames: [
        reel("concert-artist", "Artist facing a full arena crowd"),
        reel("concert-flames", "Performer between flame columns"),
        reel("concert-duo", "Two performers framed by flame jets"),
        reel("concert-dj", "DJ booth with stage mascot and pyro"),
      ],
    },
    {
      key: "nature",
      label: "Nature",
      frames: [
        reel("travel-reef", "Diver silhouetted against open water"),
        reel("travel-forest", "Standing among tall pines"),
        reel("travel-coast", "Surf breaking against the coastline"),
        reel("travel-snow", "Lone figure crossing deep snow"),
      ],
    },
    {
      key: "automotive",
      label: "Automotive",
      // Drawn from the real automotive work via the manifest, so this
      // panel follows whatever is actually on disk.
      frames: automotiveCollageFrames(),
    },
  ] satisfies CollagePanel[],
};

/* ---------------- Our Projects ---------------- */
export type Project = {
  slug: string;
  title: string;
  meta: string;
  cover: Photo;
  photos: Photo[];
  /** Films belonging to this project, shown ahead of the stills. */
  clips?: Clip[];
};

export type Category = {
  slug: string;
  title: string;
  blurb: string;
  projects: Project[];
  /** Named on the Our Projects row. Deliberately a short display list,
   *  not every project in the gallery — the row is a signpost, and a
   *  dozen titles in it reads as a directory. */
  highlights: string[];
};

const CATEGORY_DEFS: Category[] = [
  {
    slug: "concerts-festivals",
    highlights: ["Lollapalooza", "Rolling Loud", "UN 40"],
    title: "Concerts & Festivals",
    blurb: "Multi-camera live coverage, same-day cuts, and festival films.",
    projects: projectsFrom("concerts"),
  },
  {
    slug: "travel",
    highlights: [],
    title: "Travel",
    blurb: "Long-form journeys, brand expeditions, and destination films.",
    projects: [
      {
        slug: "royal-enfield-odyssey-2026",
        title: "Royal Enfield Odyssey 2026",
        meta: "Expedition · Brand film",
        cover: reel("travel-enfield", "Rider on a Royal Enfield along the shoreline"),
        photos: [
          reel("travel-enfield", "Rider on a Royal Enfield along the shoreline"),
          reel("auto-moto", "Motorcycle tracking shot on wet sand"),
          reel("travel-sunset", "Rider silhouetted at sunset"),
          reel("travel-horse", "Horse and rider on the ridge at dusk"),
          reel("travel-coast", "Surf breaking against the coastline"),
        ],
      },
      {
        slug: "high-country",
        title: "High Country",
        meta: "Expedition · Documentary",
        cover: reel("travel-snow", "Lone figure crossing deep snow"),
        photos: [
          reel("travel-snow", "Lone figure crossing deep snow"),
          reel("travel-forest", "Standing among tall pines"),
          reel("travel-ocean", "Open water from the deck"),
          reel("travel-reef", "Diver silhouetted against open water"),
        ],
      },
      {
        slug: "desert-lines",
        title: "Desert Lines",
        meta: "Fashion · Location",
        cover: reel("travel-desert", "Figure on the dune ridge at first light"),
        photos: [
          reel("travel-desert", "Figure on the dune ridge at first light"),
          reel("travel-temple", "Courtyard architecture in warm light"),
          reel("travel-sunset", "Coastline at last light"),
        ],
      },
    ],
  },
  {
    slug: "automotive",
    highlights: ["Royal Enfield Odyssey 2026", "F1 Abu Dhabi", "F1 Singapore"],
    title: "Automotive",
    blurb: "Race weekends, launches, rides and expedition films.",
    projects: projectsFrom("automotive"),
  },
  {
    slug: "corporate",
    highlights: ["Visit Saudi", "SEZ", "Google IO"],
    title: "Corporate Work",
    blurb: "Brand films, founder stories, launches, and event capture.",
    projects: [
      {
        slug: "founder-series",
        title: "Founder Series",
        meta: "Corporate · Interview",
        cover: reel("corp-interview", "Interview setup, monochrome"),
        photos: [
          reel("corp-interview", "Interview setup, monochrome"),
          reel("corp-greenroom", "Green room portrait under mirror lights"),
          reel("corp-rooftop", "Rooftop portrait at blue hour"),
        ],
      },
      {
        slug: "on-location",
        title: "On Location",
        meta: "Corporate · BTS",
        cover: reel("corp-camera", "Camera operator shooting on location"),
        photos: [
          reel("corp-camera", "Camera operator shooting on location"),
          reel("corp-street", "Crew moving through the city"),
          reel("corp-rooftop", "Rooftop portrait at blue hour"),
        ],
      },
    ],
  },
  {
    slug: "sports",
    highlights: ["Hyrox", "IPL", "WTL Tennis"],
    title: "Sports",
    blurb: "Match days, tournaments, and the moment the trophy goes up.",
    projects: [
      {
        slug: "finals-night",
        title: "Finals Night",
        meta: "Sport · Tournament",
        cover: reel("sports-trophy", "Trophy lifted above the crowd"),
        photos: [
          reel("sports-trophy", "Trophy lifted above the crowd"),
          reel("sports-football", "Player striking the ball mid-run"),
          reel("concert-crowd", "Stands full at golden hour"),
        ],
      },
    ],
  },
];

/* Display order, kept separate from the definitions so reordering does
 * not mean moving hundreds of lines. Travel sits last while it has no
 * work in it yet. */
const CATEGORY_ORDER = [
  "concerts-festivals",
  "automotive",
  "corporate",
  "sports",
  "travel",
];

export const categories: Category[] = CATEGORY_ORDER.map(
  (slug) => CATEGORY_DEFS.find((c) => c.slug === slug)!,
).filter(Boolean);

/**
 * Every frame in a genre, pooled across its projects into one set.
 * Projects legitimately share stills, so identical sources are folded
 * together — the gallery is one continuous body of work, not a set of
 * sub-galleries stitched end to end.
 */
export function poolGallery(category: Category): Photo[] {
  const seen = new Set<string>();
  const pooled: Photo[] = [];
  for (const project of category.projects) {
    for (const photo of project.photos) {
      if (seen.has(photo.src)) continue;
      seen.add(photo.src);
      pooled.push(photo);
    }
  }
  return pooled;
}

/** Every film in a genre, pooled across its projects. */
export function poolClips(category: Category): Clip[] {
  const seen = new Set<string>();
  const pooled: Clip[] = [];
  for (const project of category.projects) {
    for (const clip of project.clips ?? []) {
      if (seen.has(clip.src)) continue;
      seen.add(clip.src);
      pooled.push(clip);
    }
  }
  return pooled;
}

export type GalleryItem =
  | { kind: "photo"; photo: Photo }
  | { kind: "clip"; clip: Clip };

/**
 * Photos and films woven together rather than films clustered at the
 * top. Positions are computed, not random, so the order is identical on
 * the server and the client and stable across re-renders — a genuinely
 * random shuffle would cause a hydration mismatch and reshuffle on
 * every state change.
 */
export function galleryItems(category: Category): GalleryItem[] {
  const photos = poolGallery(category);
  const clips = poolClips(category);
  if (clips.length === 0) return photos.map((photo) => ({ kind: "photo", photo }));

  const items: GalleryItem[] = photos.map((photo) => ({ kind: "photo", photo }));
  // Spread the films evenly through the run, skipping the lead slot so
  // the set still opens on a still.
  const step = (items.length + 1) / (clips.length + 1);
  clips.forEach((clip, i) => {
    const at = Math.min(
      items.length,
      Math.max(1, Math.round(step * (i + 1)) + i)
    );
    items.splice(at, 0, { kind: "clip", clip });
  });
  return items;
}


/**
 * The gallery grouped by project rather than pooled into one run.
 * Each section keeps its own films woven among its own stills, so a
 * viewer can see which shoot a frame belongs to.
 */
export type ProjectSection = {
  slug: string;
  title: string;
  meta: string;
  items: GalleryItem[];
  photos: Photo[];
};

export function projectSections(category: Category): ProjectSection[] {
  return category.projects
    .map((project) => {
      const photos = project.photos;
      const clips = project.clips ?? [];
      const items: GalleryItem[] = photos.map((photo) => ({ kind: "photo", photo }));
      // Films spread through the section's own stills, computed rather
      // than random so server and client agree and order is stable.
      if (clips.length) {
        const step = (items.length + 1) / (clips.length + 1);
        clips.forEach((clip, i) => {
          const at = Math.min(items.length, Math.max(1, Math.round(step * (i + 1)) + i));
          items.splice(at, 0, { kind: "clip", clip });
        });
      }
      return {
        slug: project.slug,
        title: project.title,
        meta: project.meta,
        items,
        photos,
      };
    })
    .filter((s) => s.items.length > 0);
}

/** Marquee strip beneath Our Projects. */
export const genreStrip = [
  "Concerts & Festivals",
  "Travel",
  "Automotive",
  "Corporate Work",
  "Sports",
  "Fashion",
  "Brand Films",
  "Aerial",
  "Post & Grade",
];

/* ---------------- Work showcase (page 3) ---------------- */
export type Showcase = {
  index: string;
  title: string;
  categorySlug: string;
  meta: string;
  slides: Photo[];
};

/** Genre definitions for the three work panels. Slides are derived
 *  from each genre's own pool below, never hand-listed — so when a
 *  genre's folder is populated its panel picks the images up with no
 *  further wiring. */
const SHOWCASE_DEFS = [
  {
    index: "01",
    title: "Concerts & Festivals",
    categorySlug: "concerts-festivals",
    meta: "Multi-cam · Live · Same-day",
  },
  {
    index: "02",
    title: "Automotive",
    categorySlug: "automotive",
    meta: "Rig · Drone · Reveal",
  },
  {
    index: "03",
    title: "Corporate Shoots",
    categorySlug: "corporate",
    meta: "Brand · Interview · Launch",
  },
];

export const showcases: Showcase[] = SHOWCASE_DEFS.map((def) => {
  const category = categories.find((c) => c.slug === def.categorySlug);
  return {
    ...def,
    // Each panel draws only from its own genre.
    slides: category ? poolGallery(category).slice(0, 5) : [],
  };
});

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Our Projects" },
  { href: "#contact", label: "Contact" },
];

export const socials = [
  {
    label: "Instagram",
    handle: "@frameone.hq",
    href: "https://www.instagram.com/frameone.hq/",
    icon: "instagram",
  },
  {
    label: "WhatsApp",
    handle: studio.phoneDisplay,
    href: `https://wa.me/${studio.phone}`,
    icon: "whatsapp",
  },
] as const;


/* ---------------- Polaroid grid (Selected Frames) ----------------
 * Six genre tiles, three to a row. Only Automotive has client footage
 * so far; the rest run PLACEHOLDER_FILM.
 *
 * ===> TO DROP IN A REAL GENRE FILM <===
 * Nothing structural changes. Either encode the genre's clips into
 * lib/media-manifest.json (scripts/process-media.mjs does this) and the
 * tile picks the first one up automatically, or set `film` on that
 * genre's entry in WORK_DEFS below. `pending` flips itself.
 */
export type WorkTile = {
  slug: string;
  title: string;
  film: string;
  poster: string;
  /** Shown on hover: the one project the tile’s film belongs to. */
  project: string;
  /** True while the tile is running placeholder footage. */
  pending: boolean;
  /** False for genres with no gallery behind them yet. */
  hasGallery: boolean;
};

const PLACEHOLDER_FILM = media("/videos/hero-720.mp4");

/**
 * ===> THE ONE PLACE TO PUT A GENRE FILM <===
 *
 * One short loop per genre for its polaroid tile. To add one:
 *   1. Name the file after the genre slug — sports.mp4, fashion.mp4 —
 *      and put it under videos/genres/ wherever media is served from.
 *      With NEXT_PUBLIC_MEDIA_CDN set (see .env.production) that is the
 *      R2 bucket; with it unset it is public/videos/genres/ in this
 *      repo.
 *   2. Flip that genre's line below from null to the path.
 * Nothing else changes — the tile drops its placeholder and stops
 * reporting itself as pending.
 *
 * Left null, a genre falls back to its first gallery clip if it has
 * one, and to the showreel placeholder if it does not.
 */
const GENRE_FILMS: Record<string, string | null> = {
  "concerts-festivals": media("/videos/genres/concerts-festivals.mp4"),
  automotive: media("/videos/genres/automotive.mp4"),
  corporate: media("/videos/genres/corporate.mp4"),
  sports: null, // media("/videos/genres/sports.mp4")
  travel: media("/videos/genres/travel.mp4"),
  fashion: media("/videos/genres/fashion.mp4"),
};

const WORK_DEFS: { slug: string; title?: string }[] = [
  { slug: "concerts-festivals" },
  { slug: "automotive" },
  { slug: "corporate" },
  { slug: "sports" },
  { slug: "travel" },
  { slug: "fashion", title: "Fashion" },
];

export const workTiles: WorkTile[] = WORK_DEFS.map((def) => {
  const category = categories.find((c) => c.slug === def.slug);
  const clip = category ? poolClips(category)[0] : undefined;
  const still = category ? poolGallery(category)[0] : undefined;
  return {
    slug: def.slug,
    title: def.title ?? category?.title ?? def.slug,
    /* Never the gallery clip. Those run 14-22MB each — fine for the
       reel view where the film is the point, ruinous for a grid of six
       that autoplays. A tile takes its purpose-made loop or the light
       placeholder, nothing else. */
    film: GENRE_FILMS[def.slug] ?? PLACEHOLDER_FILM,
    /* The small still, not the large one: this is a poster behind a
       muted loop, never examined at full size. */
    poster: clip?.poster ?? still?.srcSmall ?? heroVideo.poster,
    /* The project that owns the film actually on screen — not a list.
       While a genre is still on placeholder footage there is no such
       project, so it names that genre’s first real project instead; the
       moment its own film lands this resolves to the exact match. */
    project:
      (clip &&
        category?.projects.find((p) =>
          (p.clips ?? []).some((c) => c.src === clip.src),
        )?.title) ??
      category?.projects[0]?.title ??
      "",
    pending: !GENRE_FILMS[def.slug],
    hasGallery: (category?.projects.length ?? 0) > 0,
  };
});
