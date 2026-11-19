import type { Metadata } from "next";
import { ReviewCard } from "@/components/review-card";
import { googleRating, googleReviews, googleReviewsUrl, reviewsCheckedAt } from "@/lib/reviews";
import { canonicalMetadata } from "@/lib/site-origin";

export const metadata: Metadata = {
  ...canonicalMetadata("/reviews"),
  title: "ביקורות לקוחות",
  description: "כל 40 הביקורות על החן שברהיט ב-Google, כולן בדירוג 5 כוכבים. תקצירי הביקורות וקישור לכרטיס העסק ב-Google Maps.",
};

export default function ReviewsPage() {
  return (
    <section className="reviews-page container">
      <div className="reviews-page-intro">
        <span className="eyebrow">לקוחות מספרים</span>
        <h1>הביקורות עלינו</h1>
        <div className="reviews-rating" aria-label={`${googleRating} מתוך 5 כוכבים, ${googleReviews.length} ביקורות ב-Google`}>
          <strong dir="ltr">{googleRating.toFixed(1)}</strong>
          <span className="review-stars" aria-hidden="true">★★★★★</span>
          <span>{googleReviews.length} ביקורות Google</span>
        </div>
        <p>כאן מופיעות כל הביקורות שפורסמו בכרטיס העסק, עם תקציר לכל ביקורת כתובה. שתי ביקורות כוללות דירוג בלבד. הנתונים נבדקו ב־{reviewsCheckedAt}.</p>
        <a className="text-link" href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">לקריאת הביקורות המלאות ב-Google <span aria-hidden="true">↗</span></a>
      </div>
      <div className="reviews-grid">
        {googleReviews.map((review) => <ReviewCard key={review.name} review={review} />)}
      </div>
    </section>
  );
}
