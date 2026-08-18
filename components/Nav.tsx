"use client";

import { navLinks, studio } from "@/lib/content";
import { BEAT, useReveal } from "@/lib/motion";
import styles from "./Nav.module.css";

export default function Nav() {
  // Arrives with the wordmark it sits beside, not before it.
  const shown = useReveal(BEAT * 2);

  return (
    <nav
      className={`${styles.nav} ${shown ? styles.in : ""}`}
      aria-label="Primary"
    >
      <a href="#top" className={styles.logo}>
        <i aria-hidden="true" />
        {studio.name}
      </a>
      <div className={styles.links}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <a href="#contact" className={styles.cta}>
        Start a project
      </a>
    </nav>
  );
}
