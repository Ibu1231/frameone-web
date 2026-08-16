"use client";

import { useState } from "react";
import { categories, genreStrip, type Project } from "@/lib/content";
import Reveal from "./Reveal";
import Gallery from "./Gallery";
import styles from "./Projects.module.css";

type Open = { project: Project; categoryTitle: string } | null;

export default function Projects() {
  const [open, setOpen] = useState<Open>(null);

  return (
    <div className="chapter" style={{ height: "230svh" }} id="projects">
      <section className="panel">
        <div className={`inner pad ${styles.inner}`}>
          <div className={styles.head}>
            <Reveal as="span" className={`lbl ${styles.label}`}>
              Our Projects
            </Reveal>
            <Reveal as="h2" mask>
              What we shoot
            </Reveal>
          </div>

          <div className={styles.cats}>
            {categories.map((cat, ci) => (
              <Reveal
                key={cat.slug}
                delay={ci * 0.06}
                className={styles.cat}
                // Anchor target for the Work showcase links.
                id={`category-${cat.slug}`}
              >
                <div className={styles.catHead}>
                  <span className={styles.catNum}>
                    {String(ci + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.catTitle}>{cat.title}</h3>
                  <span className={styles.catBlurb}>{cat.blurb}</span>
                </div>

                <div className={styles.projects}>
                  {cat.projects.map((project) => (
                    <button
                      key={project.slug}
                      type="button"
                      className={styles.project}
                      onClick={() =>
                        setOpen({ project, categoryTitle: cat.title })
                      }
                      aria-haspopup="dialog"
                    >
                      {project.title}
                      <em>{project.photos.length}</em>
                    </button>
                  ))}
                </div>
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

      {open && (
        <Gallery
          project={open.project}
          categoryTitle={open.categoryTitle}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
