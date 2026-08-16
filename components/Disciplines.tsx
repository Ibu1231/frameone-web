"use client";

import { useEffect, useRef, useState } from "react";
import { disciplines } from "@/lib/content";
import styles from "./Disciplines.module.css";

const MARQUEE_WORDS = [
  "Live Events",
  "Corporate Films",
  "Fashion",
  "Automotive",
  "Multi-Cam",
  "Aerial",
  "Post & Grade",
  "Brand Films",
];

export default function Disciplines() {
  const [hovered, setHovered] = useState<number | null>(null);
  const peekRef = useRef<HTMLDivElement>(null);

  // Positioned imperatively so cursor tracking never re-renders the list.
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

  const preview = hovered !== null ? disciplines[hovered] : disciplines[0];

  return (
    <div className="chapter" style={{ height: "160svh" }} id="disciplines">
      <section className="panel">
        <div className={`inner pad ${styles.panelInner}`}>
          <div className={styles.head}>
            <span className={`lbl ${styles.label}`}>Disciplines</span>
            <h2>What we shoot</h2>
          </div>

          <div className={styles.list} onPointerLeave={() => setHovered(null)}>
            {disciplines.map((d, i) => (
              <div
                key={d.number}
                className={styles.row}
                onPointerEnter={() => setHovered(i)}
              >
                <span className={styles.n}>{d.number}</span>
                <h3>{d.title}</h3>
                <span className={styles.tags}>{d.tags}</span>
              </div>
            ))}
          </div>

          <div className={styles.marquee} aria-hidden="true">
            <div className={styles.track}>
              {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
                <span key={`${word}-${i}`}>{word} ·</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div
        ref={peekRef}
        className={`${styles.peek} ${hovered !== null ? styles.on : ""}`}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview.photo.src}
          alt=""
          width={preview.photo.width}
          height={preview.photo.height}
        />
      </div>
    </div>
  );
}
