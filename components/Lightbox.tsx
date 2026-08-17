"use client";

import { useEffect } from "react";
import type { Photo } from "@/lib/content";
import styles from "./Lightbox.module.css";

type Props = {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

export default function Lightbox({ photos, index, onIndex, onClose }: Props) {
  const photo = photos[index];
  const total = photos.length;

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

  if (!photo) return null;

  return (
    <div
      className={styles.wrap}
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.alt} — full size`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.bar}>
        <span className={styles.count}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className={styles.nav}>
          <button
            type="button"
            onClick={() => onIndex((index - 1 + total) % total)}
            aria-label="Previous frame"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => onIndex((index + 1) % total)}
            aria-label="Next frame"
          >
            ›
          </button>
          <button type="button" className={styles.close} onClick={onClose} autoFocus>
            Close ✕
          </button>
        </div>
      </div>

      <div className={styles.stage}>
        {/* Full-size source deliberately — this is the "see it properly"
            view, so no srcset downgrade. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          decoding="async"
        />
      </div>

      <p className={styles.caption}>{photo.alt}</p>
    </div>
  );
}
