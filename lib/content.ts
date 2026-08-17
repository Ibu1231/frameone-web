/**
 * Site content. Edit copy, categories, projects, and galleries here —
 * the components read from this file.
 *
 * PLACEHOLDER IMAGERY: everything under /images/reel is a still pulled
 * from the BA 2024 showreel, standing in until the client photo sets
 * arrive. Swap the `photos` arrays below and nothing else needs to move.
 */

export type Photo = {
  src: string;
  /** 700px variant, served to small slots via srcset. */
  srcSmall: string;
  alt: string;
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
  src: "/videos/hero-1080.mp4",
  srcMobile: "/videos/hero-720.mp4",
  poster: "/images/hero-poster.jpg",
  width: 1920,
  height: 1080,
  alt: "FrameOne showreel",
};

/** Full-bleed backdrop for Who We Are. Seamlessly looped. */
export const studioVideo = {
  src: "/videos/athirappalli-1080.mp4",
  srcMobile: "/videos/athirappalli-720.mp4",
  poster: "/images/athirappalli-poster.jpg",
  alt: "Figure silhouetted against Athirappilly falls at golden hour",
};

export const studio = {
  name: "FrameOne",
  legalName: "FrameOne Global",
  tagline: "Crafting stories, frame by frame.",
  email: "hello@frameonehq.com",
  location: "Bangalore, IN",
  reach: "Worldwide",
  intro: "FrameOne Global — media production. Bangalore, operating worldwide.",
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
  body: "At FrameOne, we don't just capture moments — we turn them into stories people remember. From high-energy live events and cinematic brand films to fashion and automotive productions, we bring together creative vision, technical precision, and flawless execution to create visuals that demand attention. With an end-to-end production approach and a team that thrives under pressure, we transform ideas into powerful visual experiences — because every frame should have a purpose, and every story deserves to be unforgettable.",
};

/* ---------------- Automotive — client media ---------------- */

/** F1 stills. Originals (up to 5472x3648) are archived in
 *  assets-source; these are the web derivatives. */
const auto = (n: string, alt: string, portrait = false): Photo => ({
  src: `/images/automotive/${n}-lg.jpg`,
  srcSmall: `/images/automotive/${n}-sm.jpg`,
  alt,
  width: 1800,
  // Three of the set are shot portrait. Declaring them all landscape
  // gave every consumer the wrong aspect to reserve and to fit against.
  height: portrait ? 2700 : 1200,
});

export const automotivePhotos: Photo[] = [
  auto("f1-01", "Driver portrait in the pit lane"),
  auto("f1-02", "Car on track through the esses", true),
  auto("f1-03", "Pit crew mid tyre change"),
  auto("f1-04", "Front wing detail on the grid"),
  auto("f1-05", "Car at speed under braking"),
  auto("f1-06", "Garage monitors during qualifying"),
  auto("f1-07", "Grandstand crowd on race day"),
  auto("f1-08", "Car exiting the final corner"),
  auto("f1-09", "Tyre stacks in the paddock"),
  auto("f1-10", "Driver helmet before the formation lap"),
  auto("f1-11", "Track-side panning shot at speed", true),
  auto("f1-12", "Team radio and timing screens", true),
  auto("f1-13", "Car on the main straight"),
  auto("f1-14", "Podium celebration"),
];

export type Clip = {
  src: string;
  poster: string;
  alt: string;
  /** Vertical social cuts — 9:16, not 16:9. */
  portrait: boolean;
};

export const automotiveClips: Clip[] = [
  {
    src: "/videos/automotive/raceday.mp4",
    poster: "/images/automotive/raceday-poster.jpg",
    alt: "Afterpeak — race day film",
    portrait: true,
  },
  {
    src: "/videos/automotive/qualifying.mp4",
    poster: "/images/automotive/qualifying-poster.jpg",
    alt: "Afterpeak — F1 qualifying day film",
    portrait: true,
  },
];

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
      // Real client work now that the F1 set has landed.
      frames: [
        automotivePhotos[1],
        automotivePhotos[4],
        automotivePhotos[7],
        automotivePhotos[12],
      ],
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
};

export const categories: Category[] = [
  {
    slug: "concerts-festivals",
    title: "Concerts & Festivals",
    blurb: "Multi-camera live coverage, same-day cuts, and festival films.",
    projects: [
      {
        slug: "lollapalooza",
        title: "Lollapalooza",
        meta: "Festival · Multi-cam",
        cover: reel("concert-mainstage", "Festival mainstage with pyrotechnics"),
        photos: [
          reel("concert-mainstage", "Festival mainstage with pyrotechnics"),
          reel("concert-crowd", "Festival crowd at golden hour"),
          reel("concert-pyro", "Wall of flame jets across the stage"),
          reel("concert-wide", "Wide of the stage and full field"),
          photos.beam,
        ],
      },
      {
        slug: "rolling-loud",
        title: "Rolling Loud",
        meta: "Festival · Live",
        cover: reel("concert-lasers", "Laser array over a live set"),
        photos: [
          reel("concert-lasers", "Laser array over a live set"),
          reel("concert-dj", "DJ booth with stage mascot and pyro"),
          reel("concert-duo", "Two performers framed by flame jets"),
          photos.mask,
          photos.confetti,
        ],
      },
      {
        slug: "arena-tour",
        title: "Arena Tour",
        meta: "Tour · Headline",
        cover: reel("concert-artist", "Artist facing a full arena crowd"),
        photos: [
          reel("concert-artist", "Artist facing a full arena crowd"),
          reel("concert-flames", "Performer between flame columns"),
          photos.confetti,
          reel("concert-crowd", "Crowd with phones raised"),
        ],
      },
    ],
  },
  {
    slug: "travel",
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
    title: "Automotive",
    blurb: "Race weekends, rig and rolling work, reveal films.",
    projects: [
      {
        slug: "afterpeak-f1",
        title: "Afterpeak — F1 Race Weekend",
        meta: "Motorsport · Stills & film",
        cover: automotivePhotos[0],
        photos: automotivePhotos,
        clips: automotiveClips,
      },
      {
        slug: "coast-run",
        title: "Coast Run",
        meta: "Automotive · Rolling",
        cover: reel("auto-porsche", "Sports car tracked at speed on open road"),
        photos: [
          reel("auto-porsche", "Sports car tracked at speed on open road"),
          reel("auto-moto", "Motorcycle tracking shot on wet sand"),
          reel("travel-enfield", "Rider on a Royal Enfield along the shoreline"),
        ],
      },
    ],
  },
  {
    slug: "corporate",
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
  { href: "#who-we-are", label: "Studio" },
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Our Projects" },
  { href: "#contact", label: "Contact" },
];

export const socials = [
  { label: "Instagram", href: "#" },
  { label: "Vimeo", href: "#" },
  { label: "YouTube", href: "#" },
];

