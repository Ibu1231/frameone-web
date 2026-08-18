"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * The site's motion clock.
 *
 * Nothing on this site animates on scroll any more. Every reveal hangs
 * off a single clock that starts once — when the intro finishes, or
 * immediately if the intro has already run this session — and each
 * element is given a delay from that moment. Scrolling scrolls; it does
 * not drive animation state.
 */

const INTRO_KEY = "frameone:intro-played";

/** True once the intro has run in this browser session. */
export function introAlreadyPlayed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    // Private mode can throw on access. Playing the intro again is a far
    // better failure than crashing the page.
    return false;
  }
}

export function markIntroPlayed(): void {
  try {
    window.sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* nothing to do — the intro simply plays again */
  }
}

let started = false;
const listeners = new Set<() => void>();

/** Starts the clock. Idempotent — later calls are ignored. */
export function startMotion(): void {
  if (started) return;
  started = true;
  listeners.forEach((fn) => fn());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useMotionStarted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => started,
    // The server has no clock, so everything renders in its pre-reveal
    // state and the first client paint matches it.
    () => false,
  );
}

/**
 * True once the clock has started and `delay` ms have passed. Give
 * elements increasing delays down the page and they arrive in order.
 */
export function useReveal(delay = 0): boolean {
  const running = useMotionStarted();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (delay <= 0) {
      setShown(true);
      return;
    }
    const id = window.setTimeout(() => setShown(true), delay);
    return () => window.clearTimeout(id);
  }, [running, delay]);

  return shown;
}

/** Shared cadence, so every section staggers on the same rhythm. */
export const BEAT = 140;
