import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLeftIcon } from "@/components/icons";
import { WhatsappBand } from "@/components/whatsapp-band";
import { products } from "@/lib/products";
import { catalogCards } from "@/lib/site";
import { canonicalMetadata } from "@/lib/site-origin";

export const metadata: Metadata = {
  title: "קטלוג",
  description: `הקטלוג של החן שברהיט: ספות וכורסאות, פינות אוכל, כיסאות, מיטות, מזרנים, ארונות ומזנונים. ${products.length} דגמים, ואולם תצוגה בנתניה.`,
  ...canonicalMetadata("/catalog"),
};

export default function CatalogPage() {
  return (
    <>
      <section className="page-top section-cream">
        <div className="container">
          <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { label: "קטלוג" }]} />
          <div className="section-title page-title">
            <h1>מה אתם מחפשים לבית?</h1>
            <p>כל הרהיטים שלנו, מסודרים לפי קטגוריות. תרגישו חופשי להסתכל.</p>
          </div>
          <div className="catalog-cards">
            {catalogCards.map((card) => (
              <Link key={card.key} href={card.href} className="catalog-card">
                <span className="catalog-card-copy">
                  <h2>{card.title}</h2>
                  <span className="catalog-card-text">{card.text}</span>
                  <span className="catalog-card-link">{card.link} <ArrowLeftIcon size={18} /></span>
                </span>
                <span className="catalog-card-image">
                  <Image src={card.image} alt="" fill sizes="(max-width: 760px) 38vw, 300px" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <WhatsappBand />
    </>
  );
}
