"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo, studio, whoWeAre } from "@/lib/content";
import styles from "./Hero.module.css";

/** Delay before the Who We Are copy arrives, in ms. It is the second
 *  thing you read, so it should not land at the same moment as the
 *  title. */
const STORY_AT = 1500;

export default function Hero() {
  const [ready, setReady] = useState(false);
  const chapterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [told, setTold] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setTold(true), STORY_AT);
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

          <div data-drift
            className={`pad ${styles.stack} ${ready ? styles.ready : ""}`}>
            <div className={styles.topRow}>
              <h2 className={styles.wordmark}>
                <i>{studio.name}</i>
              </h2>
              <span className="lbl">Bangalore · Worldwide</span>
            </div>

            <div className={styles.bottom}>
              <div className={`${styles.story} ${told ? styles.toldIn : ""}`}>
                <span className="lbl">{whoWeAre.label}</span>
                <h3 className={`gradTitle onDark ${styles.storyHeading}`}>
                  {whoWeAre.heading}
                </h3>
                <p className={styles.storyBody}>{whoWeAre.body}</p>
              </div>

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
