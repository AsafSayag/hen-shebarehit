import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/cta-band";
import { aboutCopy } from "@/lib/content";

export const metadata: Metadata = aboutCopy.meta;

export default function AboutPage() {
  const { hero, process, cta } = aboutCopy;

  return (
    <>
      <section className="simple-page about-hero container about-layout">
        <div className="simple-copy">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.title}</h1>
          {hero.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <Link href="/catalog" className="button button-primary">{hero.primary} <span aria-hidden="true">←</span></Link>
        </div>
        <div className="about-art">
          <Image src="/images/living-room-sketch.png" alt="איור סלון בהיר" width={1752} height={897} sizes="(max-width: 760px) 100vw, 50vw" loading="eager" />
        </div>
      </section>

      <section className="process-section section-pad" aria-labelledby="process-title">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{process.eyebrow}</span>
              <h2 id="process-title">{process.title}</h2>
            </div>
          </div>
          <ol className="process-list">
            {process.steps.map((step) => (
              <li className="process-step" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        id="about-cta"
        eyebrow={cta.eyebrow}
        title={cta.title}
        text={cta.text}
        primary={{ label: cta.primary, href: "/contact" }}
        secondary={{ label: cta.secondary, href: "/catalog" }}
      />
    </>
  );
}
