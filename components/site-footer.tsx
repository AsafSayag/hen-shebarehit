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
          <Link href="/contact">יצירת קשר</Link>
        </div>
        <div className="footer-contact">
          <span>{business.address}</span>
          <a href={`tel:${business.mobile}`} dir="ltr">{business.mobile}</a>
        </div>
      </div>
    </footer>
  );
}
