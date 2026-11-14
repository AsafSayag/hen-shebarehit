import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/", label: "בית" },
  { href: "/catalog", label: "קטלוג" },
  { href: "/about", label: "אודות" },
  { href: "/contact", label: "יצירת קשר" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link href="/" className="brand-link" aria-label="החן שברהיט — לדף הבית">
          <Image src="/brand/logo-compact.png" alt="החן שברהיט" width={900} height={260} className="brand-image" priority />
        </Link>
        <nav className="desktop-nav" aria-label="ניווט ראשי">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={item.href === "/contact" ? "nav-contact" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="mobile-menu">
          <summary>תפריט <span aria-hidden="true">☰</span></summary>
          <nav aria-label="ניווט ראשי בנייד">
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
