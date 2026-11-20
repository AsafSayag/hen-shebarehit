import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { business, social } from "@/lib/site";
import { getSiteOrigin } from "@/lib/site-origin";
import "./globals.css";

const siteOrigin = getSiteOrigin();

// The designer's typeface; Hebrew and Latin glyphs are self-hosted by next/font.
const assistant = Assistant({ subsets: ["hebrew", "latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-assistant", display: "swap" });

export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  title: {
    default: `${business.name} | ריהוט בוטיק לבית`,
    template: `%s | ${business.name}`,
  },
  description: "ריהוט בוטיק לבית בנתניה: ספות וכורסאות, פינות אוכל, מיטות, מזרנים, ארונות ומזנונים. אולם תצוגה במלאכה 43 בנתניה.",
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
    sameAs: [business.maps, social.facebook],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "20:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "13:00" },
    ],
    ...(siteOrigin ? { "@id": `${siteOrigin}/#business`, url: siteOrigin, image: `${siteOrigin}/brand/logo-primary.png` } : {}),
  };

  return (
    <html lang="he" dir="rtl" className={assistant.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(store).replace(/</g, "\\u003c") }} />
        <a href="#main-content" className="skip-link">דילוג לתוכן הראשי</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
