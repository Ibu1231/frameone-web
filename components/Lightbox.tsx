"use client";

import { useEffect, useRef } from "react";
import type { GalleryItem } from "@/lib/content";
import styles from "./Lightbox.module.css";

type Props = {
  items: GalleryItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

export default function Lightbox({ items, index, onIndex, onClose }: Props) {
  const item = items[index];
  const total = items.length;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // This sits above the gallery, so it takes the keys first and stops
    // them reaching the gallery's own Escape handler — otherwise one
    // press would close both.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.stopPropagation();
        onIndex((index + 1) % total);
      } else if (e.key === "ArrowLeft") {
        e.stopPropagation();
        onIndex((index - 1 + total) % total);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [index, total, onIndex, onClose]);

  // Opening a film here is the deliberate "watch it properly" moment:
  // unmuted, from the top, with the full control bar.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
    video.currentTime = 0;
    void video.play().catch(() => {
      // Some browsers refuse unmuted autoplay without a prior gesture.
      // The click that opened this counts in most, but if not the
      // controls are right there.
    });
  }, [index]);

  if (!item) return null;

  return (
    <div
      className={styles.wrap}
      role="dialog"
      aria-modal="true"
      aria-label={
        item.kind === "clip" ? item.clip.alt : `${item.photo.alt} — full size`
      }
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.bar}>
        <span className={styles.count}>
          {item.kind === "clip" ? "Film" : "Still"}
        </span>
        <div className={styles.nav}>
          <button
            type="button"
            onClick={() => onIndex((index - 1 + total) % total)}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => onIndex((index + 1) % total)}
            aria-label="Next"
          >
            ›
          </button>
          <button type="button" className={styles.close} onClick={onClose}>
            Close ✕
          </button>
        </div>
      </div>

      <div className={styles.stage} data-lenis-prevent>
        {item.kind === "clip" ? (
          <video
            key={item.clip.src}
            ref={videoRef}
            src={item.clip.src}
            poster={item.clip.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={item.clip.alt}
          />
        ) : (
          /* Full-size source deliberately — this is the "see it
             properly" view, so no srcset downgrade. */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={item.photo.src}
            src={item.photo.src}
            alt={item.photo.alt}
            width={item.photo.width}
            height={item.photo.height}
            decoding="async"
          />
        )}
      </div>

      <p className={styles.caption}>
        {item.kind === "clip" ? item.clip.alt : item.photo.alt}
      </p>
    </div>
  );
}
