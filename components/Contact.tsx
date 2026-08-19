import { socials, studio } from "@/lib/content";
import Reveal from "./Reveal";
import SocialIcon from "./SocialIcon";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <div className="chapter" style={{ height: "100svh" }} id="contact">
      <section className="panel dk">
        {/* Two deep-red washes over near-black, and the wordmark set very
            large and very dim behind everything. It gives the closing
            panel some depth without another image to download. */}
        <div className={styles.ground} aria-hidden="true" />
        <span className={styles.ghost} aria-hidden="true">
          {studio.name}
        </span>

        <div className={`inner pad ${styles.inner}`}>
          <Reveal as="span" delay={1.1} className={`lbl ${styles.kicker}`}>
            Let&rsquo;s talk
          </Reveal>
          <Reveal as="h2" mask delay={1.17} className={`gradTitle ${styles.heading}`}>
            Let&rsquo;s make something worth watching.
          </Reveal>

          <Reveal delay={1.26} className={styles.row}>
            <a href={`mailto:${studio.email}`} className={styles.mail}>
              {studio.email}
            </a>

            <div className={styles.cols}>
              <div className={styles.col}>
                <span className="lbl">Studio</span>
                <p>{studio.location}</p>
                <p>{studio.reach}</p>
              </div>

              <div className={styles.col}>
                <span className="lbl">Follow</span>
                <div className={styles.socials}>
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className={styles.social}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <SocialIcon name={s.icon} />
                      <span className={styles.socialText}>
                        <b>{s.label}</b>
                        <i>{s.handle}</i>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

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
