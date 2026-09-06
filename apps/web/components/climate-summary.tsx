import type { ArticleGeneration } from "@/lib/articles/schema";

export function ClimateSummary({ generation }: { generation: ArticleGeneration }) {
  const rows = [
    ["What's happening", generation.summary.problem],
    ["Why it matters", generation.summary.whyItMatters],
    ["What we can do", generation.summary.whatWeCanDo],
  ] as const;

  return (
    <section className="note-summary" aria-labelledby="summary-title">
      <div className="note-summary__head">
        <p className="eyebrow">The short version</p>
        <h2 id="summary-title">If you only read three lines</h2>
      </div>
      <dl className="note-summary__grid">
        {rows.map(([term, copy], index) => (
          <div className="note-summary__row" key={term}>
            <dt>
              <span className="note-summary__index">{String(index + 1).padStart(2, "0")}</span>
              {term}
            </dt>
            <dd>{copy}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
