import styles from "./loading.module.css";

/**
 * Route-level loading state for an article. Mirrors the real article layout so
 * the transition feels stable, not jarring. Purely visual — announced once to
 * assistive tech, and the pulse is disabled under reduced motion (see globals).
 */
export default function ArticleLoading() {
  return (
    <div className="article" aria-busy="true">
      <p className="visually-hidden" role="status">
        Loading the note…
      </p>

      <div className={`article__hero ${styles.hero}`} aria-hidden="true">
        <div className={`skeleton ${styles.back}`} />
        <div className={`skeleton ${styles.chip}`} />
        <div className={`skeleton ${styles.titleLine}`} />
        <div className={`skeleton ${styles.titleLine}`} />
        <div className={`skeleton ${styles.titleLine}`} />
        <div className={`skeleton ${styles.dek}`} />
        <div className={`skeleton ${styles.dek}`} />
        <div className={`skeleton ${styles.meta}`} />
      </div>

      <div className={`skeleton ${styles.cover}`} aria-hidden="true" />

      <div className={styles.body} aria-hidden="true">
        {[...Array(8).keys()].map((index) => (
          <div key={index} className={`skeleton ${styles.line}`} />
        ))}
      </div>
    </div>
  );
}
