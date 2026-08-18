"use client";

import { useEffect, useRef, useState } from "react";
import { studio } from "@/lib/content";
import { startMotion } from "@/lib/motion";
import styles from "./Intro.module.css";

/** Per-letter stagger. */
const STEP = 42;
/** One letter's rise. */
const RISE = 720;
/** Beat after the word is whole, before it travels. */
const HOLD = 320;
/** Centre to corner. */
const TRAVEL = 1100;
/** The ground wiping away. */
const WIPE = 760;

const LETTERS = [...studio.name];
const BUILT = STEP * (LETTERS.length - 1) + RISE;

/**
 * The entrance.
 *
 * The wordmark builds letter by letter out of a mask, holds, then
 * travels to the corner it lives in while the ground wipes off the top
 * of the screen.
 *
 * Three things are doing the work, and the previous version had none of
 * them — it slid one block across the screen and cross-faded, which is
 * why it read as cheap:
 *   - letters rise out of a clip rather than fading in, so there is an
 *     edge moving, not just opacity changing
 *   - they are staggered, so the word assembles instead of appearing
 *   - everything runs on expo-out, which covers most of the distance
 *     immediately and settles slowly; linear and ease-in-out are what
 *     make motion feel mechanical
 *
 * The travel itself is measured, not animated by position: the wordmark
 * is rendered at its final coordinates — the hero's own padding, offset
 * and size — then transformed to screen centre for the opening and
 * released. It lands exactly on the real wordmark at any viewport, and
 * the move runs on a transform.
 *
 * Plays on every load. Arriving at the site is what triggers it.
 */
export default function Intro() {
  const markRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<"measuring" | "building" | "landing" | "gone">(
    "measuring",
  );

  useEffect(() => {
    const mark = markRef.current;
    if (!mark) return;

    const box = mark.getBoundingClientRect();
    mark.style.setProperty(
      "--dx",
      `${window.innerWidth / 2 - (box.left + box.width / 2)}px`,
    );
    mark.style.setProperty(
      "--dy",
      `${window.innerHeight / 2 - (box.top + box.height / 2)}px`,
    );

    // Paint once in the opening state before the transitions are allowed
    // to apply, or the browser coalesces both states and nothing moves.
    const toBuild = window.requestAnimationFrame(() => setPhase("building"));

    const toLand = window.setTimeout(() => setPhase("landing"), BUILT + HOLD);

    // The page starts arriving while the ground is still wiping, so the
    // two overlap rather than queueing.
    const toPage = window.setTimeout(startMotion, BUILT + HOLD + TRAVEL * 0.55);

    const toGone = window.setTimeout(
      () => setPhase("gone"),
      BUILT + HOLD + TRAVEL + WIPE,
    );

    return () => {
      window.cancelAnimationFrame(toBuild);
      window.clearTimeout(toLand);
      window.clearTimeout(toPage);
      window.clearTimeout(toGone);
    };
  }, []);

  if (phase === "gone") return null;

  const moving = phase === "landing";

  return (
    <div
      className={`${styles.wrap} ${moving ? styles.wiping : ""}`}
      aria-hidden="true"
    >
      <span
        ref={markRef}
        className={`${styles.mark} ${phase === "measuring" ? styles.opening : ""} ${
          moving ? styles.landed : ""
        }`}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            className={styles.glyph}
            style={{ "--i": i } as React.CSSProperties}
          >
            <i>{letter}</i>
          </span>
        ))}
      </span>
    </div>
  );
}
