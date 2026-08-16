"use client";

import { useEffect } from "react";

/**
 * Drives every scroll-linked transform on the page from a single
 * requestAnimationFrame loop.
 *
 * The panels are `position: sticky` siblings that pin and are covered
 * by the next one. This reads each chapter's scroll progress and maps
 * it to transforms — the hero plane lifting away, work photographs
 * pushing in, titles rising from their masks.
 *
 * One loop rather than per-component scroll listeners: shared state,
 * no listener pile-up, and everything stays on the same frame.
 */
export default function ScrollChoreography() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>(".chapter")
    );
    const heroShot = document.querySelector<HTMLElement>("[data-hero-shot]");
    const workPanels = Array.from(
      document.querySelectorAll<HTMLElement>('[data-panel="work"]')
    );

    const clamp = (v: number, a: number, b: number) =>
      v < a ? a : v > b ? b : v;

    /** 0 when the chapter's panel pins, 1 when it has fully passed. */
    const progressOf = (chapter: HTMLElement) => {
      const rect = chapter.getBoundingClientRect();
      const travel = chapter.offsetHeight - window.innerHeight;
      if (travel <= 0) return clamp(-rect.top / chapter.offsetHeight, 0, 1);
      return clamp(-rect.top / travel, 0, 1);
    };

    let pointerX = 0;
    let pointerY = 0;
    let easedX = 0;
    let easedY = 0;

    const onPointer = (e: PointerEvent) => {
      pointerX = e.clientX / window.innerWidth - 0.5;
      pointerY = e.clientY / window.innerHeight - 0.5;
    };
    if (!reduce) window.addEventListener("pointermove", onPointer);

    let frameId = 0;
    const frame = () => {
      // ---- hero: the film tilts toward the cursor and recedes on scroll ----
      // The frame is centred by flex layout, so no translate(-50%) here —
      // and the video itself is never scaled, so its framing stays exactly
      // as shot.
      if (chapters[0] && heroShot) {
        const p = progressOf(chapters[0]);
        easedX += (pointerX - easedX) * 0.07;
        easedY += (pointerY - easedY) * 0.07;
        const ry = easedX * 5;
        const rx = -easedY * 3.4;
        const recede = 1 - p * 0.12;
        const lift = -p * 7;
        heroShot.style.transform =
          `perspective(1600px) rotateY(${ry}deg) rotateX(${rx}deg) ` +
          `scale(${recede}) translateY(${lift}vh)`;
      }

      // ---- every panel: drift up and dim as the next covers it ----
      chapters.forEach((chapter, i) => {
        const p = progressOf(chapter);
        const inner = chapter.querySelector<HTMLElement>(".inner");
        if (!inner) return;
        if (i === 0) {
          inner.style.opacity = String(1 - clamp((p - 0.55) / 0.45, 0, 1));
          return;
        }
        inner.style.transform = `translateY(${-p * 7}vh)`;
        inner.style.opacity = String(1 - clamp((p - 0.6) / 0.4, 0, 1) * 0.85);
      });

      // ---- work panels: slow push-in, title rises from its mask ----
      workPanels.forEach((panel) => {
        const chapter = panel.parentElement;
        if (!chapter) return;
        const p = progressOf(chapter as HTMLElement);
        const img = panel.querySelector<HTMLElement>("[data-work-img]");
        if (img) {
          img.style.transform = `scale(${1.15 + p * 0.14}) translateY(${(p - 0.5) * -5}%)`;
        }
        const title = panel.querySelector<HTMLElement>("[data-work-title]");
        if (title) {
          const entered = clamp(p / 0.3, 0, 1);
          title.style.transform = `translateY(${(1 - entered) * 105}%)`;
        }
      });

      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return null;
}
