import { GoogleIcon, StarIcon } from "@/components/icons";

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

// Avatar colours rotate through six warm tones from the site palette, so neighbouring cards differ.
const avatarTones = 6;

export function ReviewCard({ review, tone = "light", index = 0 }: { review: Review; tone?: "light" | "dark" | "color"; index?: number }) {
  const name = shortName(review.name);
  return (
    <article className={`review-card review-card-${tone}`}>
      {tone === "color" && <span className="review-quote" aria-hidden="true">”</span>}
      <Stars />
      {review.summary ? (
        <p className="review-summary">{review.summary}</p>
      ) : (
        <p className="review-summary review-summary-empty">דירוג של 5 כוכבים ללא טקסט</p>
      )}
      <div className="review-author">
        <span className={`review-avatar review-avatar-${index % avatarTones}`} aria-hidden="true">{name[0]}</span>
        <span>
          <strong dir="auto">{name}</strong>
          <small><GoogleIcon size={12} /> ביקורת ב-Google</small>
        </span>
      </div>
    </article>
  );
}
