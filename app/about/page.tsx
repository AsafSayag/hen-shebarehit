import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ChatIcon, DeliveryIcon, ExternalIcon, HomeIcon, SwatchIcon } from "@/components/icons";
import { ReviewCard, Stars } from "@/components/review-card";
import { WhatsappBand } from "@/components/whatsapp-band";
import { aboutCopy } from "@/lib/content";
import { googleRating, googleReviews, googleReviewsUrl } from "@/lib/reviews";
import { canonicalMetadata } from "@/lib/site-origin";

export const metadata: Metadata = { ...aboutCopy.meta, ...canonicalMetadata("/about") };

const stepIcons = { chat: ChatIcon, swatch: SwatchIcon, delivery: DeliveryIcon, home: HomeIcon };

// Four written reviews that speak to service, fit and delivery.
const featuredReviewNames = ["Chen Zino", "איריס אריה", "shelly arava", "ישי ודבורי טויסטר"];

export default function AboutPage() {
  const { hero, story, process, reviews } = aboutCopy;
  const featuredReviews = featuredReviewNames
    .map((name) => googleReviews.find((review) => review.name === name))
    .filter((review) => review !== undefined);

  return (
    <>
      <section className="page-top section-cream">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "אודות" }]} />
          <div className="section-title page-title">
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1>{hero.title}</h1>
            <p>{hero.lead}</p>
          </div>
          <div className="about-hero-image">
            <Image src="/images/design/about/showroom.webp" alt="אולם תצוגה מואר עם סלון, פינת אוכל, כורסה ומיטה" fill priority sizes="(max-width: 1340px) 96vw, 1312px" />
          </div>
        </div>
      </section>

      <section className="section section-white" aria-labelledby="story-title">
        <div className="container about-story">
          <div className="about-story-copy">
            <h2 id="story-title">{story.title}</h2>
            {story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="about-story-image">
            <Image src="/images/design/about/story.webp" alt="כורסה כחולה מרופדת לצד דוגמאות בדים" fill sizes="(max-width: 760px) 92vw, 530px" />
          </div>
        </div>
      </section>

      <section className="section section-dark" aria-labelledby="process-title">
        <div className="container">
          <div className="section-title section-title-dark">
            <h2 id="process-title">{process.title}</h2>
            <p>{process.lead}</p>
          </div>
          <ol className="process-steps">
            {process.steps.map((step) => {
              const Icon = stepIcons[step.icon];
              return (
                <li key={step.title}>
                  <span className="process-icon" aria-hidden="true"><Icon size={26} /></span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section section-cream" aria-labelledby="about-reviews-title">
        <div className="container about-reviews">
          <div className="about-reviews-copy">
            <h2 id="about-reviews-title">{reviews.title}</h2>
            <div className="rating-summary rating-summary-start" aria-label={`${googleRating} מתוך 5 כוכבים, ${googleReviews.length} ביקורות ב-Google`}>
              <strong dir="ltr">{googleRating.toFixed(1)}</strong>
              <span><Stars size={16} /><small>{googleReviews.length} ביקורות ב-Google</small></span>
            </div>
            <p>{reviews.text}</p>
            <a href={googleReviewsUrl} className="button button-outline" target="_blank" rel="noopener noreferrer">{reviews.link} <ExternalIcon size={16} /></a>
          </div>
          <div className="about-reviews-grid">
            {featuredReviews.map((review, index) => <ReviewCard key={review.name} review={review} index={index} />)}
          </div>
        </div>
      </section>

      <WhatsappBand />
    </>
  );
}
