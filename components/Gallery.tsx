"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Category, Photo } from "@/lib/content";
import { poolGallery } from "@/lib/content";
import styles from "./Gallery.module.css";

type Props = {
  category: Category;
  onClose: () => void;
};

/** Slot widths the grid actually uses, so the browser can pick the
 *  700px file for tiles rather than always decoding the 1400px one. */
const SIZES = "(max-width: 820px) 100vw, (max-width: 1400px) 50vw, 33vw";
const LEAD_SIZES = "100vw";

export default function Gallery({ category, onClose }: Props) {
  const photos: Photo[] = poolGallery(category);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);
  const dismissTimer = useRef<number | undefined>(undefined);

  // Let the closing bloom finish before unmounting. The timer is tracked
  // so it can be cancelled — left dangling, it would fire after the user
  // had already opened a different genre and close that one instead.
  const dismiss = useCallback(() => {
    if (dismissTimer.current !== undefined) return; // already closing
    setClosing(true);
    dismissTimer.current = window.setTimeout(onClose, 320);
  }, [onClose]);

  useEffect(
    () => () => {
      if (dismissTimer.current !== undefined) {
        window.clearTimeout(dismissTimer.current);
      }
    },
    []
  );

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const lenis = window.__lenis;
    lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      lenis?.start();
      previouslyFocused?.focus?.();
    };
  }, [dismiss]);

  return (
    <div
      className={`${styles.backdrop} ${closing ? styles.closing : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${category.title} — gallery`}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
      ref={panelRef}
    >
      <div className={styles.stage}>
        <div className={styles.bar}>
          <div className={styles.titleWrap}>
            <h3 className={styles.title}>{category.title}</h3>
            <span className={styles.meta}>
              {category.projects.length} projects · {photos.length} frames
            </span>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={dismiss}
            ref={closeRef}
          >
            Close ✕
          </button>
        </div>

        <div className={styles.scroll}>
          <div className={styles.grid}>
            {photos.map((photo, i) => (
              <figure key={`${photo.src}-${i}`} className={styles.shot}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  srcSet={`${photo.srcSmall} 700w, ${photo.src} 1400w`}
                  sizes={i === 0 ? LEAD_SIZES : SIZES}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              </figure>
            ))}
          </div>
          <p className={styles.placeholderNote}>
            Placeholder set — stills from the 2024 showreel, pending final
            photography.
          </p>
        </div>
      </div>
    </div>
  );
}
