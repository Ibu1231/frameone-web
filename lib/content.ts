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
  alt: string;
  width: number;
  height: number;
};

/** Reel stills are all 1400x788 (16:9 from the 4K master). */
const reel = (file: string, alt: string): Photo => ({
  src: `/images/reel/${file}.jpg`,
  alt,
  width: 1400,
  height: 788,
});

export const photos = {
  beam: { src: "/images/beam.jpg", alt: "Laser rig fanning out over a live DJ set", width: 1301, height: 704 },
  mask: { src: "/images/mask.jpg", alt: "Masked performer on stage against an LED wall", width: 1247, height: 854 },
  confetti: { src: "/images/confetti.jpg", alt: "Guitarist walking through falling confetti", width: 893, height: 590 },
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

/* ---------------- Page 3 — Collage ---------------- */
export const collage = {
  overlay: "Image first, every frame is a decision.",
  tiles: [
    reel("concert-artist", "Artist mid-performance under stage light"),
    reel("travel-reef", "Diver silhouetted against open water"),
    reel("auto-porsche", "Sports car tracked at speed on open road"),
  ],
};

/* ---------------- Our Projects ---------------- */
export type Project = {
  slug: string;
  title: string;
  meta: string;
  cover: Photo;
  photos: Photo[];
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
    blurb: "Rig, drone, and studio work — reveal films and rolling shots.",
    projects: [
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

export const showcases: Showcase[] = [
  {
    index: "01",
    title: "Concerts & Festivals",
    categorySlug: "concerts-festivals",
    meta: "Multi-cam · Live · Same-day",
    slides: [
      reel("concert-mainstage", "Festival mainstage with pyrotechnics"),
      reel("concert-lasers", "Laser array over a live set"),
      reel("concert-crowd", "Festival crowd at golden hour"),
      reel("concert-pyro", "Wall of flame jets across the stage"),
    ],
  },
  {
    index: "02",
    title: "Automotive",
    categorySlug: "automotive",
    meta: "Rig · Drone · Reveal",
    slides: [
      reel("auto-porsche", "Sports car tracked at speed on open road"),
      reel("travel-enfield", "Rider on a Royal Enfield along the shoreline"),
      reel("auto-moto", "Motorcycle tracking shot on wet sand"),
    ],
  },
  {
    index: "03",
    title: "Corporate Shoots",
    categorySlug: "corporate",
    meta: "Brand · Interview · Launch",
    slides: [
      reel("corp-interview", "Interview setup, monochrome"),
      reel("corp-camera", "Camera operator shooting on location"),
      reel("corp-rooftop", "Rooftop portrait at blue hour"),
    ],
  },
];

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
