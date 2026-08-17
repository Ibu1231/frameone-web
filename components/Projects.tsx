"use client";

import { useCallback, useState } from "react";
import { categories, genreStrip, type Category } from "@/lib/content";
import Reveal from "./Reveal";
import Gallery from "./Gallery";
import styles from "./Projects.module.css";

const projectCount = categories.reduce((n, c) => n + c.projects.length, 0);

export default function Projects() {
  const [open, setOpen] = useState<Category | null>(null);
  const [active, setActive] = useState<string | null>(null);

  /** Feeds each row its own -1..1 pointer offset for the drift. */
  const track = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", String((e.clientX - rect.left) / rect.width - 0.5));
    el.style.setProperty("--my", String((e.clientY - rect.top) / rect.height - 0.5));
  }, []);

  const leave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
  }, []);

  return (
    <div className="chapter" style={{ height: "240svh" }} id="projects">
      <section className="panel">
        <div data-drift className={`inner pad ${styles.inner}`}>
          <div className={styles.head}>
            <Reveal as="h2" mask className={styles.title}>
              Our Projects
            </Reveal>
            <Reveal as="span" delay={0.08} className={styles.count}>
              {categories.length} genres · {projectCount} projects
            </Reveal>
          </div>

          <div
            className={`${styles.cats} ${active ? styles.engaged : ""}`}
            onPointerLeave={() => setActive(null)}
          >
            {categories.map((cat, ci) => (
              <Reveal
                key={cat.slug}
                delay={ci * 0.05}
                className={`${styles.cat} ${
                  active === cat.slug ? styles.active : ""
                }`}
                id={`category-${cat.slug}`}
              >
                {/* The whole genre row is one target, opening that genre's
                    pooled gallery. The project names beneath say what the
                    genre contains; they are no longer separate
                    destinations. */}
                <button
                  type="button"
                  className={styles.row}
                  onClick={() => setOpen(cat)}
                  onPointerEnter={() => setActive(cat.slug)}
                  onPointerMove={track}
                  onPointerLeave={leave}
                  onFocus={() => setActive(cat.slug)}
                  aria-haspopup="dialog"
                >
                  <span className={styles.catHead}>
                    <span className={styles.catNum}>
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.catTitle}>{cat.title}</span>
                    <span className={styles.catBlurb}>{cat.blurb}</span>
                  </span>

                  <span className={styles.projects}>
                    {cat.projects.map((project) => (
                      <span key={project.slug} className={styles.project}>
                        {project.title}
                      </span>
                    ))}
                    <span className={styles.enter}>View gallery →</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          <div className={styles.marquee} aria-hidden="true">
            <div className={styles.track}>
              {[...genreStrip, ...genreStrip].map((genre, i) => (
                <span key={`${genre}-${i}`}>{genre}</span>
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
