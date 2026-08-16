"use client";

import { useEffect, useState } from "react";
import { heroLines, photos, studio } from "@/lib/content";
import styles from "./Hero.module.css";

export default function Hero() {
  const [ready, setReady] = useState(false);

  // Hold the headline below its mask for a beat so the reveal reads
  // as a deliberate opening rather than a flash of unstyled text.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="chapter" style={{ height: "190svh" }}>
      <section className="panel" data-panel="hero">
        <div className={`inner pad ${ready ? styles.ready : ""}`}>
          <div className={styles.media}>
            <div className={styles.shot} data-hero-shot>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos.mask.src}
                alt={photos.mask.alt}
                width={photos.mask.width}
                height={photos.mask.height}
                fetchPriority="high"
                data-hero-img
              />
            </div>
          </div>

          <div className={styles.top}>
            <p>{studio.intro}</p>
            <p className="lbl">
              {studio.disciplineSummary.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>

          <div className={styles.copy}>
            <p className={styles.display} aria-hidden="true">
              {heroLines.map((line) => (
                <span className={styles.line} key={line}>
                  <i>{line}</i>
                </span>
              ))}
            </p>
          </div>

          <div className={styles.bar}>
            <span className="lbl">Est. {studio.location}</span>
            <span className="lbl">Scroll ↓</span>
            <span className="lbl">Selected work — 2026</span>
          </div>
        </div>
      </section>
    </div>
  );
}
