"use client";

import { useEffect, useRef, useState } from "react";
import { studioVideo, studio, whoWeAre } from "@/lib/content";
import styles from "./WhoWeAre.module.css";

/** Scroll progress through the chapter at which each phase lands. */
const HEADING_AT = 0.06;
const BODY_AT = 0.36;

export default function WhoWeAre() {
  const chapterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState(0);

  /* ---- background film ---- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.innerWidth < 860 && studioVideo.srcMobile) {
      video.src = studioVideo.srcMobile;
    }
    video.muted = true;
    video.defaultMuted = true;

    const start = () => {
      if (video.paused) void video.play().catch(() => {});
    };

    // Only decode while the panel is on screen — this is the second
    // full-size video on the page.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : video.pause()),
      { threshold: 0.15 }
    );
    io.observe(video);

    video.addEventListener("loadeddata", start);
    video.addEventListener("canplay", start);
    return () => {
      io.disconnect();
      video.removeEventListener("loadeddata", start);
      video.removeEventListener("canplay", start);
    };
  }, []);

  /* ---- two-phase text, driven by scroll position ---- */
  useEffect(() => {
    const chapter = chapterRef.current;
    if (!chapter) return;

    let current = -1;

    // Driven by scroll events rather than a running animation frame:
    // the phase only needs to change when the page actually moves, so a
    // permanent loop would burn frames doing nothing.
    const read = () => {
      const rect = chapter.getBoundingClientRect();
      const travel = chapter.offsetHeight - window.innerHeight;
      const p = travel > 0 ? -rect.top / travel : 0;

      const next = p >= BODY_AT ? 2 : p >= HEADING_AT ? 1 : 0;
      if (next !== current) {
        current = next;
        setStage(next);
      }
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);

    // Lenis owns scrolling here, so subscribe to it directly as well —
    // relying on the native event alone leaves the phase at the mercy of
    // how the smooth-scroll library moves the page. It mounts in its own
    // effect, so attach on the next tick.
    let lenis: { off?: (e: "scroll", cb: () => void) => void } | undefined;
    const attach = window.setTimeout(() => {
      lenis = window.__lenis;
      window.__lenis?.on("scroll", read);
    }, 0);

    return () => {
      window.clearTimeout(attach);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      lenis?.off?.("scroll", read);
    };
  }, []);

  const stageClass =
    stage === 2 ? styles.stage2 : stage === 1 ? styles.stage1 : "";

  return (
    <div
      className="chapter"
      style={{ height: "260svh" }}
      id="who-we-are"
      ref={chapterRef}
    >
      <section className="panel">
        <div className="inner">
          <div className={styles.media}>
            <video
              ref={videoRef}
              src={studioVideo.src}
              poster={studioVideo.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-label={studioVideo.alt}
            />
          </div>
          <div className={styles.scrim} />

          <div data-drift
            className={`pad ${styles.stack} ${stageClass}`}>
            <div className={styles.topRow}>
              <span className="lbl">{whoWeAre.label}</span>
              <span className="lbl">Athirappilly — 2024</span>
            </div>

            <div className={styles.copy}>
              <h2 className={styles.heading}>{whoWeAre.heading}</h2>
              <span className={styles.rule} aria-hidden="true" />
              <p className={styles.body}>{whoWeAre.body}</p>
            </div>

            <div className={styles.footer}>
              <span className="lbl">{studio.legalName}</span>
              <span className="lbl">Keep scrolling ↓</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
