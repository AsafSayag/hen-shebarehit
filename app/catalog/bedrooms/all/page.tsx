import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowRightIcon } from "@/components/icons";
import { firstRow, ProductCard } from "@/components/product-card";
import { WhatsappBand } from "@/components/whatsapp-band";
import { productsForCategory } from "@/lib/products";
import { canonicalMetadata } from "@/lib/site-origin";

export const metadata: Metadata = {
  title: "כל הארונות וחדרי השינה",
  description: `כל ${productsForCategory("bedrooms").length} דגמי הארונות, חדרי השינה וחדרי הילדים במקום אחד, עם תמונות ומידות. אולם תצוגה במלאכה 43, נתניה.`,
  ...canonicalMetadata("/catalog/bedrooms/all"),
};

export default function AllBedroomsPage() {
  const products = productsForCategory("bedrooms");

  return (
    <>
      <section className="page-top section-cream">
        <div className="container">
          <div className="page-top-bar">
            <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { href: "/catalog", label: "קטלוג" }, { href: "/catalog/bedrooms", label: "ארונות" }, { label: "כל הדגמים" }]} />
            <Link href="/catalog/bedrooms" className="back-link"><ArrowRightIcon size={18} /> לכל סוגי הארונות</Link>
          </div>
          <div className="section-title page-title">
            <h1>ארונות וחדרי שינה</h1>
            <span className="page-count">{products.length} דגמים</span>
          </div>
          <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} eager={index < firstRow} />)}</div>
        </div>
      </section>
      <WhatsappBand />
    </>
  );
}
