import Image from "next/image";
import type { Product } from "@/lib/products";

type Props = { product: Product; index?: number; card?: boolean };

export function ProductImage({ product, index = 0, card = false }: Props) {
  const src = product.images[index];
  const alt = card ? product.name : `${product.name} — תמונה ${index + 1}`;
  const variants = product.imageVariants?.[src];
  if (!variants) {
    return <Image src={src} alt={alt} width={card ? 600 : 900} height={card ? 600 : 900} unoptimized priority={!card && index === 0} />;
  }
  const original = variants[variants.length - 1];
  const focus = product.imageFocus?.[src];
  if (focus) {
    // Frame a single item in a multi-item source photo without altering the original.
    const [x, y, w, h] = focus;
    const clipId = `product-focus-${product.id}-${index}-${card ? "card" : "gallery"}`;
    const display = card ? variants.find((v) => v.width >= 960) ?? original : original;
    return (
      <svg className="product-photo-focus" role="img" aria-label={alt}
        viewBox={`${x * original.width} ${y * original.height} ${w * original.width} ${h * original.height}`}>
        <title>{alt}</title>
        <defs><clipPath id={clipId}><rect x={x * original.width} y={y * original.height} width={w * original.width} height={h * original.height} /></clipPath></defs>
        <image href={display.src} width={original.width} height={original.height} clipPath={`url(#${clipId})`} />
      </svg>
    );
  }
  return (
    // Static responsive files avoid image-server work and load only the needed resolution.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={original.src} srcSet={variants.map((v) => `${v.src} ${v.width}w`).join(", ")}
      sizes={card ? "(max-width: 700px) 48vw, (max-width: 1100px) 32vw, 300px" : index === 0 ? "(max-width: 700px) 100vw, 650px" : "(max-width: 700px) 48vw, 320px"}
      alt={alt} width={original.width} height={original.height}
      loading={!card && index === 0 ? "eager" : "lazy"} decoding="async"
      fetchPriority={!card && index === 0 ? "high" : "auto"} />
  );
}
