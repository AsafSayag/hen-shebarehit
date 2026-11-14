import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/category-icon";
import { holyClosets } from "@/lib/site";

export const metadata: Metadata = { title: holyClosets.title };

export default function HolyClosetsPage() {
  return (
    <section className="category-page container">
      <nav className="breadcrumbs" aria-label="פירורי לחם">
        <Link href="/">בית</Link><span aria-hidden="true">/</span>
        <Link href="/catalog">קטלוג</Link><span aria-hidden="true">/</span>
        <Link href="/catalog/bedrooms">ארונות וחדרי שינה</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{holyClosets.title}</span>
      </nav>
      <div className="category-hero">
        <div><span className="eyebrow">ארונות וחדרי שינה</span><h1>{holyClosets.title}</h1></div>
        <span className={`category-orb category-hero-orb tone-${holyClosets.tone}`}>
          <CategoryIcon name={holyClosets.icon} className="category-icon" />
        </span>
      </div>
      <div className="empty-collection">
        <div className="empty-collection-mark" aria-hidden="true" />
        <p>מוצרים בקטגוריה יתווספו בקרוב.</p>
      </div>
    </section>
  );
}
