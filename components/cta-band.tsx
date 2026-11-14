import Image from "next/image";
import Link from "next/link";

type Action = { label: string; href: string; external?: boolean };

type Props = {
  eyebrow: string;
  title: string;
  text: string;
  primary: Action;
  secondary?: Action;
  id?: string;
};

function ActionLink({ action, className }: { action: Action; className: string }) {
  if (action.external) {
    return (
      <a href={action.href} className={className} target="_blank" rel="noopener noreferrer">
        {action.label} <span aria-hidden="true">↗</span>
      </a>
    );
  }
  return (
    <Link href={action.href} className={className}>
      {action.label} <span aria-hidden="true">←</span>
    </Link>
  );
}

export function CtaBand({ eyebrow, title, text, primary, secondary, id }: Props) {
  const titleId = `${id ?? "cta"}-title`;
  return (
    <section className="cta-section container" id={id} aria-labelledby={titleId}>
      <div className="cta-panel">
        <Image src="/brand/living-room-mark.svg" alt="" width={420} height={230} className="cta-mark" aria-hidden="true" />
        <div className="cta-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h2 id={titleId}>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-actions">
          <ActionLink action={primary} className="button button-primary" />
          {secondary && <ActionLink action={secondary} className="text-link" />}
        </div>
      </div>
    </section>
  );
}
