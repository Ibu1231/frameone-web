"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/content";
import styles from "./Gallery.module.css";

type Props = {
  project: Project;
  categoryTitle: string;
  onClose: () => void;
};

export default function Gallery({ project, categoryTitle, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    // Freeze the page behind the overlay. Lenis has to be stopped
    // explicitly or it keeps easing the body underneath.
    const lenis = window.__lenis;
    lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Keep focus inside the dialog while it is open.
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
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — photo gallery`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      ref={panelRef}
    >
      <div className={styles.bar}>
        <div className={styles.titleWrap}>
          <h3 className={styles.title}>{project.title}</h3>
          <span className={styles.meta}>
            {categoryTitle} · {project.meta} · {project.photos.length} frames
          </span>
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          ref={closeRef}
        >
          Close ✕
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.grid}>
          {project.photos.map((photo, i) => (
            <figure
              key={`${photo.src}-${i}`}
              className={styles.shot}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading={i < 2 ? "eager" : "lazy"}
                style={{ animationDelay: `${i * 0.06}s` }}
              />
            </figure>
          ))}
        </div>
        <p className={styles.placeholderNote}>
          Placeholder set — stills from the 2024 showreel, pending the final
          photography for this project.
        </p>
      </div>
    </div>
  );
}
