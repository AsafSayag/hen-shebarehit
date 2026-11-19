import { googleReviewsUrl } from "@/lib/reviews";

type Review = {
  name: string;
  summary: string | null;
};

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="review-card">
      <div className="review-card-top">
        <span className="review-stars" role="img" aria-label="5 מתוך 5 כוכבים">★★★★★</span>
        <span className="review-source">Google</span>
      </div>
      {review.summary ? (
        <p className="review-summary">{review.summary}</p>
      ) : (
        <p className="review-summary review-summary-empty">דירוג של 5 כוכבים ללא טקסט</p>
      )}
      <div className="review-card-bottom">
        <span className="review-author" dir="auto">{review.name}</span>
        <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" aria-label="לכל הביקורות של החן שברהיט ב-Google">
          לביקורות ב-Google <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
