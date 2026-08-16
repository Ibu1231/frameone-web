import type { Project } from "@/lib/content";
import styles from "./WorkPanel.module.css";

type Props = {
  project: Project;
  index: number;
  total: number;
};

/** Full-bleed project panel. The photograph slowly pushes in and the
 *  title rises from its mask — both driven by scroll, see
 *  ScrollChoreography. */
export default function WorkPanel({ project, index, total }: Props) {
  const { photo, title, context, spec } = project;

  return (
    <div className="chapter" style={{ height: "200svh" }}>
      <section className="panel" data-panel="work">
        <div className={styles.frame}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading={index === 0 ? "eager" : "lazy"}
            data-work-img
          />
        </div>
        <div className={styles.scrim} />
        <div className={`inner pad ${styles.content}`}>
          <span className={styles.num}>
            Work — {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div>
            <h2 className={styles.title}>
              <i data-work-title>{title}</i>
            </h2>
            <div className={styles.meta}>
              <span>{context}</span>
              <span>{spec}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
