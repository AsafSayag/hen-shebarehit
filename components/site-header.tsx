import Link from "next/link";
import { HeaderNav, MobileMenu } from "@/components/header-nav";
import { SearchIcon, WhatsappIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { business } from "@/lib/site";

export const navigation = [
  { href: "/", label: "דף הבית" },
  { href: "/catalog", label: "קטלוג" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "צרו קשר" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <div className="header-start">
          <MobileMenu items={navigation} whatsapp={business.whatsapp} phone={business.mobile} phoneDisplay={business.mobileDisplay} phoneName={business.owner} />
          <HeaderNav items={navigation} />
        </div>
        <Link href="/" className="brand-link" aria-label="החן שברהיט, לדף הבית">
          <Logo className="brand-logo" />
        </Link>
        <div className="header-end">
          <Link href="/search" className="icon-button" aria-label="חיפוש במוצרים">
            <SearchIcon size={22} />
          </Link>
          <a href={business.whatsapp} className="button button-outline header-whatsapp" target="_blank" rel="noopener noreferrer">
            <WhatsappIcon size={18} /> כתבו לנו בוואטסאפ
          </a>
        </div>
      </div>
    </header>
  );
}
