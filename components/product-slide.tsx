import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { studioPhotoCategories } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/lib/products";

// A large product card for the big carousels on the room pages.
export function ProductSlide({ product }: { product: Product }) {
  return (
    <Link className="product-slide" href={`/catalog/${product.category}/${product.id}`}>
      <span className={`product-slide-image${studioPhotoCategories.has(product.category) ? " product-image-studio" : ""}`}>
        <ProductImage product={product} card sizes="(max-width: 640px) 86vw, (max-width: 1100px) 46vw, 560px" />
      </span>
      <span className="product-slide-copy">
        <span className="product-slide-name">{product.name}</span>
        {product.sizes && <span className="product-slide-meta">{product.sizes.length > 4 ? `${product.sizes.length} מידות לבחירה` : <>מידות: <bdi dir="ltr">{product.sizes.join(" · ")}</bdi></>}</span>}
        <span className="product-slide-link">לפרטים <ArrowLeftIcon size={16} /></span>
      </span>
    </Link>
  );
}

// The last slide of a shortened carousel, leading to the full list.
export function MoreSlide({ href, label, remaining }: { href: string; label: string; remaining: number }) {
  return (
    <Link className="product-slide product-slide-more" href={href}>
      <span className="product-slide-more-count">עוד {remaining} דגמים</span>
      <span className="product-slide-more-label">{label} <ArrowLeftIcon size={18} /></span>
    </Link>
  );
}
