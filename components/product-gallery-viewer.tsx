"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/lib/products";

export function ProductGalleryViewer({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0);
  const src = product.images[selected];
  const original = product.imageVariants?.[src]?.at(-1);
  const aspect = original ? Math.min(2.2, Math.max(0.85, original.width / original.height)) : 1;

  return <div className="product-gallery catalog-gallery" aria-label={`תמונות ${product.name}`}>
    <div className="product-image catalog-gallery-main" style={{ aspectRatio: aspect }} key={src}>
      <ProductImage product={product} index={selected} featured />
    </div>
    {product.images.length > 1 && <div className="catalog-gallery-controls">
      <button type="button" aria-label="התמונה הקודמת" disabled={selected === 0} onClick={() => setSelected(selected - 1)}>→</button>
      <span dir="ltr">{selected + 1} / {product.images.length}</span>
      <button type="button" aria-label="התמונה הבאה" disabled={selected === product.images.length - 1} onClick={() => setSelected(selected + 1)}>←</button>
    </div>}
    {product.images.length > 1 && <div className="catalog-gallery-thumbs" aria-label="בחירת תמונה">
      {product.images.map((image, index) => <button
        type="button"
        className={`product-image product-photo-thumb${selected === index ? " is-selected" : ""}`}
        key={`${image}-${index}`}
        aria-label={`הצגת תמונה ${index + 1} של ${product.name}`}
        aria-pressed={selected === index}
        onClick={() => setSelected(index)}
      >
        <ProductImage product={product} index={index} card />
      </button>)}
    </div>}
  </div>;
}
