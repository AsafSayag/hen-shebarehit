import { DeliveryIcon, HeartIcon, ShieldIcon } from "@/components/icons";
import { productTrust } from "@/lib/content";

const icons = { heart: HeartIcon, delivery: DeliveryIcon, shield: ShieldIcon };

// "Why buy from us": three short reasons shown on every product page, under the contact button.
export function ProductTrust() {
  return (
    <section className="product-trust" aria-labelledby="product-trust-title">
      <h2 id="product-trust-title">{productTrust.title}</h2>
      <ul>
        {productTrust.points.map((point) => {
          const Icon = icons[point.icon];
          return (
            <li key={point.title}>
              <span className="product-trust-icon" aria-hidden="true"><Icon size={22} /></span>
              <span>
                <strong>{point.title}</strong>
                <span>{point.text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
