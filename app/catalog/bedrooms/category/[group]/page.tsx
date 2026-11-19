import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryIcon } from "@/components/category-icon";
import { ProductCard } from "@/components/product-card";
import { productsForCategory } from "@/lib/products";
import { bedroomSubcategories } from "@/lib/site";
import { canonicalMetadata } from "@/lib/site-origin";

type Props = { params: Promise<{ group: string }> };

export function generateStaticParams() {
  return bedroomSubcategories.map(({ slug }) => ({ group: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { group } = await params;
  const subcategory = bedroomSubcategories.find((item) => item.slug === group);
  return { title: subcategory?.title ?? "תת־קטגוריה", ...canonicalMetadata(`/catalog/bedrooms/category/${group}`) };
}

export default async function BedroomSubcategoryPage({ params }: Props) {
  const { group } = await params;
  const subcategory = bedroomSubcategories.find((item) => item.slug === group);
  if (!subcategory) notFound();
  const products = productsForCategory("bedrooms").filter((product) => product.bedroomGroups?.includes(group));

  return <section className="category-page container">
    <nav className="breadcrumbs" aria-label="פירורי לחם">
      <Link href="/">בית</Link><span aria-hidden="true">/</span>
      <Link href="/catalog">קטלוג</Link><span aria-hidden="true">/</span>
      <Link href="/catalog/bedrooms">ארונות וחדרי שינה</Link><span aria-hidden="true">/</span>
      <span aria-current="page">{subcategory.title}</span>
    </nav>
    <div className="category-hero">
      <div><span className="eyebrow">ארונות וחדרי שינה</span><h1>{subcategory.title}</h1></div>
      <span className={`category-orb category-hero-orb tone-${subcategory.tone}`}>
        <CategoryIcon name={subcategory.icon} className="category-icon" />
      </span>
    </div>
    <div className="collection-section">
      <div className="collection-heading"><h2>המוצרים</h2><span>{products.length} מוצרים</span></div>
      <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </div>
  </section>;
}
