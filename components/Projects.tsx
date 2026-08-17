"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { categories, genreStrip, type Photo, type Project } from "@/lib/content";
import Reveal from "./Reveal";
import Gallery from "./Gallery";
import styles from "./Projects.module.css";

type Open = { project: Project; categoryTitle: string } | null;
type Peek = { photo: Photo; label: string } | null;

const projectCount = categories.reduce((n, c) => n + c.projects.length, 0);

export default function Projects() {
  const [open, setOpen] = useState<Open>(null);
  const [active, setActive] = useState<string | null>(null);
  const [peek, setPeek] = useState<Peek>(null);
  const peekRef = useRef<HTMLDivElement>(null);

  // The preview follows the cursor imperatively — putting pointer
  // coordinates in state would re-render the whole list on every move.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = peekRef.current;
      if (!el) return;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

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
        <div className={`inner pad ${styles.inner}`}>
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
            onPointerLeave={() => {
              setActive(null);
              setPeek(null);
            }}
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
                <div
                  onPointerEnter={() => {
                    setActive(cat.slug);
                    setPeek({
                      photo: cat.projects[0].cover,
                      label: cat.title,
                    });
                  }}
                  onPointerMove={track}
                  onPointerLeave={leave}
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
                        onPointerEnter={() =>
                          setPeek({
                            photo: project.cover,
                            label: `${project.title} · ${project.photos.length} frames`,
                          })
                        }
                        onFocus={() => setActive(cat.slug)}
                        aria-haspopup="dialog"
                      >
                        {project.title}
                        <em>{String(project.photos.length).padStart(2, "0")}</em>
                      </button>
                    ))}
                  </div>
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

      <div
        ref={peekRef}
        className={`${styles.peek} ${peek ? styles.on : ""}`}
        aria-hidden="true"
      >
        {peek && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={peek.photo.src}
              alt=""
              width={peek.photo.width}
              height={peek.photo.height}
            />
            <span className={styles.peekLabel}>{peek.label}</span>
          </>
        )}
      </div>

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
