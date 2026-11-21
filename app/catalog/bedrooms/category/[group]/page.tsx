import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowRightIcon } from "@/components/icons";
import { firstRow, ProductCard } from "@/components/product-card";
import { WhatsappBand } from "@/components/whatsapp-band";
import { productsForCategory } from "@/lib/products";
import { bedroomSubcategories } from "@/lib/site";
import { canonicalMetadata } from "@/lib/site-origin";

type Props = { params: Promise<{ group: string }> };

export function generateStaticParams() {
  return bedroomSubcategories.map(({ slug }) => ({ group: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { group } = await params;
  const subcategory = bedroomSubcategories.find((item) => item.slug === group);
  const count = productsForCategory("bedrooms").filter((product) => product.bedroomGroups?.includes(group)).length;
  return {
    title: subcategory?.title ?? "תת־קטגוריה",
    description: subcategory ? `${subcategory.title} באולם התצוגה של החן שברהיט בנתניה: ${count} דגמים עם תמונות ומידות. לפרטים ולבירור זמינות, כתבו לנו בוואטסאפ.` : undefined,
    ...canonicalMetadata(`/catalog/bedrooms/category/${group}`),
  };
}

export default async function BedroomSubcategoryPage({ params }: Props) {
  const { group } = await params;
  const subcategory = bedroomSubcategories.find((item) => item.slug === group);
  if (!subcategory) notFound();
  const products = productsForCategory("bedrooms").filter((product) => product.bedroomGroups?.includes(group));

  return (
    <>
      <section className="page-top section-cream">
        <div className="container">
          <div className="page-top-bar">
            <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { href: "/catalog", label: "קטלוג" }, { href: "/catalog/bedrooms", label: "ארונות" }, { label: subcategory.title }]} />
            <Link href="/catalog/bedrooms" className="back-link"><ArrowRightIcon size={18} /> לכל סוגי הארונות</Link>
          </div>
          <div className="section-title page-title">
            <h1>{subcategory.title}</h1>
            <span className="page-count">{products.length} דגמים</span>
          </div>
          <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} eager={index < firstRow} />)}</div>
        </div>
      </section>
      <WhatsappBand />
    </>
  );
}
