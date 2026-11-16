import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryIcon } from "@/components/category-icon";
import { CategoryTile } from "@/components/category-tile";
import { ProductCard } from "@/components/product-card";
import { productsForCategory } from "@/lib/products";
import { bedroomSubcategories, categories, getCategory } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category?.title ?? "קטגוריה" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const products = productsForCategory(slug);

  return (
    <section className="category-page container">
      <nav className="breadcrumbs" aria-label="פירורי לחם">
        <Link href="/">בית</Link><span aria-hidden="true">/</span><Link href="/catalog">קטלוג</Link><span aria-hidden="true">/</span><span aria-current="page">{category.title}</span>
      </nav>
      <div className="category-hero">
        <div>
          <span className="eyebrow">קטלוג</span>
          <h1>{category.title}</h1>
        </div>
        <span className={`category-orb category-hero-orb tone-${category.tone}`}>
          <CategoryIcon name={category.icon} className="category-icon" />
        </span>
      </div>

      {slug === "bedrooms" && products.length > 0 && (
        <div className="subcategory-section">
          <h2>בחרו תת־קטגוריה</h2>
          <div className="category-grid subcategory-grid">
            {bedroomSubcategories.map((group) => <CategoryTile
              key={group.slug}
              title={group.title}
              href={`/catalog/bedrooms/category/${group.slug}`}
              icon={group.icon}
              tone={group.tone}
              count={products.filter((product) => product.bedroomGroups?.includes(group.slug)).length}
            />)}
          </div>
        </div>
      )}

      {slug === "bedrooms" && products.length > 0 ? null : products.length > 0 ? (
        <div className="collection-section">
          {slug === "living-rooms" || slug === "beds" ? <>
            <nav className="collection-nav" aria-label="סוגי מוצרים">
              {slug === "beds" ? <>
                <a href="#double-beds">מיטות זוגיות <span>{products.filter((p) => p.bedType === "double").length}</span></a>
                <a href="#jewish-beds">מיטות יהודיות <span>{products.filter((p) => p.bedType === "jewish").length}</span></a>
              </> : <>
                <a href="#sofas">ספות וסלונים <span>{products.filter((p) => p.collection === "sofas").length}</span></a>
                <a href="#armchairs">כורסאות <span>{products.filter((p) => p.collection === "armchairs").length}</span></a>
              </>}
            </nav>
            {(slug === "beds"
              ? [{ key: "double-beds", title: "מיטות זוגיות" }, { key: "jewish-beds", title: "מיטות יהודיות" }]
              : [{ key: "sofas", title: "ספות וסלונים" }, { key: "armchairs", title: "כורסאות" }]
            ).map((group) => {
              const items = products.filter((p) => slug === "beds"
                ? p.bedType === (group.key === "double-beds" ? "double" : "jewish")
                : p.collection === group.key);
              return <section className="product-collection" id={group.key} key={group.key} aria-labelledby={`${group.key}-title`}>
                <div className="collection-heading"><h2 id={`${group.key}-title`}>{group.title}</h2><span>{items.length} מוצרים</span></div>
                <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
              </section>;
            })}
          </> : <>
          <div className="collection-heading">
            <h2>{slug === "dining-sets" ? "שולחנות אוכל" : "המוצרים"}</h2>
            <span>{products.length} מוצרים</span>
          </div>
          <div className={`product-grid${products.length === 3 ? " product-grid-three" : ""}`}>
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          </>}
        </div>
      ) : (
        <div className="empty-collection">
          <div className="empty-collection-mark" aria-hidden="true" />
          <p>מוצרים בקטגוריה יתווספו בקרוב.</p>
        </div>
      )}
    </section>
  );
}
