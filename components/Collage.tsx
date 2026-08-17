"use client";

import { useEffect, useRef, useState } from "react";
import { collage, type CollagePanel } from "@/lib/content";
import styles from "./Collage.module.css";

/** Chapter progress at which each phase lands. */
const HEADING_AT = 0.05;
const TILES_AT = 0.24;

const HOLD = 4200; // ms per frame

/** One genre's slideshow. Frames come only from the panel it is given,
 *  so the three never share a pool. */
function GenreSlideshow({ panel, active }: { panel: CollagePanel; active: boolean }) {
  const [index, setIndex] = useState(0);

  // Only cycles once the tiles have actually been revealed.
  useEffect(() => {
    if (!active || panel.frames.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % panel.frames.length),
      HOLD
    );
    return () => window.clearInterval(id);
  }, [active, panel.frames.length]);

  return (
    <>
      {panel.frames.map((frame, i) => (
        <div
          key={frame.src}
          className={`${styles.slide} ${i === index ? styles.on : ""}`}
          aria-hidden={i !== index}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={frame.src}
            srcSet={`${frame.srcSmall} 700w, ${frame.src} ${frame.width}w`}
            sizes="(max-width: 860px) 50vw, 33vw"
            alt={i === index ? frame.alt : ""}
            width={frame.width}
            height={frame.height}
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
      <span className={styles.cap}>{panel.label}</span>
      <span className={styles.dots} aria-hidden="true">
        {panel.frames.map((f, i) => (
          <i key={f.src} className={i === index ? styles.lit : ""} />
        ))}
      </span>
    </>
  );
}

export default function Collage() {
  const chapterRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  // Heading first, tiles after — driven by scroll position so the two
  // phases are sequenced rather than arriving together.
  useEffect(() => {
    const chapter = chapterRef.current;
    if (!chapter) return;

    let current = -1;
    const read = () => {
      const travel = chapter.offsetHeight - window.innerHeight;
      const p = travel > 0 ? -chapter.getBoundingClientRect().top / travel : 0;
      const next = p >= TILES_AT ? 2 : p >= HEADING_AT ? 1 : 0;
      if (next !== current) {
        current = next;
        setStage(next);
      }
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);

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
      style={{ height: "220svh" }}
      id="work"
      ref={chapterRef}
    >
      <section className="panel">
        <div className="inner">
          <div className={styles.panelBg} aria-hidden="true" />

          <div data-drift className={`pad ${styles.inner} ${stageClass}`}>
            <span className={`lbl ${styles.label}`}>{collage.label}</span>
            <h2 className={styles.heading}>{collage.heading}</h2>

            <div className={styles.grid}>
              {collage.panels.map((panel) => (
                <div key={panel.key} className={styles.tile}>
                  <GenreSlideshow panel={panel} active={stage >= 2} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
