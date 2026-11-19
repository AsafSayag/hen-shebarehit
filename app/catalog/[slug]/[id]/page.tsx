import type { Metadata } from "next";
import { BedVariantViewer } from "@/components/bed-variant-viewer";
import { ProductImage } from "@/components/product-image";
import { ProductGalleryViewer } from "@/components/product-gallery-viewer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { business, getCategory } from "@/lib/site";
import { canonicalMetadata } from "@/lib/site-origin";

type Props = { params: Promise<{ slug: string; id: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.category, id: String(product.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  const product = getProduct(slug, id);
  return { title: product?.name ?? "מוצר", ...canonicalMetadata(`/catalog/${slug}/${id}`) };
}

export default async function ProductPage({ params }: Props) {
  const { slug, id } = await params;
  const product = getProduct(slug, id);
  const category = getCategory(slug);
  if (!product || !category) notFound();

  const whatsapp = `${business.whatsapp}?text=${encodeURIComponent(`שלום, אשמח לפרטים על ${product.name}${product.sku ? ` (מק״ט ${product.sku})` : ""}`)}`;

  return (
    <section className="product-page container">
      <nav className="breadcrumbs" aria-label="פירורי לחם">
        <Link href="/">בית</Link><span aria-hidden="true">/</span>
        <Link href="/catalog">קטלוג</Link><span aria-hidden="true">/</span>
        <Link href={`/catalog/${slug}`}>{category.title}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <div className="product-layout">
        <div className="product-heading">
          <span className="eyebrow">{category.title}</span>
          <h1>{product.name}</h1>
          {product.sku && <p className="product-sku">מק״ט <bdi>{product.sku}</bdi></p>}
        </div>
        {product.sizes && (
          <div className="product-sizes">
            <h2>מידות לבחירה</h2>
            <div className="product-size-list">
              {product.sizes.map((size) => <span key={size} dir="ltr">{size}</span>)}
            </div>
            <p>המידות בס״מ. לבירור המידה המתאימה, צרו קשר.</p>
          </div>
        )}
        {product.bedVariants ? <BedVariantViewer product={product} whatsappBase={business.whatsapp} /> : <>
        {product.bedroomGroups ? <ProductGalleryViewer product={product} /> : <div className="product-gallery">
          {product.images.map((src, index) => {
            const focus = product.imageFocus?.[src];
            const original = product.imageVariants?.[src]?.at(-1);
            const displayAspect = original && (focus || src.startsWith("/products/edited/"))
              ? Math.min(2.6, Math.max(1, focus
                ? (focus[2] * original.width) / (focus[3] * original.height)
                : original.width / original.height))
              : undefined;
            return (
              <div
                id={`photo-${index}`}
                className={`product-image${index === 0 ? " product-image-main" : ""}${src.startsWith("/products/edited/") ? " product-image-edited" : ""}${focus ? " product-image-focused" : ""}`}
                style={displayAspect ? { aspectRatio: displayAspect } : undefined}
                key={`${src}-${index}`}
              >
                <ProductImage product={product} index={index} />
              </div>
            );
          })}
        </div>}
        <div className="product-info">
          {product.details.length > 0 && <div className="product-details">
            <h2>פרטי המוצר</h2>
            {product.details.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
          </div>}
          <a className="button button-primary product-contact" href={whatsapp} target="_blank" rel="noopener noreferrer">לפרטים בוואטסאפ</a>
        </div>
        </>}
      </div>
    </section>
  );
}
