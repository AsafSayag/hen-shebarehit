import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/icons";
import { business, openingHours, social } from "@/lib/site";

const columns = [
  {
    title: "ניווט",
    links: [
      { href: "/", label: "דף הבית" },
      { href: "/catalog", label: "קטלוג" },
      { href: "/about", label: "אודות" },
      { href: "/reviews", label: "ביקורות" },
      { href: "/contact", label: "צרו קשר" },
    ],
  },
  {
    title: "קטגוריות",
    links: [
      { href: "/catalog/living-rooms", label: "ספות וכורסאות" },
      { href: "/catalog/dining-sets", label: "פינות אוכל" },
      { href: "/catalog/sideboards", label: "מזנונים" },
      { href: "/catalog/bedrooms", label: "ארונות וחדרי שינה" },
      { href: "/catalog/beds", label: "מיטות ומזרנים" },
    ],
  },
  {
    title: "שירות לקוחות",
    links: [
      { href: "/contact#faq", label: "משלוחים" },
      { href: "/contact#faq", label: "שאלות נפוצות" },
      { href: business.whatsapp, label: "כתבו לנו בוואטסאפ", external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src="/brand/logo-light.png" alt="החן שברהיט" width={1189} height={231} className="footer-logo" />
          <p>רהיטים שמרגישים בית, באולם התצוגה שלנו בנתניה.</p>
          <div className="footer-social">
            {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="אינסטגרם"><InstagramIcon /></a>}
            {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="פייסבוק"><FacebookIcon /></a>}
            <a href={business.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="וואטסאפ"><WhatsappIcon /></a>
          </div>
        </div>
        {columns.map((column) => (
          <div className="footer-column" key={column.title}>
            <h2>{column.title}</h2>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  {"external" in link
                    ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                    : <Link href={link.href}>{link.label}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="footer-column">
          <h2>צרו קשר</h2>
          <ul>
            <li><a href={business.maps} target="_blank" rel="noopener noreferrer">{business.address}</a></li>
            <li><a href={`tel:${business.mobile}`} dir="ltr">{business.mobileDisplay}</a></li>
          </ul>
          <dl className="footer-hours">
            {openingHours.map((row) => (
              <div key={row.short}><dt>{row.short}</dt><dd>{row.hours}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {business.name}. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
}
