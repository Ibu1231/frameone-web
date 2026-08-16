import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static HTML export — produces ./out, deployable to any static host
     (Cloudflare Pages, Netlify, Vercel) with no Node server. */
  output: "export",

  /* Emits /work/index.html instead of /work.html, which is what static
     hosts expect for clean URLs without per-host redirect rules. */
  trailingSlash: true,

  images: {
    /* next/image's optimizer needs a server, which a static export
       doesn't have. We keep <Image> for its width/height layout-shift
       protection and swap in a CDN loader when the high-res photos land. */
    unoptimized: true,
  },
};

export default nextConfig;
