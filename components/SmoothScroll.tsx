"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide inertial scrolling.
 *
 * Lenis is driven from this component's own rAF loop and exposed on
 * window so other code (the project gallery) can freeze scrolling
 * without fighting it.
 *
 * Smooth scrolling is a stated product requirement, so it runs for
 * everyone; reduced-motion users get a shorter, flatter easing rather
 * than none at all. The decorative animations (reveals, marquee,
 * cross-fades) still switch themselves off under that setting.
 */
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: calm ? 0.6 : 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // gentle ease-out
      gestureOrientation: "vertical",
      smoothWheel: true,
      // Touch devices keep native momentum, which already feels right and
      // avoids a laggy second layer of easing on mobile.
      syncTouch: false,
    });
    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors must go through Lenis or they jump instantly.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
