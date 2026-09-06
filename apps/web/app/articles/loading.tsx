import styles from "./loading.module.css";

/** Route-level loading state for the archive — mirrors the index layout. */
export default function ArticlesLoading() {
  return (
    <div className={styles.wrap} aria-busy="true">
      <p className="visually-hidden" role="status">
        Loading notes…
      </p>

      <div aria-hidden="true">
        <div className={`skeleton ${styles.eyebrow}`} />
        <div className={`skeleton ${styles.title}`} />

        <div className={styles.filter}>
          {[...Array(5).keys()].map((index) => (
            <div key={index} className={`skeleton ${styles.pill}`} />
          ))}
        </div>

        <div className={styles.rows}>
          {[...Array(5).keys()].map((index) => (
            <div key={index} className={styles.row}>
              <div className={`skeleton ${styles.num}`} />
              <div className={styles.stack}>
                <div className={`skeleton ${styles.titleRow}`} />
                <div className={`skeleton ${styles.excerpt}`} />
              </div>
              <div className={`skeleton ${styles.thumb}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
