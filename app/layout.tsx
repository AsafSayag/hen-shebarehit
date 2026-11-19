import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/site";
import { getSiteOrigin } from "@/lib/site-origin";
import "./globals.css";

const siteOrigin = getSiteOrigin();

export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  title: {
    default: `${business.name} | ריהוט בוטיק לבית`,
    template: `%s | ${business.name}`,
  },
  description: "ריהוט בוטיק לבית בנתניה. סלונים, חדרי שינה, פינות אוכל ועוד.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const store = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: business.name,
    description: "חנות רהיטים ואולם תצוגה בנתניה",
    telephone: "+972526260068",
    address: {
      "@type": "PostalAddress",
      streetAddress: "המלאכה 43",
      addressLocality: "נתניה",
      addressCountry: "IL",
    },
    geo: { "@type": "GeoCoordinates", latitude: 32.2839252, longitude: 34.8605417 },
    hasMap: business.maps,
    sameAs: [business.maps],
    ...(siteOrigin ? { "@id": `${siteOrigin}/#business`, url: siteOrigin, image: `${siteOrigin}/brand/logo-primary.png` } : {}),
  };

  return (
    <html lang="he" dir="rtl">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(store).replace(/</g, "\\u003c") }} />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
