"use client";

import { useEffect, useRef } from "react";
import type { WorkTile } from "@/lib/content";
import styles from "./WorkGrid.module.css";

type Props = {
  tile: WorkTile;
  onOpen: (slug: string) => void;
};

/**
 * One polaroid tile: a black card with the film seated in it and the
 * genre named on the mount below.
 *
 * Playback follows the reference — the film runs while the tile is in
 * view, and pointer entry restarts it from the top so a hover always
 * begins on the first frame rather than wherever the loop happened to
 * be.
 */
export default function WorkTileCard({ tile, onOpen }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Muted must be a property, not just an attribute, or Safari
    // refuses to autoplay.
    video.muted = true;
    video.defaultMuted = true;

    // Six tiles sit on screen together, so in-view autoplay means six
    // simultaneous streams over mobile data before anything is even
    // tapped. On a phone the poster stands in; the film plays in the reel
    // view, where it is the point of the screen.
    if (window.matchMedia("(max-width: 860px)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            /* Refused; the pointer handlers try again. */
          });
        } else if (!video.paused) {
          // Off-screen tiles decoding video is what makes a grid of six
          // films stutter, so they are stopped rather than left running.
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(max-width: 860px)").matches) return;
    video.currentTime = 0;
    void video.play().catch(() => {});
  };

  return (
    <button
        type="button"
        className={styles.tile}
        onClick={() => tile.hasGallery && onOpen(tile.slug)}
        onPointerEnter={restart}
        onFocus={restart}
        disabled={!tile.hasGallery}
        aria-label={`${tile.title} — open gallery`}
      >
        <span className={styles.frame}>
          <video
            ref={videoRef}
            src={tile.film}
            poster={tile.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
          <span className={styles.sheen} aria-hidden="true" />

          {/* Held back until hover, and only ever the one project whose
              film is playing in this window. */}
          {tile.project && (
            <span className={styles.reveal} aria-hidden="true">
              {tile.project}
            </span>
          )}
        </span>

        <span className={styles.mount}>
          <span className={`gradTitle onDark ${styles.title}`}>{tile.title}</span>
        </span>
      </button>


  );
}
