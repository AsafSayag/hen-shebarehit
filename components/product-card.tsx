import { ProductImage } from "@/components/product-image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { productTypeLabel } from "@/lib/site";

// Cards a grid loads right away, at high priority: the first row on desktop, the first two rows on a phone.
export const firstRow = 4;

// The supplier shoots dining chairs and tables as square photos; a square frame shows them whole without side bars.
const squarePhotoCategories = new Set(["dining-chairs", "dining-sets", "beds"]);

// The supplier shoots mattresses on a light grey backdrop (#f5f5f5), some square and some 4:3. A frame of the same grey
// lets the square ones meet it without side bars.
export const studioPhotoCategories = new Set(["mattresses"]);

export function ProductCard({ product, showType = false, eager = false }: { product: Product; showType?: boolean; eager?: boolean }) {
  const type = showType ? productTypeLabel(product) : "";
  return (
    <Link className="product-card" href={`/catalog/${product.category}/${product.id}`}>
      <span className={`product-card-image${squarePhotoCategories.has(product.category) ? " product-card-image-square" : ""}${studioPhotoCategories.has(product.category) ? " product-image-studio" : ""}`}>
        <ProductImage product={product} card eager={eager} />
      </span>
      <span className="product-card-copy">
        {type && <span className="product-card-type">{type}</span>}
        <span className="product-card-name">{product.name}</span>
        {product.sizes && <span className="product-card-sizes">{product.sizes.length > 4 ? `${product.sizes.length} מידות לבחירה` : <>מידות: <bdi dir="ltr">{product.sizes.join(" · ")}</bdi></>}</span>}      </span>
    </Link>
  );
}
