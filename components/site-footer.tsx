import Link from "next/link";
import { business } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">{business.name}</p>
          <p className="footer-muted">{business.tagline}</p>
        </div>
        <div className="footer-links">
          <Link href="/catalog">קטלוג</Link>
          <Link href="/about">אודות</Link>
          <Link href="/reviews">ביקורות</Link>
          <Link href="/contact">יצירת קשר</Link>
        </div>
        <div className="footer-contact">
          <span>{business.address}</span>
          <a href={`tel:${business.mobile}`} dir="ltr">{business.mobile}</a>
        </div>
      </div>
      <div className="container footer-map-block">
        <div className="footer-map-copy">
          <span className="eyebrow">אולם התצוגה בנתניה</span>
          <p>בואו לראות מקרוב</p>
          <address>{business.address}</address>
          <a href={business.maps} target="_blank" rel="noopener noreferrer">
            פתיחה ב-Google Maps <span aria-hidden="true">↗</span>
          </a>
        </div>
        <iframe
          className="footer-map"
          src={business.mapEmbed}
          title={`מפת Google של ${business.name}, ${business.address}`}
          width="600"
          height="300"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </footer>
  );
}
