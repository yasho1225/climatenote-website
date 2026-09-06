import { Link } from "next-view-transitions";

export default function NotFound() {
  return (
    <div className="page-shell">
      <p className="eyebrow">404</p>
      <h1>This climate note isn’t here.</h1>
      <p><Link href="/articles">Return to the article archive</Link></p>
    </div>
  );
}
