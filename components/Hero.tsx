"use client";

import { useEffect, useRef, useState } from "react";
import { heroVideo, studio } from "@/lib/content";
import styles from "./Hero.module.css";

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // poster stays; no autoplay

    const reveal = () => setPlaying(true);
    video.addEventListener("playing", reveal);

    // Autoplay is only permitted while muted, and can still be refused.
    // If it is, the poster simply remains — no broken black rectangle.
    const attempt = video.play();
    if (attempt) attempt.catch(() => setPlaying(false));

    return () => video.removeEventListener("playing", reveal);
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
        <div className={`inner pad ${styles.stack} ${ready ? styles.ready : ""}`}>
          {/* ---- type above the film ---- */}
          <div className={styles.overline}>
            <p className={styles.headline} aria-hidden="true">
              <span className={styles.line}>
                <i>Crafting stories,</i>
              </span>
            </p>
            <span className="lbl">Reel — {heroVideo.label}</span>
          </div>

          {/* ---- the film ---- */}
          <div className={styles.filmRow}>
            <div
              className={`${styles.film} ${playing ? styles.playing : ""}`}
              data-hero-shot
            >
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                poster={heroVideo.poster}
                width={heroVideo.width}
                height={heroVideo.height}
                aria-label={heroVideo.alt}
                data-hero-img
              >
                <source src={heroVideo.src} type="video/mp4" />
              </video>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.poster}
                src={heroVideo.poster}
                alt={heroVideo.alt}
                width={heroVideo.width}
                height={heroVideo.height}
                aria-hidden="true"
              />

              <span className={styles.marks} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>

              <button
                type="button"
                className={styles.sound}
                onClick={toggleSound}
                aria-pressed={!muted}
              >
                {muted ? "Sound on" : "Sound off"}
              </button>
            </div>
          </div>

          {/* ---- type below the film ---- */}
          <div className={styles.underline}>
            <p
              className={`${styles.headline} ${styles.underlineType}`}
              aria-hidden="true"
            >
              <span className={styles.line}>
                <i>frame by frame.</i>
              </span>
            </p>
          </div>

          {/* ---- studio line, kept at the bottom ---- */}
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
      </section>
    </div>
  );
}
