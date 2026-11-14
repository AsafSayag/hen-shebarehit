import { ProductImage } from "@/components/product-image";
import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="product-card" href={`/catalog/${product.category}/${product.id}`}>
      <span className="product-card-image">
        <ProductImage product={product} card />
      </span>
      <span className="product-card-copy">
        <span className="product-card-name">{product.name}</span>
        {product.sizes && <span className="product-card-sizes">{product.sizes.length > 4 ? `${product.sizes.length} מידות לבחירה` : <>מידות: <bdi dir="ltr">{product.sizes.join(" · ")}</bdi></>}</span>}
        {product.sku && <span className="product-card-sku">מק״ט <bdi>{product.sku}</bdi></span>}
        <span className="product-card-link">לפרטי המוצר <span aria-hidden="true">←</span></span>
      </span>
    </Link>
  );
}
