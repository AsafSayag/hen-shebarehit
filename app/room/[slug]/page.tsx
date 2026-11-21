import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLeftIcon } from "@/components/icons";
import { MoreSlide, ProductSlide } from "@/components/product-slide";
import { ScrollRail } from "@/components/scroll-rail";
import { WhatsappBand } from "@/components/whatsapp-band";
import { getRoomPage, roomPages } from "@/lib/collections";
import { homeCopy } from "@/lib/content";
import { canonicalMetadata } from "@/lib/site-origin";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return roomPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getRoomPage(slug);
  return { title: page?.title ?? "חדר השינה", description: page?.lead, ...canonicalMetadata(`/room/${slug}`) };
}

// Opened from the markers on the bedroom photo on the home page: the same category, shown as large carousels.
export default async function RoomPage({ params }: Props) {
  const { slug } = await params;
  const page = getRoomPage(slug);
  if (!page) notFound();
  const groups = page.groups().filter((group) => group.items.length > 0);
  const total = groups.reduce((sum, group) => sum + (group.total ?? group.items.length), 0);
  const [x, y] = page.focus;

  return (
    <>
      <section className="room-hero" aria-labelledby="room-page-title">
        <Image src="/images/design/home/room-bedroom.webp" alt="חדר שינה עם מיטה מרופדת, ארון כהה וכורסת עץ ליד החלון" fill loading="eager" fetchPriority="high" sizes="100vw" className="room-hero-image" style={{ objectPosition: `${x}% ${y}%` }} />
        <div className="container room-hero-content">
          <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { href: "/#room-title", label: homeCopy.room.title.replace("?", "") }, { label: page.label }]} />
          <h1 id="room-page-title">{page.title}</h1>
          <p>{page.lead}</p>
          <span className="room-hero-count">{total} דגמים</span>
        </div>
      </section>

      <nav className="room-tabs" aria-label="עוד בחדר הזה">
        <div className="container room-tabs-inner">
          <span>עוד בחדר הזה</span>
          <ul>
            {roomPages.map((item) => (
              <li key={item.slug}>
                <Link href={`/room/${item.slug}`} aria-current={item.slug === page.slug ? "page" : undefined}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="section section-cream room-rails">
        <div className="container">
          {groups.length > 1 && (
            <nav className="collection-nav" aria-label="סוגים בעמוד">
              {groups.map((group) => (
                <a key={group.key} href={`#${group.key}`}>{group.title} <span>{group.total ?? group.items.length}</span></a>
              ))}
            </nav>
          )}
          {groups.map((group) => {
            const count = group.total ?? group.items.length;
            return (
              <section key={group.key} id={group.key} className="room-rail" aria-labelledby={`${group.key}-title`}>
                <div className="room-rail-head">
                  <h2 id={`${group.key}-title`}>{group.title}</h2>
                  <span>{count} דגמים</span>
                </div>
                <ScrollRail label={group.title} variant="large">
                  {group.items.map((product) => (
                    <div className="scroll-rail-item" key={product.id}><ProductSlide product={product} /></div>
                  ))}
                  {group.more && (
                    <div className="scroll-rail-item"><MoreSlide href={group.more.href} label={group.more.label} remaining={count - group.items.length} /></div>
                  )}
                </ScrollRail>
              </section>
            );
          })}
          <div className="section-actions">
            <Link href={page.catalogHref} className="button button-outline">לתצוגת רשת בקטלוג <ArrowLeftIcon size={18} /></Link>
          </div>
        </div>
      </div>
      <WhatsappBand />
    </>
  );
}
