"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/content";
import { useDismissGesture } from "@/lib/useDismissGesture";
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

  /* The iOS photo-viewer split: drag down to leave, swipe sideways to
     move between frames. Paging without closing the viewer first was
     the whole complaint. */
  const { handlers, style, dragging } = useDismissGesture({
    onDismiss: onClose,
    axis: "y",
    onPage: (direction) => onIndex((index + direction + total) % total),
  });
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(true), []);

  /* Tapping the dark area beside a frame closes the viewer.

     object-fit: contain means the image element covers the whole stage
     while the picture itself is letterboxed inside it, so a plain
     backdrop check would never fire — every tap lands on the element.
     The painted rectangle is worked out from the frame's own
     proportions and the tap tested against that instead.

     Pointer down and up rather than click, so a swipe between frames
     is not mistaken for a tap on the way past. */
  const tapFrom = useRef<{ x: number; y: number } | null>(null);

  const onStageDown = (e: React.PointerEvent) => {
    tapFrom.current = { x: e.clientX, y: e.clientY };
  };

  const onStageUp = (e: React.PointerEvent) => {
    const start = tapFrom.current;
    tapFrom.current = null;
    if (!start) return;
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) return;

    const frame = e.currentTarget.querySelector<HTMLElement>("img, video");
    if (!frame) return onClose();

    const box = frame.getBoundingClientRect();
    const nw =
      (frame as HTMLImageElement).naturalWidth ||
      (frame as HTMLVideoElement).videoWidth ||
      0;
    const nh =
      (frame as HTMLImageElement).naturalHeight ||
      (frame as HTMLVideoElement).videoHeight ||
      0;
    // Nothing loaded yet: treat the whole box as the frame rather than
    // closing on a tap the reader meant for the picture.
    if (!nw || !nh) return;

    const scale = Math.min(box.width / nw, box.height / nh);
    const w = nw * scale;
    const h = nh * scale;
    const left = box.left + (box.width - w) / 2;
    const top = box.top + (box.height - h) / 2;

    const onFrame =
      e.clientX >= left &&
      e.clientX <= left + w &&
      e.clientY >= top &&
      e.clientY <= top + h;

    if (!onFrame) onClose();
  };

  return (
    <div
      {...handlers}
      style={style}
      className={`${styles.wrap} ${shown ? styles.shown : ""} ${dragging ? styles.dragging : ""}`}
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
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        className={styles.stage}
        data-lenis-prevent
        onPointerDown={onStageDown}
        onPointerUp={onStageUp}
      >
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
          /* Full size on desktop — this is the "see it properly" view.
             A phone cannot resolve it and would pay several hundred KB
             for the privilege, so it takes the small file. */
          <picture>
            <source media="(max-width: 860px)" srcSet={item.photo.srcSmall} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={item.photo.src}
              src={item.photo.src}
              alt={item.photo.alt}
              width={item.photo.width}
              height={item.photo.height}
              decoding="async"
            />
          </picture>
        )}
      </div>

      <p className={styles.caption}>
        {item.kind === "clip" ? item.clip.alt : item.photo.alt}
      </p>
    </div>
  );
}
