"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo, studio } from "@/lib/content";
import styles from "./Hero.module.css";

/** Scroll progress through the hero at which the strap line arrives. */
const STRAP_AT = 0.05;

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState(0);
  const chapterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  // The strap line is a second beat: the title lands on load, the
  // tagline follows as soon as the reader starts moving.
  useEffect(() => {
    const chapter = chapterRef.current;
    if (!chapter) return;

    let current = 0;
    // One-way: once the tagline is in, scrolling back up must not pull it
    // out again — that reads as a glitch rather than a reveal.
    const read = () => {
      if (current >= 1) return;
      const travel = chapter.offsetHeight - window.innerHeight;
      const p = travel > 0 ? -chapter.getBoundingClientRect().top / travel : 0;
      if (p >= STRAP_AT) {
        current = 1;
        setPhase(1);
      }
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);

    // Lenis owns scrolling here, so listen to it directly too.
    let lenis: { off?: (e: "scroll", cb: () => void) => void } | undefined;
    const attach = window.setTimeout(() => {
      lenis = window.__lenis;
      window.__lenis?.on("scroll", read);
    }, 0);

    // Scroll drives the reveal, but nobody should have to scroll to
    // discover the tagline exists — if the page is still untouched after
    // the title has settled, it comes in on its own.
    const fallback = window.setTimeout(() => {
      if (current < 1) {
        current = 1;
        setPhase(1);
      }
    }, 1900);

    return () => {
      window.clearTimeout(attach);
      window.clearTimeout(fallback);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      lenis?.off?.("scroll", read);
    };
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
    <div className="chapter" style={{ height: "190svh" }} ref={chapterRef}>
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

          <div className={`pad ${styles.stack} ${ready ? styles.ready : ""} ${phase >= 1 ? styles.phase1 : ""}`}>
            <div className={styles.topRow}>
              <span className="lbl">Showreel — 2024</span>
              <span className="lbl">Bangalore · Worldwide</span>
            </div>

            <div className={styles.centre}>
              <h2 className={styles.wordmark}>
                <i>{studio.name}</i>
              </h2>
              <p className={styles.strap}>{studio.tagline}</p>
            </div>

            <div className={styles.bottom}>
              <div className={styles.footer}>
                <p className={styles.studioLine}>{studio.intro}</p>
                <div className={styles.meta}>
                  {studio.disciplineSummary.map((line) => (
                    <span className="lbl" key={line}>
                      {line}
                    </span>
                  ))}
                </div>
                <span className={`lbl ${styles.scrollCue}`}>Scroll ↓</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
