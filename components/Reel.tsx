"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reelFrames } from "@/lib/content";
import styles from "./Reel.module.css";

const STEP = 360 / reelFrames.length;
const AUTO_SPEED = 0.075; // degrees per frame
const RESUME_DELAY = 2600; // ms of stillness before auto-spin returns

export default function Reel() {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [facing, setFacing] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  // Kept in refs, not state: these change every animation frame and
  // must not trigger React renders.
  const rot = useRef(0);
  const target = useRef(0);
  const radius = useRef(400);
  const auto = useRef(true);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const resumeTimer = useRef<number | undefined>(undefined);

  const nudge = useCallback((direction: number) => {
    auto.current = false;
    target.current += direction * STEP;
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      auto.current = true;
    }, RESUME_DELAY);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    auto.current = !reduce;

    const layout = () => {
      radius.current =
        window.innerWidth < 700 ? 230 : Math.min(400, window.innerWidth * 0.28);
      cardRefs.current.forEach((card, i) => {
        if (card) {
          card.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius.current}px)`;
        }
      });
    };
    layout();
    window.addEventListener("resize", layout);

    let frameId = 0;
    let lastFacing = -1;
    const spin = () => {
      if (!dragging.current) {
        if (auto.current) target.current -= AUTO_SPEED;
        rot.current += (target.current - rot.current) * 0.06;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(-${radius.current}px) rotateY(${rot.current}deg)`;
      }
      const index =
        ((Math.round(-rot.current / STEP) % reelFrames.length) + reelFrames.length) %
        reelFrames.length;
      if (index !== lastFacing) {
        lastFacing = index;
        setFacing(index);
      }
      frameId = requestAnimationFrame(spin);
    };
    frameId = requestAnimationFrame(spin);

    // Pointer events cover mouse, touch, and pen in one path.
    const stage = stageRef.current;
    const down = (e: PointerEvent) => {
      dragging.current = true;
      auto.current = false;
      lastX.current = e.clientX;
      setGrabbing(true);
      window.clearTimeout(resumeTimer.current);
    };
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      rot.current += (e.clientX - lastX.current) * 0.3;
      target.current = rot.current;
      lastX.current = e.clientX;
    };
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setGrabbing(false);
      resumeTimer.current = window.setTimeout(() => {
        if (!dragging.current) auto.current = !reduce;
      }, RESUME_DELAY);
    };

    stage?.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", layout);
      stage?.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.clearTimeout(resumeTimer.current);
    };
  }, []);

  const current = reelFrames[facing];

  return (
    <div className="chapter" style={{ height: "170svh" }} id="reel">
      <section className="panel dk">
        <div className={`inner pad ${styles.panelInner}`}>
          <div className={styles.head}>
            <h2>The reel</h2>
            <span className="lbl">Drag to spin ↔</span>
          </div>

          <div
            ref={stageRef}
            className={`${styles.stage} ${grabbing ? styles.grabbing : ""}`}
          >
            <div ref={ringRef} className={styles.ring}>
              {reelFrames.map((frame, i) => (
                <figure
                  key={`${frame.title}-${i}`}
                  className={styles.card}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.photo.src}
                    alt={frame.photo.alt}
                    width={frame.photo.width}
                    height={frame.photo.height}
                    loading="lazy"
                    draggable={false}
                  />
                  <figcaption>
                    {frame.title} — {frame.context}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className={styles.foot}>
            <span className="lbl" aria-live="polite">
              {current.title} — {current.context}
            </span>
            <div className={styles.controls}>
              <button type="button" onClick={() => nudge(1)} aria-label="Previous frame">
                ‹
              </button>
              <button type="button" onClick={() => nudge(-1)} aria-label="Next frame">
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
