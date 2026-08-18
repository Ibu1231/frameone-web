"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Category, Photo } from "@/lib/content";
import { poolGallery, poolClips, projectSections } from "@/lib/content";
import Lightbox from "./Lightbox";
import GalleryClip from "./GalleryClip";
import styles from "./Gallery.module.css";

type Props = {
  category: Category;
  onClose: () => void;
};

/** Slot widths the grid actually uses, so the browser can pick the
 *  700px file for tiles rather than always decoding the 1400px one. */
const SIZES = "(max-width: 820px) 100vw, (max-width: 1400px) 50vw, 33vw";

export default function Gallery({ category, onClose }: Props) {
  const photos: Photo[] = poolGallery(category);
  const clips = poolClips(category);
  const sections = projectSections(category);
  // The lightbox pages across the whole genre, so it needs one flat
  // list in the same order the sections render.
  const items = sections.flatMap((s) => s.items);
  const [lightbox, setLightbox] = useState<number | null>(null);
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
              {clips.length > 0 &&
                ` · ${clips.length} film${clips.length > 1 ? "s" : ""}`}
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

        {/* Lenis intercepts wheel events globally and preventDefaults
            them. lenis.stop() halts its own scrolling but does NOT stop
            that interception, so wheel events over this container were
            being swallowed and native scrolling never happened — the
            gallery read as frozen. data-lenis-prevent tells Lenis to
            leave events inside this subtree alone. */}
        <div className={styles.scroll} data-lenis-prevent>
          {/* One section per project, each with its own films woven
              among its own stills. `offset` keeps the lightbox index
              aligned with the flat list it pages through. */}
          {sections.map((section, si) => {
            const offset = sections
              .slice(0, si)
              .reduce((n, s) => n + s.items.length, 0);

            return (
              <section key={section.slug} className={styles.section}>
                <header className={styles.sectionHead}>
                  <h4 className={styles.sectionTitle}>{section.title}</h4>
                  <span className={styles.sectionMeta}>
                    {section.meta} · {section.photos.length} frames
                  </span>
                </header>

                <div className={styles.grid}>
                  {section.items.map((item, i) => {
                    const flat = offset + i;
                    return item.kind === "clip" ? (
                      <GalleryClip
                        key={item.clip.src}
                        clip={item.clip}
                        onOpen={() => setLightbox(flat)}
                      />
                    ) : (
                      <figure
                        key={`${item.photo.src}-${i}`}
                        className={styles.shot}
                      >
                        <button
                          type="button"
                          className={styles.open}
                          onClick={() => setLightbox(flat)}
                          aria-label={`View ${item.photo.alt} full size`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.photo.src}
                            srcSet={`${item.photo.srcSmall} 700w, ${item.photo.src} ${item.photo.width}w`}
                            sizes={SIZES}
                            alt={item.photo.alt}
                            width={item.photo.width}
                            height={item.photo.height}
                            loading={si === 0 && i < 2 ? "eager" : "lazy"}
                            decoding="async"
                          />
                        </button>
                      </figure>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Only genres still running on showreel stand-ins say so. */}
          {photos.some((p) => p.src.includes("/reel/")) && (
            <p className={styles.placeholderNote}>
              Some frames are placeholders — stills from the 2024 showreel,
              pending final photography.
            </p>
          )}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox
          items={items}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
