import styles from "./Statement.module.css";

type Props = {
  label: string;
  heading: string;
  columns: string[];
  height: string;
  dark?: boolean;
  id?: string;
};

/** A full-viewport typographic panel — used for both the studio
 *  statement and the dark "selected work" preamble. */
export default function Statement({
  label,
  heading,
  columns,
  height,
  dark,
  id,
}: Props) {
  return (
    <div className="chapter" style={{ height }} id={id}>
      <section className={`panel${dark ? " dk" : ""}`}>
        <div className={`inner pad ${dark ? styles.dark : ""}`}>
          <div className={styles.top}>
            <span className={`lbl ${styles.label}`}>{label}</span>
            <h2 className={styles.heading}>{heading}</h2>
          </div>
          <div className={styles.cols}>
            {columns.map((copy) => (
              <p key={copy}>{copy}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
