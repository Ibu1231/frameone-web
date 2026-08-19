"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * The site's motion clock.
 *
 * Nothing on this site animates on scroll any more. Every reveal hangs
 * off a single clock that starts once — when the intro finishes — and
 * each element is given a delay from that moment. Scrolling scrolls;
 * it does not drive animation state.
 */

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

/**
 * Shared cadence, so every section staggers on the same rhythm.
 *
 * Kept short deliberately. Because the whole page reveals off one
 * clock, a generous beat means the sections furthest down are still
 * blank seconds after load — a reader who scrolls straight away finds
 * empty panels. Everything on the page is now revealed inside ~1.2s.
 */
export const BEAT = 90;
