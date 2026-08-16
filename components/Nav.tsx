import { navLinks, studio } from "@/lib/content";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
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
