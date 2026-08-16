"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo, studio } from "@/lib/content";
import styles from "./Hero.module.css";

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    // Phones get the lighter encode. Chosen here rather than with <source
    // media> because browsers only evaluate those once, before layout.
    if (window.innerWidth < 860 && heroVideo.srcMobile) {
      video.src = heroVideo.srcMobile;
    }

    // Autoplay is only granted to muted video, and Safari needs the
    // property set — not just the attribute — before play() is called.
    video.muted = true;
    void video.play().catch(() => {
      /* Refused: the poster frame stays up, which is a fine first paint. */
    });
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
    if (!next && video.paused) void video.play().catch(() => {});
  };

  return (
    <div className="chapter" style={{ height: "190svh" }}>
      <section className="panel" data-panel="hero">
        <div className="inner">
          <div className={styles.media}>
            {/* No overlay image: the native poster attribute covers the
                gap before first frame, with no hydration race. */}
            <video
              ref={videoRef}
              src={heroVideo.src}
              poster={heroVideo.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              aria-label={heroVideo.alt}
              data-hero-video
            />
          </div>
          <div className={styles.scrim} />

          <div className={`pad ${styles.stack} ${ready ? styles.ready : ""}`}>
            <div className={styles.topRow}>
              <span className="lbl">{studio.name} — Showreel</span>
              <span className="lbl">Reel — {heroVideo.label}</span>
            </div>

            <h2 className={styles.headline}>
              <span className={styles.line}>
                <i>Crafting stories,</i>
              </span>
              <span className={styles.line}>
                <i>frame by frame.</i>
              </span>
            </h2>

            <div className={styles.footer}>
              <p className={styles.studioLine}>{studio.intro}</p>
              <div className={styles.meta}>
                {studio.disciplineSummary.map((line) => (
                  <span className="lbl" key={line}>
                    {line}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className={styles.sound}
                onClick={toggleSound}
                aria-pressed={!muted}
              >
                {muted ? "Sound on" : "Sound off"}
              </button>
              <span className="lbl">Scroll ↓</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
