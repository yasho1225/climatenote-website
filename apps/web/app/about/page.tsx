import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { Reveal } from "@/components/reveal";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Climate Note turns one climate story a week into one small action — understanding you can actually use.",
};

const loop = [
  { step: "Learn", title: "Understand one thing", copy: "A single, clear story a week — written for readers who want the truth without the doom." },
  { step: "Notice", title: "See it in your day", copy: "Each story points to where the issue already shows up in an ordinary corner of your life." },
  { step: "Act", title: "Keep one small thing", copy: "One specific action, small enough to actually carry into the week — and, if you like, track." },
];

const principles: [string, React.ReactNode][] = [
  ["Who it's for", "Curious readers from about age 13 up. No background in climate science required — just a willingness to pay attention."],
  ["What it costs", "Nothing. The Climate Note is free, with no ads and no in-app purchases. You can read every note without an account."],
  [
    "Your privacy",
    "An account is only needed to keep your own private notes and track the actions you choose. Reflections are private — there is no public user-generated content.",
  ],
  [
    "How it's made",
    "One story a week is published from an approved, validated source. The original article stays intact; the short summary and suggested actions are generated as separate, clearly derivative notes.",
  ],
];

export default function AboutPage() {
  return (
    <>
      <header className={styles.hero}>
        <p className="eyebrow">About</p>
        <h1 className={styles.title}>Climate information that feels possible.</h1>
        <p className={styles.lede}>
          Most climate coverage leaves you informed and stuck. The Climate Note is built to do the
          opposite: turn understanding into <em>something you can do</em>, one small note at a time.
        </p>
      </header>

      <section className={styles.loop} aria-label="How The Climate Note works">
        {loop.map((item, index) => (
          <Reveal as="div" className={styles.loopItem} key={item.step} delay={index * 90}>
            <span className={styles.loopStep}>{item.step}</span>
            <h2 className={styles.loopTitle}>{item.title}</h2>
            <p className={styles.loopCopy}>{item.copy}</p>
          </Reveal>
        ))}
      </section>

      <Reveal as="dl" className={styles.principles}>
        {principles.map(([term, copy]) => (
          <div className={styles.principle} key={term}>
            <dt>{term}</dt>
            <dd>{copy}</dd>
          </div>
        ))}
      </Reveal>

      <Reveal as="section" className={styles.contact}>
        <h2 className={styles.contactTitle}>Questions or ideas?</h2>
        <p>
          Write to <a href="mailto:theclimatenote@gmail.com">theclimatenote@gmail.com</a>. For account
          help or data requests, see <Link href="/support">Support</Link>.
        </p>
      </Reveal>
    </>
  );
}
