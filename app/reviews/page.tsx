import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ExternalIcon } from "@/components/icons";
import { ReviewCard, Stars } from "@/components/review-card";
import { WhatsappBand } from "@/components/whatsapp-band";
import { googleRating, googleReviews, googleReviewsUrl, reviewsCheckedAt } from "@/lib/reviews";
import { canonicalMetadata } from "@/lib/site-origin";

export const metadata: Metadata = {
  ...canonicalMetadata("/reviews"),
  title: "ביקורות לקוחות",
  description: "כל 40 הביקורות על החן שברהיט ב-Google, כולן בדירוג 5 כוכבים. תקצירי הביקורות וקישור לכרטיס העסק ב-Google Maps.",
};

export default function ReviewsPage() {
  return (
    <>
      <section className="page-top section-cream">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "ביקורות" }]} />
          <div className="section-title page-title">
            <span className="eyebrow">ביקורות Google</span>
            <h1>מה הלקוחות שלנו מספרים</h1>
            <div className="rating-summary" aria-label={`${googleRating} מתוך 5 כוכבים, ${googleReviews.length} ביקורות ב-Google`}>
              <strong dir="ltr">{googleRating.toFixed(1)}</strong>
              <span><Stars size={16} /><small>{googleReviews.length} ביקורות ב-Google</small></span>
            </div>
            <p>כאן מופיעות כל הביקורות שפורסמו בכרטיס העסק, עם תקציר לכל ביקורת כתובה. שתי ביקורות כוללות דירוג בלבד. הנתונים נבדקו ב־{reviewsCheckedAt}.</p>
            <a className="button button-outline" href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">לקריאת הביקורות המלאות ב-Google <ExternalIcon size={16} /></a>
          </div>
          <div className="reviews-grid">
            {googleReviews.map((review) => <ReviewCard key={review.name} review={review} />)}
          </div>
        </div>
      </section>
      <WhatsappBand />
    </>
  );
}
