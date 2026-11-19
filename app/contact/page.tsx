import type { Metadata } from "next";
import { contactCopy } from "@/lib/content";
import { business, whatsappLink } from "@/lib/site";
import { canonicalMetadata } from "@/lib/site-origin";

export const metadata: Metadata = { ...contactCopy.meta, ...canonicalMetadata("/contact") };

export default function ContactPage() {
  const { hero, topics, card } = contactCopy;

  return (
    <section className="simple-page container contact-layout">
      <div className="simple-copy">
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1>{hero.title}</h1>
        <p>{hero.lead}</p>
        <div className="contact-topics">
          <h2>{topics.title}</h2>
          <ul className="topic-list">
            {topics.items.map((topic) => (
              <li key={topic.label}>
                <a href={whatsappLink(topic.message)} target="_blank" rel="noopener noreferrer">
                  {topic.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="contact-card">
        <div className="contact-row">
          <span>{card.address}</span>
          <a href={business.maps} target="_blank" rel="noopener noreferrer">{business.address} <span aria-hidden="true">↗</span></a>
        </div>
        <div className="contact-row">
          <span>{card.navigate}</span>
          <div className="contact-nav-links">
            <a href={business.waze} target="_blank" rel="noopener noreferrer">Waze <span aria-hidden="true">↗</span></a>
            <a href={business.maps} target="_blank" rel="noopener noreferrer">Google Maps <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="contact-row">
          <span>{card.landline}</span>
          <a href={`tel:${business.landline}`} dir="ltr">{business.landline}</a>
        </div>
        <div className="contact-row">
          <span>{card.mobile}</span>
          <a href={`tel:${business.mobile}`} dir="ltr">{business.mobile}</a>
        </div>
        <a className="button button-primary contact-whatsapp" href={business.whatsapp} target="_blank" rel="noopener noreferrer">{card.whatsapp} <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
