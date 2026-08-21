"use client";

import { useCallback, useRef, useState } from "react";

type Axis = "both" | "x" | "y";

type Options = {
  onDismiss: () => void;
  /**
   * Which direction closes. "x" is rightward — the iOS back gesture.
   * "y" is downward — the iOS photo-viewer gesture. "both" takes either.
   */
  axis?: Axis;
  /**
   * Set on surfaces that page: a horizontal flick moves between items
   * instead of closing. +1 is next, -1 is previous.
   */
  onPage?: (direction: 1 | -1) => void;
  /**
   * Gate for downward closing on a surface that also scrolls. The reel
   * player only accepts it at the very top of its track, where a
   * downward drag has nothing left to scroll.
   */
  canDismissDown?: () => boolean;
};

/** How far a drag travels before it counts as leaving. */
const DISMISS = 88;
/** A shorter throw for paging — it is a lighter action. */
const PAGE = 52;
/** A quick flick counts even when it did not travel far. */
const FLICK = 0.5;

/**
 * iOS-style drag gestures for the photo and film viewers.
 *
 * The surface follows the finger and either leaves, pages, or springs
 * back on release. Touch only — a mouse gets the buttons, which is what
 * a mouse expects.
 */
export function useDismissGesture({
  onDismiss,
  axis = "both",
  onPage,
  canDismissDown,
}: Options) {
  const from = useRef<{ x: number; y: number; t: number } | null>(null);
  const now = useRef({ dx: 0, dy: 0 });
  const [drag, setDrag] = useState({ dx: 0, dy: 0, live: false });

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
      const rawX = t.clientX - origin.x;
      const rawY = t.clientY - origin.y;
      if (Math.abs(rawX) < 8 && Math.abs(rawY) < 8) return;

      const horizontal = Math.abs(rawX) > Math.abs(rawY);
      // Paging moves either way; closing only ever moves right or down,
      // so a drag the other way should sit still rather than lift the
      // surface off in a direction that does nothing.
      const canX = onPage ? true : axis !== "y";
      const canY =
        axis !== "x" && (canDismissDown ? canDismissDown() : true);

      const dx = canX ? (onPage ? rawX : Math.max(0, rawX)) : 0;
      const dy = canY && !(horizontal && onPage) ? Math.max(0, rawY) : 0;

      now.current = { dx, dy };
      setDrag({ dx, dy, live: true });
    },
    [axis, onPage, canDismissDown],
  );

  const onTouchEnd = useCallback(() => {
    const origin = from.current;
    const { dx, dy } = now.current;
    from.current = null;
    now.current = { dx: 0, dy: 0 };
    setDrag({ dx: 0, dy: 0, live: false });

    const travelled = Math.max(Math.abs(dx), Math.abs(dy));
    const speed = origin ? travelled / Math.max(1, Date.now() - origin.t) : 0;
    const quick = speed > FLICK;

    // A sideways flick on a paging surface moves between items.
    if (onPage && Math.abs(dx) > Math.abs(dy) && (Math.abs(dx) > PAGE || quick)) {
      onPage(dx < 0 ? 1 : -1);
      return;
    }

    const leftRight = axis !== "y" && !onPage && dx > 0;
    const downward = axis !== "x" && dy > 0;
    const enough = travelled > DISMISS || quick;

    if (enough && (leftRight || downward)) onDismiss();
  }, [axis, onDismiss, onPage]);

  const travelled = Math.max(Math.abs(drag.dx), Math.abs(drag.dy));
  const style: React.CSSProperties = drag.live
    ? {
        transform: `translate3d(${drag.dx}px, ${drag.dy}px, 0) scale(${
          1 - Math.min(travelled / 2600, 0.06)
        })`,
        // Fades as it goes, so the gesture reads as reversible right up
        // until it is released.
        opacity: 1 - Math.min(travelled / 560, 0.5),
        transition: "none",
      }
    : {};

  return {
    handlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel: onTouchEnd },
    style,
    dragging: drag.live,
  };
}
