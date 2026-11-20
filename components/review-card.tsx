import { StarIcon } from "@/components/icons";

type Review = {
  name: string;
  summary: string | null;
};

// First name and the initial of the last name, as in the designer's cards ("נטלי ק.").
export function shortName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return parts[0];
  const first = parts[0];
  const initial = parts[parts.length - 1][0];
  const formatted = `${first[0].toLocaleUpperCase()}${first.slice(1)}`;
  return `${formatted} ${initial.toLocaleUpperCase()}.`;
}

export function Stars({ size = 14 }: { size?: number }) {
  return (
    <span className="review-stars" role="img" aria-label="5 מתוך 5 כוכבים">
      {[0, 1, 2, 3, 4].map((index) => <StarIcon key={index} size={size} />)}
    </span>
  );
}

export function ReviewCard({ review, tone = "light" }: { review: Review; tone?: "light" | "dark" }) {
  const name = shortName(review.name);
  return (
    <article className={`review-card review-card-${tone}`}>
      <Stars />
      {review.summary ? (
        <p className="review-summary">{review.summary}</p>
      ) : (
        <p className="review-summary review-summary-empty">דירוג של 5 כוכבים ללא טקסט</p>
      )}
      <div className="review-author">
        <span className="review-avatar" aria-hidden="true">{name[0]}</span>
        <span>
          <strong dir="auto">{name}</strong>
          <small>ביקורת ב-Google</small>
        </span>
      </div>
    </article>
  );
}
