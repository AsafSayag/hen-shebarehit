import Image from "next/image";
import Link from "next/link";
import { CategoryTile } from "@/components/category-tile";
import { CtaBand } from "@/components/cta-band";
import { ProductCard } from "@/components/product-card";
import { homeCopy, services } from "@/lib/content";
import { products } from "@/lib/products";
import { business, categories, categoryHref, whatsappLink } from "@/lib/site";

// Categories that already have products, so the home page never links to an empty page.
const featuredSlugs = ["living-rooms", "dining-sets", "mattresses", "sideboards"];
const featured = featuredSlugs.map((slug) => categories.find((category) => category.slug === slug)!);

// A sofa, an armchair, a dining table and a sideboard with clean catalog photos.
const showcaseIds = [60003, 61002, 24480, 62002];
const showcase = showcaseIds
  .map((id) => products.find((product) => product.id === id))
  .filter((product) => product !== undefined);

export default function HomePage() {
  const { hero, categories: categoriesCopy, products: productsCopy, values, visit } = homeCopy;

  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.title}</h1>
          <p>{hero.lead}</p>
          <div className="hero-actions">
            <Link href="/catalog" className="button button-primary">{hero.primary} <span aria-hidden="true">←</span></Link>
            <Link href="/contact" className="text-link">{hero.secondary}</Link>
          </div>
        </div>
        <div className="hero-art">
          <Image
            src="/images/living-room-sketch.png"
            alt="איור של סלון בהיר עם ספה, כורסה ושולחן"
            width={1752}
            height={897}
            sizes="(max-width: 760px) 100vw, 58vw"
            className="hero-art-image"
            preload
          />
        </div>
      </section>

      <section className="featured-section section-pad" aria-labelledby="categories-title">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{categoriesCopy.eyebrow}</span>
              <h2 id="categories-title">{categoriesCopy.title}</h2>
            </div>
            <Link href="/catalog" className="text-link">{categoriesCopy.link} <span aria-hidden="true">←</span></Link>
          </div>
          <div className="category-grid featured-grid">
            {featured.map((category) => (
              <CategoryTile key={category.slug} title={category.title} href={categoryHref(category.slug)} icon={category.icon} tone={category.tone} />
            ))}
          </div>
        </div>
      </section>

      {showcase.length > 0 && (
        <section className="showcase-section section-pad" aria-labelledby="showcase-title">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">{productsCopy.eyebrow}</span>
                <h2 id="showcase-title">{productsCopy.title}</h2>
                <p className="section-lead">{productsCopy.text.replace("{count}", String(products.length))}</p>
              </div>
              <Link href="/catalog" className="text-link">{productsCopy.link} <span aria-hidden="true">←</span></Link>
            </div>
            <div className="product-grid showcase-grid">
              {showcase.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="values-section section-pad" aria-labelledby="values-title">
        <div className="container values-layout">
          <div className="values-intro">
            <span className="eyebrow">{values.eyebrow}</span>
            <h2 id="values-title">{values.title}</h2>
            <p>{values.text}</p>
          </div>
          <ul className="values-grid">
            {services.map((service) => (
              <li className="value-card" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        id="visit"
        eyebrow={visit.eyebrow}
        title={visit.title}
        text={`${business.address}. ${visit.text}`}
        primary={{ label: visit.primary, href: whatsappLink(visit.whatsappText), external: true }}
        secondary={{ label: visit.secondary, href: business.maps, external: true }}
      />
    </>
  );
}
