"use client";

import { useEffect, useRef, useState } from "react";
import { categories, collage, workTiles, type Category } from "@/lib/content";
import Gallery from "./Gallery";
import WorkTileCard from "./WorkGrid";
import grid from "./WorkGrid.module.css";
import styles from "./Collage.module.css";

/** Chapter progress at which each phase lands. */
const HEADING_AT = 0.05;
const TILES_AT = 0.24;

export default function Collage() {
  const chapterRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [open, setOpen] = useState<Category | null>(null);

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
            <h2 className={`gradTitle ${styles.heading}`}>{collage.heading}</h2>

            <div className={`${grid.grid} ${styles.workGrid}`}>
              {workTiles.map((tile) => (
                <WorkTileCard
                  key={tile.slug}
                  tile={tile}
                  onOpen={(slug) => {
                    const category = categories.find((c) => c.slug === slug);
                    if (category) setOpen(category);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Keyed by genre: switching genres must mount a fresh gallery,
          not reuse one still holding the previous closing state. */}
      {open && (
        <Gallery key={open.slug} category={open} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
