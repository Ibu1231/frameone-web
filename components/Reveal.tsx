"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import styles from "./Reveal.module.css";

type Props = {
  children: ReactNode;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
  /** Stagger, in seconds, for items revealing as a group. */
  delay?: number;
  /** Mask-and-rise treatment, for headings. */
  mask?: boolean;
  className?: string;
  /** Forwarded so a revealed block can also be a scroll anchor. */
  id?: string;
};

/**
 * Reveals its children once scrolled into view, using the shared site
 * timing. Fires once and then stops observing — re-animating on every
 * pass reads as restless rather than considered.
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  mask = false,
  className = "",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Already in view on load (the hero, mostly): show without waiting.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const base = mask ? styles.mask : styles.reveal;
  const classes = [base, shown ? styles.in : "", className]
    .filter(Boolean)
    .join(" ");

  const Tag = as as ElementType<{
    id?: string;
    ref?: React.Ref<HTMLElement>;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }>;

  return (
    <Tag
      id={id}
      ref={ref}
      className={classes}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties)
          : undefined
      }
    >
      {mask ? <span>{children}</span> : children}
    </Tag>
  );
}
