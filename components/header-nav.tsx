"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon, PhoneIcon, WhatsappIcon } from "@/components/icons";

type Item = { href: string; label: string };

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  return (
    <nav className="desktop-nav" aria-label="ניווט ראשי">
      {items.map((item) => (
        <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileMenu({ items, whatsapp, phone, phoneDisplay }: { items: Item[]; whatsapp: string; phone: string; phoneDisplay: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Escape closes the menu; following a link closes it too (see onClick below).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="mobile-menu">
      <button type="button" className="icon-button" aria-label="תפריט" aria-expanded={open} aria-controls="mobile-menu-panel" onClick={() => setOpen(true)}>
        <MenuIcon size={24} />
      </button>
      <div className={`mobile-menu-backdrop${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div id="mobile-menu-panel" className={`mobile-menu-panel${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="תפריט" hidden={!open}>
        <button type="button" className="icon-button mobile-menu-close" aria-label="סגירת התפריט" onClick={() => setOpen(false)}>
          <CloseIcon size={24} />
        </button>
        <nav aria-label="ניווט ראשי בנייד">
          {items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
        <div className="mobile-menu-actions">
          <a href={whatsapp} className="button button-dark" target="_blank" rel="noopener noreferrer"><WhatsappIcon size={18} /> כתבו לנו בוואטסאפ</a>
          <a href={`tel:${phone}`} className="button button-outline"><PhoneIcon size={18} /> <span dir="ltr">{phoneDisplay}</span></a>
        </div>
      </div>
    </div>
  );
}
