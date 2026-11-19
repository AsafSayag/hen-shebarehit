import type { Metadata } from "next";
import { CategoryTile } from "@/components/category-tile";
import { categories, categoryHref } from "@/lib/site";
import { canonicalMetadata } from "@/lib/site-origin";

export const metadata: Metadata = { title: "קטלוג", ...canonicalMetadata("/catalog") };

export default function CatalogPage() {
  return (
    <section className="catalog-page container">
      <div className="page-intro">
        <span className="eyebrow">החן שברהיט</span>
        <h1>הקטלוג</h1>
        <p>בחרו קטגוריה כדי להמשיך.</p>
      </div>
      <div className="category-grid catalog-grid">
        {categories.map((category) => (
          <CategoryTile key={category.slug} title={category.title} href={categoryHref(category.slug)} icon={category.icon} tone={category.tone} />
        ))}
      </div>
    </section>
  );
}
