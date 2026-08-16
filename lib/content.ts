/**
 * Site content. Edit copy, projects, and disciplines here — the
 * components read from this file, so nothing below needs touching
 * to change what the site says.
 */

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const photos = {
  beam: {
    src: "/images/beam.jpg",
    alt: "Laser rig fanning out over a live DJ set",
    width: 1301,
    height: 704,
  },
  mask: {
    src: "/images/mask.jpg",
    alt: "Masked performer on stage against an LED wall",
    width: 1247,
    height: 854,
  },
  confetti: {
    src: "/images/confetti.jpg",
    alt: "Guitarist walking through falling confetti at an arena show",
    width: 893,
    height: 590,
  },
} satisfies Record<string, Photo>;

/**
 * Hero film. Source master lives in /assets-source (gitignored, never
 * deployed); this is the web encode — same 3840x2160 framing, delivered
 * at 1080p so it is watchable rather than a 340 MB download.
 */
export const heroVideo = {
  src: "/videos/hero-1080.mp4",
  srcMobile: "/videos/hero-720.mp4",
  poster: "/images/hero-poster.jpg",
  width: 1920,
  height: 1080,
  alt: "FrameOne showreel — desert and coastline fashion cinematography",
};

export const studio = {
  name: "FrameOne",
  legalName: "FrameOne Global",
  tagline: "Crafting stories, frame by frame.",
  email: "hello@frameonehq.com",
  location: "Bangalore, IN",
  reach: "Worldwide",
  intro:
    "FrameOne Global — media production. Bangalore, operating worldwide.",
  disciplineSummary: [
    "Live events",
    "Corporate films",
    "Fashion · Automotive",
    "Sports, Concerts & Festivals",
  ],
};

export const heroLines = ["Crafting", "stories,", "frame by", "frame."];

export const statement = {
  label: "What we do",
  heading: "We don't just cover the room. We make you feel like you were in it.",
  columns: [
    "High-impact visual content across live events, corporate films, fashion, and automotive — from multi-camera live coverage to cinematic brand storytelling.",
    "Creative direction, on-ground execution, and fast-turnaround post. One crew, from first brief to final grade.",
  ],
};

export const workIntro = {
  label: "Selected work",
  heading: "Image first. Every frame a decision.",
  body: "Three frames from the floor — lasers, masks, and confetti. Shot live, graded fast, delivered before the load-out.",
};

export type Project = {
  slug: string;
  title: string;
  photo: Photo;
  context: string;
  spec: string;
};

export const projects: Project[] = [
  {
    slug: "beam",
    title: "Beam",
    photo: photos.beam,
    context: "Live Event · Mainstage",
    spec: "Multi-cam · Laser · Low-light",
  },
  {
    slug: "the-mask",
    title: "The Mask",
    photo: photos.mask,
    context: "Live Event · Headline Set",
    spec: "Portrait · 135mm · LED wall",
  },
  {
    slug: "confetti",
    title: "Confetti",
    photo: photos.confetti,
    context: "Live Event · Arena Tour",
    spec: "Handheld · Tracking · Encore",
  },
];

/** Frames shown in the draggable 3D reel. */
export const reelFrames = [
  { photo: photos.beam, title: "Beam", context: "Live Event" },
  { photo: photos.mask, title: "The Mask", context: "Live Event" },
  { photo: photos.confetti, title: "Confetti", context: "Live Event" },
  { photo: photos.beam, title: "Mainstage", context: "Live Event" },
  { photo: photos.mask, title: "Headline", context: "Live Event" },
  { photo: photos.confetti, title: "Encore", context: "Live Event" },
];

export type Discipline = {
  number: string;
  title: string;
  tags: string;
  photo: Photo;
};

export const disciplines: Discipline[] = [
  { number: "01", title: "Live Events", tags: "Multicam · Streaming · Same-day", photo: photos.beam },
  { number: "02", title: "Corporate Films", tags: "Brand · Interview · Launch", photo: photos.confetti },
  { number: "03", title: "Fashion", tags: "Runway · Editorial · Lookbook", photo: photos.mask },
  { number: "04", title: "Automotive", tags: "Rig · Drone · Reveal", photo: photos.beam },
];

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#reel", label: "Reel" },
  { href: "#disciplines", label: "Disciplines" },
  { href: "#contact", label: "Contact" },
];

export const socials = [
  { label: "Instagram", href: "#" },
  { label: "Vimeo", href: "#" },
  { label: "YouTube", href: "#" },
];
