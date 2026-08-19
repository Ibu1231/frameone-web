"use client";

import { useEffect, useRef } from "react";
import type { WorkTile } from "@/lib/content";
import styles from "./WorkGrid.module.css";

/**
 * Which tiles are on screen, and how much of each.
 *
 * Every visible tile plays, on every screen size. Six at once is only
 * affordable because a tile now runs a light loop rather than a
 * multi-megabyte gallery film; if the tile films ever get heavy again
 * this is the first thing that will hurt.
 */
const onScreen = new Map<HTMLVideoElement, number>();
let queued = 0;

function settle() {
  queued = 0;
  onScreen.forEach((ratio, video) => {
    if (ratio > 0) {
      void video.play().catch(() => {
        /* Refused for now — the next scroll or tap tries again. */
      });
    } else if (!video.paused) {
      video.pause();
    }
  });
}

function schedule() {
  if (queued) return;
  queued = window.requestAnimationFrame(settle);
}

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
 * begins on the first frame. Which tiles are allowed to run at once is
 * decided by the coordinator above.
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

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen.set(video, entry.isIntersecting ? entry.intersectionRatio : 0);
        schedule();
      },
      // Enough steps that "most visible" is a real comparison rather
      // than a yes/no.
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    io.observe(video);

    return () => {
      io.disconnect();
      onScreen.delete(video);
      schedule();
    };
  }, []);

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
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
