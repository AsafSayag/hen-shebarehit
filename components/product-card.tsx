import { ProductImage } from "@/components/product-image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { productTypeLabel } from "@/lib/site";

// The supplier shoots dining chairs and tables as square photos; a square frame shows them whole without side bars.
const squarePhotoCategories = new Set(["dining-chairs", "dining-sets", "beds"]);

export function ProductCard({ product, showType = false }: { product: Product; showType?: boolean }) {
  const type = showType ? productTypeLabel(product) : "";
  return (
    <Link className="product-card" href={`/catalog/${product.category}/${product.id}`}>
      <span className={`product-card-image${squarePhotoCategories.has(product.category) ? " product-card-image-square" : ""}`}>
        <ProductImage product={product} card />
      </span>
      <span className="product-card-copy">
        {type && <span className="product-card-type">{type}</span>}
        <span className="product-card-name">{product.name}</span>
        {product.sizes && <span className="product-card-sizes">{product.sizes.length > 4 ? `${product.sizes.length} מידות לבחירה` : <>מידות: <bdi dir="ltr">{product.sizes.join(" · ")}</bdi></>}</span>}
        {product.sku && <span className="product-card-sku">מק״ט <bdi>{product.sku}</bdi></span>}
      </span>
    </Link>
  );
}
