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
    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>(".chapter")
    );
    const heroVideo = document.querySelector<HTMLElement>("[data-hero-video]");
    const drifters = Array.from(
      document.querySelectorAll<HTMLElement>("[data-drift]")
    );
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

    let frameId = 0;
    const frame = () => {
      // ---- hero: the film drifts slowly as the next panel rises over it ----
      // A gentle parallax only. The video is full-bleed and already cropped
      // by object-fit, so it stays at scale 1.06 to keep a little headroom
      // for the drift without ever exposing an edge.
      if (chapters[0] && heroVideo) {
        const p = progressOf(chapters[0]);
        heroVideo.style.transform = `scale(1.06) translateY(${p * -6}%)`;
      }

      // ---- every panel: the copy drifts up as the next panel rises ----
      //
      // This deliberately targets the text layer, never .inner. .inner
      // holds the full-bleed video, so translating it lifted the footage
      // off the bottom of the panel and exposed a band of bare panel
      // background, and fading it washed the footage out mid-scroll.
      // The media now stays put and fully opaque; only the copy moves,
      // which reads as depth rather than a transition effect.
      drifters.forEach((el) => {
        const chapter = el.closest<HTMLElement>(".chapter");
        if (!chapter) return;
        const p = progressOf(chapter);
        el.style.transform = `translateY(${-p * 3.2}vh)`;
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

    return () => cancelAnimationFrame(frameId);
  }, []);

  return null;
}
