"use client";

import { useEffect, useRef } from "react";
import type { Clip } from "@/lib/content";
import styles from "./Gallery.module.css";

type Props = {
  clip: Clip;
  onOpen: () => void;
};

/**
 * A film in the gallery grid. It plays itself, muted and looping, while
 * it is on screen — the grid should feel alive without anyone pressing
 * anything. Clicking hands off to the lightbox, which is where sound
 * and the full control bar live.
 */
export default function GalleryClip({ clip, onOpen }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay is only granted to muted video.
    video.muted = true;
    video.defaultMuted = true;

    // Decode only while visible: several films cycling off-screen would
    // cost battery for nothing.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <figure
      className={styles.film}
      /* Each clip states its own ratio, so a 4:3 edit and a 9:16 cut
         both get a slot that fits them rather than being cropped into
         a shared one. */
      style={{ aspectRatio: `${clip.width} / ${clip.height}` }}
    >
      <button
        type="button"
        className={styles.open}
        onClick={onOpen}
        aria-label={`Watch ${clip.alt} with sound`}
      >
        <video
          ref={videoRef}
          src={clip.src}
          poster={clip.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-label={clip.alt}
        />
        <span className={styles.playHint} aria-hidden="true">
          ▶ Watch with sound
        </span>
      </button>
    </figure>
  );
}
