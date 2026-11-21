import Link from "next/link";
import { getSiteOrigin } from "@/lib/site-origin";

type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  // The same trail as structured data, so search results can show it instead of the bare address.
  // Only with a public address (SITE_URL), since the links must be absolute.
  const origin = getSiteOrigin();
  const structured = origin && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && index < items.length - 1 ? { item: new URL(item.href.split("#")[0] || "/", origin).toString() } : {}),
    })),
  };

  return (
    <nav className="breadcrumbs" aria-label="פירורי לחם">
      {structured && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />}
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href && index < items.length - 1
              ? <Link href={item.href}>{item.label}</Link>
              : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
