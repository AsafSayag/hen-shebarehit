import type { Metadata } from "next";
import { BedVariantViewer } from "@/components/bed-variant-viewer";
import { ProductImage } from "@/components/product-image";
import { ProductGalleryViewer } from "@/components/product-gallery-viewer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WhatsappIcon } from "@/components/icons";
import { WhatsappBand } from "@/components/whatsapp-band";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { business, getCategory } from "@/lib/site";
import { canonicalMetadata } from "@/lib/site-origin";

type Props = { params: Promise<{ slug: string; id: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.category, id: String(product.id) }));
}

// The product's first photo, at a size that suits link previews.
function shareImage(product: NonNullable<ReturnType<typeof getProduct>>) {
  const src = product.images[0];
  const variants = product.imageVariants?.[src];
  const pick = variants ? variants.find((variant) => variant.width >= 960) ?? variants.at(-1) : undefined;
  return pick ? { url: pick.src, width: pick.width, height: pick.height, alt: product.name } : { url: src, alt: product.name };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  const product = getProduct(slug, id);
  const category = getCategory(slug);
  if (!product || !category) return { title: "מוצר" };
  const description = `${product.name}. ${category.title} באולם התצוגה של ${business.name} בנתניה. לפרטים ולבירור זמינות, כתבו לנו בוואטסאפ.`;
  return {
    title: product.name,
    description,
    ...canonicalMetadata(`/catalog/${slug}/${id}`),
    openGraph: {
      type: "website",
      locale: "he_IL",
      siteName: business.name,
      title: `${product.name} | ${business.name}`,
      description,
      images: [shareImage(product)],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug, id } = await params;
  const product = getProduct(slug, id);
  const category = getCategory(slug);
  if (!product || !category) notFound();

  const whatsapp = `${business.whatsapp}?text=${encodeURIComponent(`שלום, אשמח לפרטים על ${product.name}${product.sku ? ` (מק״ט ${product.sku})` : ""}`)}`;

  return (
    <>
    <section className="product-page container">
      <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { href: "/catalog", label: "קטלוג" }, { href: `/catalog/${slug}`, label: category.title }, { label: product.name }]} />
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
          <a className="button button-dark product-contact" href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsappIcon size={18} /> לפרטים בוואטסאפ</a>
        </div>
        </>}
      </div>
    </section>
    <WhatsappBand />
    </>
  );
}
