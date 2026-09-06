import type { ArticleGeneration } from "@/lib/articles/schema";

export function ActionPicker({ generation }: { generation: ArticleGeneration }) {
  return (
    <section className="note-actions" aria-labelledby="action-title">
      <div className="note-actions__head">
        <p className="eyebrow">Write your note</p>
        <h2 id="action-title">Pick one thing to carry into your week</h2>
        <p className="note-actions__lede">
          Choose a single action. In the iPhone app you can save it, keep a quiet streak, and write
          your own private note.
        </p>
      </div>

      <div className="note-actions__grid">
        {generation.suggestedActions.map((action, index) => (
          <article className="note-card" key={action.id}>
            <div className="note-card__top">
              <span className="note-card__index">{String(index + 1).padStart(2, "0")}</span>
              <span className="note-card__cat">{action.category}</span>
            </div>
            <h3>{action.title}</h3>
            <p>{action.instruction}</p>
            <span className="note-card__cadence">{action.cadence}</span>
          </article>
        ))}

        <article className="note-card note-card--own">
          <div className="note-card__top">
            <span className="note-card__index" aria-hidden="true">
              +
            </span>
            <span className="note-card__cat">Yours</span>
          </div>
          <h3>Write your own</h3>
          <p>Create a private action or reflection in the iPhone app. Nothing you write is public.</p>
          <span className="note-card__cadence">Yours to keep</span>
        </article>
      </div>
    </section>
  );
}
