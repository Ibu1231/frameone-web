"use client";

import { useEffect, useRef } from "react";
import { studioVideo, whoWeAre } from "@/lib/content";
import Reveal from "./Reveal";
import styles from "./WhoWeAre.module.css";

export default function WhoWeAre() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only run the loop while the panel is on screen — a second video
  // decoding off-screen for the whole page costs battery for nothing.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className="chapter" style={{ height: "200svh" }} id="who-we-are">
      <section className="panel">
        <div className={`inner pad ${styles.inner}`}>
          <Reveal as="span" className={`lbl ${styles.label}`}>
            {whoWeAre.label}
          </Reveal>

          <Reveal as="h2" mask className={styles.heading}>
            {whoWeAre.heading}
          </Reveal>

          <div className={styles.grid}>
            <Reveal as="p" delay={0.08} className={styles.body}>
              {whoWeAre.body}
            </Reveal>

            <Reveal delay={0.16} className={styles.film}>
              <video
                ref={videoRef}
                src={studioVideo.src}
                poster={studioVideo.poster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={studioVideo.alt}
              />
              <span className={styles.filmMeta}>On set — 2024</span>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
