"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Clip } from "@/lib/content";
import styles from "./Reels.module.css";

type Props = {
  films: Clip[];
  /** Which film the viewer clicked. */
  start: number;
  title: string;
  onClose: () => void;
};

/**
 * Instagram-Reels-style vertical scroller for a genre's films.
 *
 * Desktop puts the player on the left and the caption panel on the
 * right; on a phone the film goes full-bleed with the caption laid over
 * its bottom-left corner. Both use the same scroll-snap track, so
 * navigation is native scrolling rather than a gesture library — it
 * inherits momentum, trackpads, keyboards and screen readers for free.
 */
export default function Reels({ films, start, title, onClose }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(start);
  const [muted, setMuted] = useState(true);

  // Open on the film that was clicked. Instant, not smooth: the viewer
  // asked for this one, they should not have to watch the track fly to
  // it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ top: start * track.clientHeight, behavior: "instant" as ScrollBehavior });
  }, [start]);

  // Play what is on screen, pause what is not — the Reels/TikTok rule.
  // Anything else means six videos decoding at once.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const i = Number(video.dataset.i);
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActive(i);
            void video.play().catch(() => {});
          } else if (!video.paused) {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: [0, 0.6, 1], root: trackRef.current },
    );
    videoRefs.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, [films.length]);

  // Mute state is global to the session, the way Reels behaves — unmute
  // once and the following films stay unmuted.
  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.muted = muted;
    });
  }, [muted, active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [onClose]);

  const setRef = useCallback(
    (i: number) => (el: HTMLVideoElement | null) => {
      videoRefs.current[i] = el;
    },
    [],
  );

  return (
    <div className={styles.wrap} role="dialog" aria-modal="true" aria-label={`${title} — films`}>
      <div className={styles.chrome}>
        <span className={`gradTitle onDark ${styles.genre}`}>{title}</span>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.ctl}
            onClick={() => setMuted((m) => !m)}
            aria-pressed={!muted}
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
          <button type="button" className={styles.ctl} onClick={onClose}>
            Close ✕
          </button>
        </div>
      </div>

      {/* data-lenis-prevent: Lenis intercepts wheel events globally and
          preventDefaults them, which would swallow the snap scrolling
          inside this track. */}
      <div className={styles.track} ref={trackRef} data-lenis-prevent>
        {films.map((film, i) => (
          <section key={film.src} className={styles.slide}>
            <div className={styles.player}>
              <video
                ref={setRef(i)}
                data-i={i}
                src={film.src}
                poster={film.poster}
                muted
                loop
                playsInline
                /* Adjacent films are fetched so a swipe does not land on
                   a black frame; the rest wait until they are near. */
                preload={Math.abs(i - active) <= 1 ? "auto" : "none"}
                aria-label={film.alt}
                onClick={() => setMuted((m) => !m)}
              />
            </div>

            <aside className={styles.caption}>
              <span className={styles.index}>
                {String(i + 1).padStart(2, "0")} — {title}
              </span>
              <p className={styles.alt}>{film.alt}</p>
              <span className={styles.hint}>
                {muted ? "Tap the film for sound" : "Tap the film to mute"}
              </span>
            </aside>
          </section>
        ))}
      </div>
    </div>
  );
}
