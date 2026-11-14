import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { business } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${business.name} | ריהוט בוטיק לבית`,
    template: `%s | ${business.name}`,
  },
  description: "ריהוט בוטיק לבית בנתניה. סלונים, חדרי שינה, פינות אוכל ועוד.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
