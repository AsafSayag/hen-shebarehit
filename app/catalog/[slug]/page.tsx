import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { firstRow, ProductCard } from "@/components/product-card";
import { WhatsappBand } from "@/components/whatsapp-band";
import { productsForCategory, type Product } from "@/lib/products";
import { bedroomGroupImage, bedroomSubcategories, catalogCards, categories, categoryDescription, getCategory } from "@/lib/site";
import { canonicalMetadata } from "@/lib/site-origin";

type Props = { params: Promise<{ slug: string }> };

const intros: Record<string, string> = {
  "living-rooms": "ספות, סלונים וכורסאות. המקום שבו כולם נפגשים בסוף היום.",
};

// Categories whose products are split into sections, each with its own anchor.
const sectionsBySlug: Record<string, { key: string; title: string; match: (product: Product) => boolean }[]> = {
  "living-rooms": [
    { key: "sofas", title: "ספות וסלונים", match: (p) => p.collection === "sofas" },
    { key: "armchairs", title: "כורסאות", match: (p) => p.collection === "armchairs" },
  ],
  beds: [
    { key: "double-beds", title: "מיטות זוגיות", match: (p) => p.bedType === "double" },
    { key: "jewish-beds", title: "מיטות יהודיות", match: (p) => p.bedType === "jewish" },
  ],
};

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category?.title ?? "קטגוריה", description: categoryDescription(slug, productsForCategory(slug).length), ...canonicalMetadata(`/catalog/${slug}`) };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const products = productsForCategory(slug);
  const intro = intros[slug] ?? catalogCards.find((card) => card.key === slug)?.text;
  const sections = sectionsBySlug[slug];
  const isWardrobes = slug === "bedrooms" && products.length > 0;

  return (
    <>
      <section className="page-top section-cream">
        <div className="container">
          <div className="page-top-bar">
            <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { href: "/catalog", label: "קטלוג" }, { label: isWardrobes ? "ארונות" : category.title }]} />
            <Link href="/catalog" className="back-link"><ArrowRightIcon size={18} /> לכל הקטגוריות</Link>
          </div>

          {isWardrobes ? (
            <>
              <div className="section-title page-title">
                <h1>איזה ארון אתם מחפשים?</h1>
                <p>ארונות, חדרי שינה וחדרי ילדים בסגנונות ובגדלים שונים. בואו נמצא את מה שמתאים לחדר שלכם.</p>
                <Link href="/catalog/bedrooms/all" className="button button-outline">לכל הדגמים · {products.length} דגמים <ArrowLeftIcon size={18} /></Link>
              </div>
              <div className="group-cards">
                {bedroomSubcategories.map((group) => {
                  const count = products.filter((product) => product.bedroomGroups?.includes(group.slug)).length;
                  return (
                    <Link key={group.slug} href={`/catalog/bedrooms/category/${group.slug}`} className="group-card">
                      <span className="group-card-image"><Image src={bedroomGroupImage(group.slug)} alt="" fill sizes="(max-width: 760px) 46vw, 420px" /></span>
                      <span className="group-card-copy">
                        <span>
                          <h2>{group.title}</h2>
                          <span className="group-card-count">{count} דגמים</span>
                        </span>
                        <span className="round-button" aria-hidden="true"><ArrowLeftIcon size={18} /></span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="section-title page-title">
                <h1>{category.title}</h1>
                {intro && <p>{intro}</p>}
                {products.length > 0 && <span className="page-count">{products.length} דגמים</span>}
              </div>
              {products.length === 0 ? (
                <div className="empty-collection"><p>מוצרים בקטגוריה יתווספו בקרוב.</p></div>
              ) : sections ? (
                <>
                  <nav className="collection-nav" aria-label="סוגי מוצרים">
                    {sections.map((section) => (
                      <a key={section.key} href={`#${section.key}`}>{section.title} <span>{products.filter(section.match).length}</span></a>
                    ))}
                  </nav>
                  {sections.map((section, sectionIndex) => {
                    const items = products.filter(section.match);
                    return (
                      <section className="product-collection" id={section.key} key={section.key} aria-labelledby={`${section.key}-title`}>
                        <div className="collection-heading"><h2 id={`${section.key}-title`}>{section.title}</h2><span>{items.length} דגמים</span></div>
                        <div className="product-grid">{items.map((product, index) => <ProductCard key={product.id} product={product} eager={sectionIndex === 0 && index < firstRow} />)}</div>
                      </section>
                    );
                  })}
                </>
              ) : (
                <div className={`product-grid${products.length === 3 ? " product-grid-three" : ""}`}>
                  {products.map((product, index) => <ProductCard key={product.id} product={product} eager={index < firstRow} />)}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <WhatsappBand />
    </>
  );
}
