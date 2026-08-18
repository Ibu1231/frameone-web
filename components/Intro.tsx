"use client";

import { useEffect, useRef, useState } from "react";
import { studio } from "@/lib/content";
import { startMotion } from "@/lib/motion";
import styles from "./Intro.module.css";

/** Beat on the centred wordmark before it travels. */
const HOLD = 650;
/** Travel, centre to corner. */
const TRAVEL = 1250;
/** Ground fading away while the rest of the page arrives underneath. */
const CLEAR = 620;

/**
 * The entrance. The wordmark sits alone on a dark ground, then moves to
 * the corner it lives in, and the page arrives behind it.
 *
 * The move is done by measuring rather than by animating position: the
 * wordmark is rendered at its *final* coordinates — the same padding,
 * offset and size as the hero's — then transformed to screen centre for
 * the opening frame and released. So it lands exactly where the real
 * wordmark sits, at any viewport, with no second set of numbers to keep
 * in sync, and the whole move runs on a transform rather than on
 * top/left.
 *
 * Plays on every load. It is the entrance to the site, so arriving at
 * the site is what triggers it.
 */
export default function Intro() {
  const markRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<"measuring" | "centred" | "landing" | "gone">(
    "measuring",
  );

  useEffect(() => {
    const mark = markRef.current;
    if (!mark) return;

    // Offset from where it belongs to the middle of the screen.
    const box = mark.getBoundingClientRect();
    const dx = window.innerWidth / 2 - (box.left + box.width / 2);
    const dy = window.innerHeight / 2 - (box.top + box.height / 2);
    mark.style.setProperty("--dx", `${dx}px`);
    mark.style.setProperty("--dy", `${dy}px`);

    // Paint once at centre before the transition is allowed to apply,
    // or the browser coalesces both states and nothing moves.
    setPhase("centred");
    const toLand = window.requestAnimationFrame(() =>
      window.setTimeout(() => setPhase("landing"), HOLD),
    );

    const toClear = window.setTimeout(() => {
      // The page starts arriving while the ground is still fading, so
      // the two overlap instead of queueing.
      startMotion();
    }, HOLD + TRAVEL);

    const toGone = window.setTimeout(
      () => setPhase("gone"),
      HOLD + TRAVEL + CLEAR,
    );

    return () => {
      window.cancelAnimationFrame(toLand);
      window.clearTimeout(toClear);
      window.clearTimeout(toGone);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`${styles.wrap} ${phase === "landing" ? styles.clearing : ""}`}
      aria-hidden="true"
    >
      <span
        ref={markRef}
        className={`${styles.mark} ${phase === "centred" ? styles.centred : ""}`}
      >
        {studio.name}
      </span>
    </div>
  );
}
