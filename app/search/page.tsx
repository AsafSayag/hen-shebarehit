import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { WhatsappBand } from "@/components/whatsapp-band";
import { products } from "@/lib/products";
import { bedroomSubcategories, getCategory, productTypeLabel } from "@/lib/site";

export const metadata: Metadata = { title: "חיפוש", robots: { index: false, follow: true } };

type Props = { searchParams: Promise<{ q?: string | string[] }> };

const MAX_RESULTS = 120;

// Lowercase, drop punctuation such as gershayim and dashes, and collapse spaces, so "קומפלט–טוליפ" matches "קומפלט טוליפ".
function normalize(text: string) {
  return text.toLocaleLowerCase("he").replace(/[֑-ׇ]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function searchableText(product: (typeof products)[number]) {
  const groups = (product.bedroomGroups ?? []).map((slug) => bedroomSubcategories.find((group) => group.slug === slug)?.title ?? "");
  return normalize([product.name, product.sku ?? "", productTypeLabel(product), getCategory(product.category)?.title ?? "", ...groups].join(" "));
}

export default async function SearchPage({ searchParams }: Props) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 80);
  const terms = normalize(query).split(" ").filter(Boolean);
  // Products that contain every word come first; if none do, fall back to products that match some of the words.
  const scored = terms.length === 0 ? [] : products
    .map((product) => {
      const text = searchableText(product);
      return { product, hits: terms.filter((term) => text.includes(term)).length };
    })
    .filter(({ hits }) => hits > 0);
  const exact = scored.filter(({ hits }) => hits === terms.length);
  const results = (exact.length > 0 ? exact : scored.sort((a, b) => b.hits - a.hits)).map(({ product }) => product);
  const partial = exact.length === 0 && results.length > 0;

  return (
    <>
      <section className="page-top section-cream">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "חיפוש" }]} />
          <div className="section-title page-title">
            <h1>מה תרצו למצוא?</h1>
            <form className="search-form" action="/search" role="search">
              <label htmlFor="search-input" className="visually-hidden">חיפוש במוצרים</label>
              <input id="search-input" name="q" type="search" defaultValue={query} placeholder="למשל: ספה, מזנון, מיטה זוגית" autoFocus={!query} />
              <button type="submit" className="button button-dark"><SearchIcon size={20} /> חיפוש</button>
            </form>
            {terms.length > 0 && (
              <p className="page-count" role="status">
                {results.length === 0
                  ? `לא מצאנו מוצרים עבור ״${query}״. נסו מילה אחרת, או כתבו לנו בוואטסאפ.`
                  : `${results.length === 1 ? "מוצר אחד" : `${results.length} מוצרים`} ${partial ? "שמתאימים לחלק מהמילים ב" : "עבור "}״${query}״`}
              </p>
            )}
          </div>
          {results.length > 0 && (
            <>
              <div className="product-grid">{results.slice(0, MAX_RESULTS).map((product) => <ProductCard key={product.id} product={product} showType />)}</div>
              {results.length > MAX_RESULTS && <p className="search-more">מוצגים {MAX_RESULTS} הראשונים. כדאי לחדד את החיפוש.</p>}
            </>
          )}
        </div>
      </section>
      <WhatsappBand />
    </>
  );
}
