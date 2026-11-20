import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { DirectionsButton } from "@/components/directions-button";
import { ArrowLeftIcon, ClockIcon, DeliveryIcon, ExternalIcon, LocationIcon, PersonIcon, PhoneIcon, SlidersIcon, SofaIcon, WhatsappIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ReviewCard, Stars } from "@/components/review-card";
import { RoomScene } from "@/components/room-scene";
import { ScrollRail } from "@/components/scroll-rail";
import { features, homeCopy, roomHotspots, styleCards } from "@/lib/content";
import { products } from "@/lib/products";
import { googleRating, googleReviews } from "@/lib/reviews";
import { canonicalMetadata } from "@/lib/site-origin";
import { business, catalogCards, openingHours, whatsappLink } from "@/lib/site";

export const metadata: Metadata = canonicalMetadata("/");

// Products with clean studio photos, one or two from each main category.
const showcaseIds = [60026, 61012, 62013, 61002, 60021, 62002, 61008, 60003];
const showcase = showcaseIds
  .map((id) => products.find((product) => product.id === id))
  .filter((product) => product !== undefined);

const featureIcons = { delivery: DeliveryIcon, person: PersonIcon, sliders: SlidersIcon, sofa: SofaIcon };

export default function HomePage() {
  const { hero, categories, products: productsCopy, room, styles, features: featuresCopy, about, reviews, visit } = homeCopy;
  const writtenReviews = googleReviews.filter((review) => review.summary);

  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <Image src="/images/design/home/hero.webp" alt="סלון בגוונים חמים עם ספה בהירה, כורסה ירוקה ושולחן עץ עגול" fill priority sizes="100vw" className="home-hero-image" />
        <div className="container home-hero-content">
          <h1 id="hero-title">{hero.title}</h1>
          <p>{hero.lead}</p>
          <div className="home-hero-actions">
            <Link href="/catalog" className="button button-light">{hero.primary} <ArrowLeftIcon size={18} /></Link>
            <Link href="/about" className="button button-ghost-light">{hero.secondary}</Link>
          </div>
        </div>
      </section>

      <section className="section section-cream" aria-labelledby="categories-title">
        <div className="container">
          <div className="section-title">
            <h2 id="categories-title">{categories.title}</h2>
            <p>{categories.lead}</p>
          </div>
          <div className="category-photo-grid">
            {catalogCards.map((card) => (
              <Link key={card.key} href={card.href} className="category-photo">
                <Image src={card.image} alt="" fill sizes="(max-width: 760px) 46vw, (max-width: 1100px) 31vw, 310px" />
                <span>{card.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showcase.length > 0 && (
        <section className="section section-white" aria-labelledby="showcase-title">
          <div className="container">
            <div className="section-title">
              <h2 id="showcase-title">{productsCopy.title}</h2>
              <p>{productsCopy.lead.replace("{count}", String(products.length))}</p>
            </div>
            <ScrollRail
              label={productsCopy.title}
              footer={<Link href="/catalog" className="button button-outline">{productsCopy.link} <ArrowLeftIcon size={18} /></Link>}
            >
              {showcase.map((product) => (
                <div className="scroll-rail-item" key={product.id}><ProductCard product={product} showType /></div>
              ))}
            </ScrollRail>
          </div>
        </section>
      )}

      <section className="section section-cream room-section" aria-labelledby="room-title">
        <div className="container section-title">
          <h2 id="room-title">{room.title}</h2>
          <p>{room.lead}</p>
        </div>
        <RoomScene image="/images/design/home/room-bedroom.webp" alt="חדר שינה עם מיטה מרופדת, ארון כהה וכורסת עץ ליד החלון" hotspots={roomHotspots} />
      </section>

      <section className="section section-cream" aria-labelledby="styles-title">
        <div className="container">
          <div className="section-title">
            <h2 id="styles-title">{styles.title}</h2>
            <p>{styles.lead}</p>
          </div>
          <div className="style-grid">
            {styleCards.map((card) => (
              <Link key={card.key} href={card.href} className={`style-card style-card-${card.key}`}>
                <Image src={card.image} alt="" fill sizes="(max-width: 760px) 92vw, 60vw" />
                <span className="style-card-copy">
                  <strong>{card.title}</strong>
                  <span>{card.text}</span>
                  <span className="style-card-link">{card.link} <ArrowLeftIcon size={16} /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="features-title">
        <div className="container">
          <div className="section-title">
            <h2 id="features-title">{featuresCopy.title}</h2>
            <p>{featuresCopy.lead}</p>
          </div>
          <ul className="feature-list">
            {features.map((feature) => {
              const Icon = featureIcons[feature.icon];
              return (
                <li key={feature.title}>
                  <span className="icon-circle icon-circle-cream" aria-hidden="true"><Icon size={26} /></span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section-cream" aria-labelledby="home-about-title">
        <div className="container home-about">
          <div className="home-about-copy">
            <span className="eyebrow">{about.eyebrow}</span>
            <h2 id="home-about-title">{about.title}</h2>
            {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <Link href="/about" className="button button-outline">{about.link} <ArrowLeftIcon size={18} /></Link>
          </div>
          <div className="home-about-media">
            <div className="home-about-main"><Image src="/images/design/home/about-showroom.webp" alt="פינת ישיבה באולם התצוגה עם ספה בהירה, כורסת עץ ושולחן עגול" fill sizes="(max-width: 760px) 80vw, 520px" /></div>
            <div className="home-about-inset"><Image src="/images/design/home/about-fabrics.webp" alt="יד נוגעת בדוגמאות בדים" fill sizes="(max-width: 760px) 36vw, 230px" /></div>
          </div>
        </div>
      </section>

      <section className="section section-dark" aria-labelledby="home-reviews-title">
        <div className="container">
          <div className="section-title section-title-dark">
            <span className="eyebrow">{reviews.eyebrow}</span>
            <h2 id="home-reviews-title">{reviews.title}</h2>
            <span className="title-ornament" aria-hidden="true" />
            <div className="rating-summary" aria-label={`${googleRating} מתוך 5 כוכבים, ${googleReviews.length} ביקורות ב-Google`}>
              <strong dir="ltr">{googleRating.toFixed(1)}</strong>
              <span><Stars /><small>{googleReviews.length} ביקורות ב-Google</small></span>
            </div>
          </div>
          <div className="review-row">
            {writtenReviews.slice(0, 6).map((review) => <ReviewCard key={review.name} review={review} tone="dark" />)}
          </div>
          <div className="section-actions">
            <Link href="/reviews" className="button button-ghost-light">{reviews.link} <ArrowLeftIcon size={18} /></Link>
            <p className="reviews-note">הטקסטים הם תקצירי ביקורות שפורסמו ב-Google.</p>
          </div>
        </div>
      </section>

      <section className="section section-cream" id="visit" aria-labelledby="visit-title">
        <div className="container">
          <div className="section-title">
            <h2 id="visit-title">{visit.title}</h2>
            <p>{visit.lead}</p>
          </div>
          <div className="visit-layout">
            <div className="visit-card">
              <div className="visit-row">
                <span className="icon-circle icon-circle-cream" aria-hidden="true"><LocationIcon size={22} /></span>
                <div>
                  <h3>כתובת</h3>
                  <a href={business.maps} target="_blank" rel="noopener noreferrer" className="underline-link">{business.address}</a>
                </div>
              </div>
              <div className="visit-row">
                <span className="icon-circle icon-circle-cream" aria-hidden="true"><ClockIcon size={22} /></span>
                <div>
                  <h3>שעות פתיחה</h3>
                  <dl className="hours-list">
                    {openingHours.map((row) => <div key={row.days}><dt>{row.days}</dt><dd>{row.hours}</dd></div>)}
                  </dl>
                </div>
              </div>
              <div className="visit-row">
                <span className="icon-circle icon-circle-cream" aria-hidden="true"><PhoneIcon size={22} /></span>
                <div>
                  <h3>טלפון</h3>
                  <a href={`tel:${business.mobile}`} dir="ltr">{business.mobileDisplay}</a>
                </div>
              </div>
              <div className="visit-card-foot">
                <p>{visit.question}</p>
                <div className="visit-actions">
                  <a href={whatsappLink(visit.whatsappText)} className="button button-dark" target="_blank" rel="noopener noreferrer"><WhatsappIcon size={18} /> כתבו לנו בוואטסאפ</a>
                  <DirectionsButton label="איך מגיעים?" address={business.address} waze={business.waze} googleMaps={business.maps} appleMaps={business.appleMaps} className="button button-outline">
                    איך מגיעים? <ArrowLeftIcon size={18} />
                  </DirectionsButton>
                </div>
              </div>
            </div>
            <div className="visit-map">
              <iframe
                src={business.mapEmbed}
                title={`מפת Google של ${business.name}, ${business.address}`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a href={business.maps} target="_blank" rel="noopener noreferrer" className="map-pill">
                פתיחה ב-Google Maps <ExternalIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
