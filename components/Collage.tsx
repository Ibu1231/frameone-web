import { collage } from "@/lib/content";
import Reveal from "./Reveal";
import styles from "./Collage.module.css";

const CAPTIONS = ["Artist", "Nature", "Automotive"];

export default function Collage() {
  return (
    <div className="chapter" style={{ height: "180svh" }} id="work">
      <section className="panel dk">
        <div className={`inner pad ${styles.inner}`}>
          <div className={styles.grid}>
            {collage.tiles.map((tile, i) => (
              <Reveal key={tile.src} delay={i * 0.1} className={styles.tile}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.src}
                  alt={tile.alt}
                  width={tile.width}
                  height={tile.height}
                  loading="lazy"
                />
                <span className={styles.tileNum}>{CAPTIONS[i]}</span>
              </Reveal>
            ))}
          </div>

          <div className={styles.overlay}>
            <Reveal as="h2" mask delay={0.2}>
              {collage.overlay}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
