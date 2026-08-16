"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo, studio } from "@/lib/content";
import styles from "./Hero.module.css";

export default function Hero() {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Phones get the lighter encode. Set before play so only one file is
    // ever fetched.
    if (window.innerWidth < 860 && heroVideo.srcMobile) {
      video.src = heroVideo.srcMobile;
    }

    // The loop is silent by design — there is no audio track in either
    // encode — but muted must be set as a property, not just an
    // attribute, or Safari refuses autoplay.
    video.muted = true;
    video.defaultMuted = true;

    const start = () => {
      if (!video.paused) return;
      void video.play().catch(() => {
        /* Refused for now; the listeners below try again. */
      });
    };

    start();

    // Autoplay can be refused or deferred: the tab may be backgrounded,
    // the file may not have buffered yet, or the browser may want a
    // gesture first. Retry on each signal rather than giving up.
    video.addEventListener("loadeddata", start);
    video.addEventListener("canplay", start);
    document.addEventListener("visibilitychange", start);
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });

    return () => {
      video.removeEventListener("loadeddata", start);
      video.removeEventListener("canplay", start);
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, []);

  return (
    <div className="chapter" style={{ height: "190svh" }}>
      <section className="panel" data-panel="hero">
        <div className="inner">
          <div className={styles.media}>
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
              <span className="lbl">Scroll ↓</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
