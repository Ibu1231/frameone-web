"use client";

import { useEffect, useRef, useState } from "react";
import type { Showcase as ShowcaseData } from "@/lib/content";
import Reveal from "./Reveal";
import styles from "./Showcase.module.css";

const HOLD = 3800; // ms each slide rests before the cross-fade

type Props = {
  data: ShowcaseData;
  total: number;
};

export default function Showcase({ data, total }: Props) {
  const [index, setIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Advance only while the panel is on screen. Three slideshows all
  // cycling off-screen would be wasted work on every frame.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let timer: number | undefined;
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(
        () => setIndex((i) => (i + 1) % data.slides.length),
        HOLD
      );
    };
    const stop = () => window.clearInterval(timer);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.25 }
    );
    io.observe(node);

    return () => {
      stop();
      io.disconnect();
    };
  }, [data.slides.length]);

  return (
    <div className="chapter" style={{ height: "200svh" }}>
      <section className="panel" data-panel="work" ref={sectionRef}>
        <div className={styles.frame}>
          {data.slides.map((slide, i) => (
            <div
              key={slide.src}
              className={`${styles.slide} ${i === index ? styles.active : ""}`}
              aria-hidden={i !== index}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={i === index ? slide.alt : ""}
                width={slide.width}
                height={slide.height}
                loading={i === 0 ? "eager" : "lazy"}
                data-work-img
              />
            </div>
          ))}
        </div>
        <div className={styles.scrim} />

        <div className={`inner pad ${styles.content}`}>
          <span className={styles.num}>
            Work — {data.index} / {String(total).padStart(2, "0")}
          </span>

          <div>
            <Reveal as="h2" mask className={styles.title}>
              <a
                href={`#category-${data.categorySlug}`}
                className={styles.link}
              >
                {data.title}
              </a>
            </Reveal>

            <div className={styles.meta}>
              <span>{data.meta}</span>
              <div className={styles.dots} aria-hidden="true">
                {data.slides.map((s, i) => (
                  <i key={s.src} className={i === index ? styles.on : ""} />
                ))}
              </div>
              <a href={`#category-${data.categorySlug}`}>View project →</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
