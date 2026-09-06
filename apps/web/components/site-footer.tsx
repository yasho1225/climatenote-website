import { Link } from "next-view-transitions";
import { NoteMark } from "@/components/note-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <NoteMark className="site-footer__mark" />
          <p className="site-footer__line">
            Learn one thing. Notice it in your day. Act on it.
          </p>
        </div>

        <nav className="site-footer__links" aria-label="Footer">
          <Link href="/articles">Articles</Link>
          <Link href="/about">About</Link>
          <Link href="/support">Support</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="mailto:theclimatenote@gmail.com">theclimatenote@gmail.com</a>
        </nav>
      </div>

      <div className="site-footer__base">
        <span>The Climate Note</span>
        <span>Read on the web · Notice in the app</span>
      </div>
    </footer>
  );
}
