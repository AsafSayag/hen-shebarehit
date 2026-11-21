import { Breadcrumbs } from "@/components/breadcrumbs";
import { WhatsappIcon } from "@/components/icons";
import { PhoneLink } from "@/components/phone-link";
import { business } from "@/lib/site";

export const legalUpdated = "20 בנובמבר 2026";

// Shared frame for the legal pages: title, update date, readable text column and a contact box.
export function LegalPage({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <section className="page-top section-cream">
      <div className="container">
        <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: title }]} />
        <div className="section-title page-title">
          <h1>{title}</h1>
          <p>{lead}</p>
          <span className="page-count">עודכן לאחרונה: {legalUpdated}</span>
        </div>
        <article className="legal-content">
          {children}
          <aside className="legal-contact" aria-label="יצירת קשר">
            <h2>יש שאלה?</h2>
            <p>{business.name}, {business.address}. טלפון: <PhoneLink />, טלפון בחנות: <a href={`tel:${business.landline}`} dir="ltr">{business.landline}</a>.</p>
            <a href={business.whatsapp} className="button button-dark" target="_blank" rel="noopener noreferrer"><WhatsappIcon size={18} /> כתבו לנו בוואטסאפ</a>
          </aside>
        </article>
      </div>
    </section>
  );
}
