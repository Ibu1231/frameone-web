"use client";

import { useState } from "react";
import { categories, collage, workTiles, type Category } from "@/lib/content";
import { BEAT, useReveal } from "@/lib/motion";
import Gallery from "./Gallery";
import WorkTileCard from "./WorkGrid";
import grid from "./WorkGrid.module.css";
import styles from "./Collage.module.css";

/* Heading first, then the grid. The label rides the heading's stage. */
const HEADING_AT = BEAT * 5;
const GRID_AT = BEAT * 6;

export default function Collage() {
  const [open, setOpen] = useState<Category | null>(null);
  const headingIn = useReveal(HEADING_AT);
  const gridIn = useReveal(GRID_AT);

  const stageClass = gridIn ? styles.stage2 : headingIn ? styles.stage1 : "";

  return (
    <div className="chapter" style={{ height: "100svh" }} id="work">
      <section className="panel">
        <div className="inner">
          <div className={styles.panelBg} aria-hidden="true" />

          <div className={`pad ${styles.inner} ${stageClass}`}>
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
