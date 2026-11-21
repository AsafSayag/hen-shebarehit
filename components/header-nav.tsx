"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

export function MobileMenu({ items, whatsapp, phone, phoneDisplay, phoneName }: { items: Item[]; whatsapp: string; phone: string; phoneDisplay: string; phoneName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // While open: Escape closes, Tab cycles inside the panel, and focus starts on the close button.
  // On close, focus returns to the menu button. Following a link closes the menu too (see onClick below).
  useEffect(() => {
    if (!open) return;
    const opener = toggle.current;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || !panel.current) return;
      const focusable = [...panel.current.querySelectorAll<HTMLElement>("a[href], button")];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; opener?.focus(); };
  }, [open]);

  return (
    <div className="mobile-menu">
      <button ref={toggle} type="button" className="icon-button" aria-label="תפריט" aria-expanded={open} aria-controls="mobile-menu-panel" onClick={() => setOpen(true)}>
        <MenuIcon size={24} />
      </button>
      <div className={`mobile-menu-backdrop${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div ref={panel} id="mobile-menu-panel" className={`mobile-menu-panel${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="תפריט" hidden={!open}>
        <button ref={closeButton} type="button" className="icon-button mobile-menu-close" aria-label="סגירת התפריט" onClick={() => setOpen(false)}>
          <CloseIcon size={24} />
        </button>
        <nav aria-label="ניווט ראשי בנייד">
          {items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
        <div className="mobile-menu-actions">
          <a href={whatsapp} className="button button-dark" target="_blank" rel="noopener noreferrer"><WhatsappIcon size={18} /> כתבו לנו בוואטסאפ</a>
          <a href={`tel:${phone}`} className="button button-outline"><PhoneIcon size={18} /> {phoneName} <bdi dir="ltr">{phoneDisplay}</bdi></a>
        </div>
      </div>
    </div>
  );
}
