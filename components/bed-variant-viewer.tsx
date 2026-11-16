"use client";

import { useRef, useState } from "react";
import { ProductImage } from "@/components/product-image";
import type { Product } from "@/lib/products";

type Props = { product: Product; whatsappBase: string };

export function BedVariantViewer({ product, whatsappBase }: Props) {
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedVariant = selectedVariantIndex === null ? null : product.bedVariants?.[selectedVariantIndex];
  const selectedImage = product.images[selectedImageIndex];
  const sharedPhoto = selectedVariant && product.bedVariants?.some((variant, index) =>
    index !== selectedVariantIndex && variant.image === selectedVariant.image);
  const message = `שלום, אשמח לפרטים על ${product.name}${selectedVariant ? `, גרסה: ${selectedVariant.label}` : ""}`;
  const whatsapp = `${whatsappBase}?text=${encodeURIComponent(message)}`;

  return <>
    <div className="product-gallery bed-gallery" aria-label={`תמונות ${product.name}`}>
      <div className="product-image product-image-main bed-main-image" ref={mainImageRef} key={selectedImage}>
        <ProductImage product={product} index={selectedImageIndex} featured />
      </div>
      <p className="bed-image-caption" aria-live="polite">
        {selectedVariant ? <>
          <strong>{selectedVariant.label}</strong>
          {sharedPhoto && <span>אין צילום נפרד לגרסה זו; מוצגת תמונת הדגם.</span>}
        </> : <span>בחרו גרסה כדי לצפות בתמונה שלה.</span>}
      </p>
      {product.images.map((src, index) => <button
        className={`product-image product-photo-thumb${selectedImageIndex === index ? " is-selected" : ""}`}
        type="button"
        key={`${src}-${index}`}
        aria-label={`הצגת תמונה ${index + 1} של ${product.name}`}
        aria-pressed={selectedImageIndex === index}
        onClick={() => { setSelectedVariantIndex(null); setSelectedImageIndex(index); }}
      >
        <ProductImage product={product} index={index} card />
      </button>)}
    </div>
    <div className="product-info">
      <div className="product-bed-variants">
        <h2>גרסאות הדגם</h2>
        <ul>
          {product.bedVariants?.map((variant, index) => <li key={`${index}-${variant.label}`}>
            <button
              type="button"
              aria-pressed={selectedVariantIndex === index}
              className={selectedVariantIndex === index ? "is-selected" : ""}
              onClick={() => {
                setSelectedVariantIndex(index);
                setSelectedImageIndex(product.images.indexOf(variant.image));
                if (window.matchMedia("(max-width: 700px)").matches) {
                  window.setTimeout(() => mainImageRef.current?.scrollIntoView({ block: "start" }), 80);
                }
              }}
            >
              <span>{variant.label}</span>
              <span aria-hidden="true">{selectedVariantIndex === index ? "✓" : "←"}</span>
            </button>
          </li>)}
        </ul>
        {sharedPhoto ? <p className="bed-variant-notice" role="status">
          לגרסה שבחרתם אין תמונה נפרדת באתר המקור, ולכן מוצגת תמונת הדגם. לבירור הגוון המדויק, צרו קשר.
        </p> : <p>לבירור גוון ומידה מדויקים, צרו קשר.</p>}
      </div>
      {product.details.length > 0 && <div className="product-details">
        <h2>פרטי המוצר</h2>
        {product.details.map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
      </div>}
      <a className="button button-primary product-contact" href={whatsapp} target="_blank" rel="noopener noreferrer">לפרטים בוואטסאפ</a>
    </div>
  </>;
}
