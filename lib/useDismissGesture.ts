"use client";

import { useCallback, useRef, useState } from "react";

type Axis = "both" | "x";

type Options = {
  onDismiss: () => void;
  /**
   * "x" for surfaces that own vertical scrolling — the reel player runs
   * a snap track, so a downward drag there means "next film", not
   * "close". A rightward drag is the iOS back gesture and is free.
   */
  axis?: Axis;
};

/** How far a drag has to travel before it counts as leaving. */
const THRESHOLD = 96;
/** A short, fast flick counts even if it did not travel far. */
const FLICK = 0.55;

/**
 * iOS-style drag-to-dismiss.
 *
 * The surface follows the finger, fades as it goes, and either leaves or
 * springs back on release. Touch only — a mouse gets the close button,
 * which is what a mouse expects.
 */
export function useDismissGesture({ onDismiss, axis = "both" }: Options) {
  const from = useRef<{ x: number; y: number; t: number } | null>(null);
  const now = useRef({ x: 0, y: 0 });
  const [drag, setDrag] = useState({ x: 0, y: 0, live: false });

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    from.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const origin = from.current;
      if (!origin || e.touches.length !== 1) return;
      const t = e.touches[0];
      // Only rightward and downward travel closes; dragging the other
      // way should do nothing rather than lifting the surface off.
      const x = Math.max(0, t.clientX - origin.x);
      const y = axis === "x" ? 0 : Math.max(0, t.clientY - origin.y);

      // On a surface that also scrolls, a mostly-vertical drag belongs to
      // the scroller and must be left alone.
      if (axis === "x" && Math.abs(t.clientY - origin.y) > x) return;

      if (x < 8 && y < 8) return;
      now.current = { x, y };
      setDrag({ x, y, live: true });
    },
    [axis],
  );

  const onTouchEnd = useCallback(() => {
    const origin = from.current;
    const { x, y } = now.current;
    from.current = null;
    now.current = { x: 0, y: 0 };

    const travelled = Math.max(x, y);
    const speed = origin ? travelled / Math.max(1, Date.now() - origin.t) : 0;

    if (travelled > THRESHOLD || speed > FLICK) {
      onDismiss();
      return;
    }
    setDrag({ x: 0, y: 0, live: false });
  }, [onDismiss]);

  const travelled = Math.max(drag.x, drag.y);
  const style: React.CSSProperties = drag.live
    ? {
        transform: `translate3d(${drag.x}px, ${drag.y}px, 0) scale(${
          1 - Math.min(travelled / 2600, 0.06)
        })`,
        // Fades as it leaves, so the gesture reads as reversible right
        // up until it is released.
        opacity: 1 - Math.min(travelled / 520, 0.55),
        transition: "none",
      }
    : {};

  return {
    handlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel: onTouchEnd },
    style,
    dragging: drag.live,
  };
}
