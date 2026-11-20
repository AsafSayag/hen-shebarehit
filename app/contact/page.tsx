import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DirectionsButton } from "@/components/directions-button";
import { ChevronUpIcon, FacebookIcon, HeartIcon, InstagramIcon, LocationIcon, NavigateIcon, PhoneIcon, WhatsappIcon } from "@/components/icons";
import { contactCopy, faqs } from "@/lib/content";
import { business, openingHoursLine, social } from "@/lib/site";
import { canonicalMetadata } from "@/lib/site-origin";

export const metadata: Metadata = { ...contactCopy.meta, ...canonicalMetadata("/contact") };

export default function ContactPage() {
  const { hero, cards, faq } = contactCopy;
  const hasSocial = Boolean(social.instagram || social.facebook);

  return (
    <>
      <section className="page-top section-cream">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "צרו קשר" }]} />
          <div className="section-title page-title">
            <h1>{hero.title}</h1>
            <p>{hero.lead}</p>
          </div>
          <div className={`contact-cards${hasSocial ? "" : " contact-cards-two"}`}>
            <article className="contact-card">
              <span className="icon-circle icon-circle-cream" aria-hidden="true"><WhatsappIcon size={24} /></span>
              <h2>{cards.whatsapp.title}</h2>
              <a href={`tel:${business.mobile}`} className="contact-card-phone" dir="ltr">{business.mobileDisplay}</a>
              <p>{cards.whatsapp.note}</p>
              <div className="contact-card-actions">
                <a href={business.whatsapp} className="button button-dark" target="_blank" rel="noopener noreferrer"><WhatsappIcon size={18} /> {cards.whatsapp.whatsapp}</a>
                <a href={`tel:${business.mobile}`} className="button button-outline"><PhoneIcon size={18} /> {cards.whatsapp.call}</a>
              </div>
            </article>
            <article className="contact-card">
              <span className="icon-circle icon-circle-cream" aria-hidden="true"><LocationIcon size={24} /></span>
              <h2>{cards.showroom.title}</h2>
              <p className="contact-card-strong">{business.address}</p>
              <p>{openingHoursLine} · שבת סגור</p>
              <div className="contact-card-actions">
                <DirectionsButton label={cards.showroom.navigate} address={business.address} waze={business.waze} googleMaps={business.maps} appleMaps={business.appleMaps} className="button button-outline button-wide">
                  <NavigateIcon size={18} /> {cards.showroom.navigate}
                </DirectionsButton>
              </div>
            </article>
            {hasSocial && (
              <article className="contact-card">
                <span className="icon-circle icon-circle-cream" aria-hidden="true"><HeartIcon size={24} /></span>
                <h2>{cards.social.title}</h2>
                <p className="contact-card-strong">{cards.social.subtitle}</p>
                <p>{cards.social.text}</p>
                <div className="contact-card-actions">
                  {social.instagram && <a href={social.instagram} className="button button-outline" target="_blank" rel="noopener noreferrer"><InstagramIcon size={18} /> אינסטגרם</a>}
                  {social.facebook && <a href={social.facebook} className="button button-outline" target="_blank" rel="noopener noreferrer"><FacebookIcon size={18} /> פייסבוק</a>}
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="section section-cream faq-section" id="faq" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-title">
            <h2 id="faq-title">{faq.title}</h2>
            <p>{faq.lead}</p>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}<ChevronUpIcon size={20} /></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
