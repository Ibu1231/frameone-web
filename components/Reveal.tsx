"use client";

import { type ElementType, type ReactNode } from "react";
import { useReveal } from "@/lib/motion";
import styles from "./Reveal.module.css";

type Props = {
  children: ReactNode;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
  /** Position in the stagger, in seconds from the motion clock start. */
  delay?: number;
  /** Mask-and-rise treatment, for headings. */
  mask?: boolean;
  className?: string;
  /** Forwarded so a revealed block can also be a scroll anchor. */
  id?: string;
};

/**
 * Reveals its children on the site's motion clock.
 *
 * This used to wait for an IntersectionObserver, which meant nothing
 * moved until the reader scrolled to it. Now every reveal hangs off the
 * shared clock and arrives on its own delay, so a section plays its
 * entrance in order whether or not it is being looked at.
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  mask = false,
  className = "",
  id,
}: Props) {
  const shown = useReveal(delay * 1000);

  const base = mask ? styles.mask : styles.reveal;
  const classes = [base, shown ? styles.in : "", className]
    .filter(Boolean)
    .join(" ");

  const Tag = as as ElementType<{
    id?: string;
    className?: string;
    children?: ReactNode;
  }>;

  return (
    <Tag id={id} className={classes}>
      {mask ? <span>{children}</span> : children}
    </Tag>
  );
}
