import { socials, studio } from "@/lib/content";
import Reveal from "./Reveal";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <div className="chapter" style={{ height: "100svh" }} id="contact">
      <section className="panel dk">
        <div data-drift
          className={`inner pad ${styles.inner}`}>
          <Reveal as="span" className="lbl">
            Let&rsquo;s talk
          </Reveal>
          <Reveal as="h2" mask className={styles.heading}>
            Let&rsquo;s make something worth watching.
          </Reveal>

          <div className={styles.row}>
            <a href={`mailto:${studio.email}`} className={styles.mail}>
              {studio.email}
            </a>
            <div className={styles.cols}>
              <div>
                <span className="lbl">Studio</span>
                <p>{studio.location}</p>
                <p>{studio.reach}</p>
              </div>
              <div>
                <span className="lbl">Follow</span>
                {socials.map((s) => (
                  <a key={s.label} href={s.href}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <footer className={styles.foot}>
            <span>
              © {new Date().getFullYear()} {studio.legalName}
            </span>
            <span>{studio.tagline}</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
