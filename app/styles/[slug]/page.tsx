import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLeftIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { WhatsappBand } from "@/components/whatsapp-band";
import { getStyleCollection, pick, styleCollections } from "@/lib/collections";
import { homeCopy } from "@/lib/content";
import { canonicalMetadata } from "@/lib/site-origin";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return styleCollections.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const style = getStyleCollection(slug);
  return { title: style ? `סגנון ${style.title}` : "סגנונות", description: style?.lead, ...canonicalMetadata(`/styles/${slug}`) };
}

// A style collection from the home page: products from every category that share the style's look.
export default async function StylePage({ params }: Props) {
  const { slug } = await params;
  const style = getStyleCollection(slug);
  if (!style) notFound();
  const groups = style.groups.map((group) => ({ ...group, items: pick(group.ids) })).filter((group) => group.items.length > 0);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const others = styleCollections.filter((item) => item.slug !== style.slug);

  return (
    <>
      <section className="room-hero style-hero" aria-labelledby="style-title">
        <Image src={style.image} alt={style.imageAlt} fill loading="eager" fetchPriority="high" sizes="100vw" className="room-hero-image" />
        <div className="container room-hero-content">
          <Breadcrumbs items={[{ href: "/", label: "דף הבית" }, { href: "/#styles-title", label: homeCopy.styles.title.replace("?", "") }, { label: style.title }]} />
          <span className="style-hero-eyebrow">סגנון</span>
          <h1 id="style-title">{style.title}</h1>
          <p>{style.lead}</p>
          <span className="room-hero-count">{total} רהיטים שנבחרו לסגנון</span>
        </div>
      </section>

      <div className={`section section-cream style-body style-body-${style.key}`}>
        <div className="container">
          <ul className="style-traits" aria-label={`מה מאפיין את הסגנון ה${style.title}`}>
            {style.traits.map((trait) => (
              <li key={trait.title}>
                <strong>{trait.title}</strong>
                <span>{trait.text}</span>
              </li>
            ))}
          </ul>

          <nav className="collection-nav" aria-label="סוגי רהיטים בסגנון">
            {groups.map((group) => (
              <a key={group.key} href={`#${group.key}`}>{group.title} <span>{group.items.length}</span></a>
            ))}
          </nav>

          {groups.map((group) => (
            <section className="product-collection" id={group.key} key={group.key} aria-labelledby={`${group.key}-title`}>
              <div className="collection-heading"><h2 id={`${group.key}-title`}>{group.title}</h2><span>{group.items.length} דגמים</span></div>
              <div className="product-grid">{group.items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            </section>
          ))}

          <section className="style-others" aria-labelledby="style-others-title">
            <h2 id="style-others-title">עוד סגנונות</h2>
            <div className="style-others-grid">
              {others.map((item) => (
                <Link key={item.slug} href={`/styles/${item.slug}`} className="style-other">
                  <Image src={item.image} alt="" fill sizes="(max-width: 760px) 92vw, 640px" />
                  <span className="style-other-copy">
                    <strong>{item.title}</strong>
                    <span>{item.card}</span>
                    <span className="style-card-link">לרהיטים בסגנון {item.title} <ArrowLeftIcon size={16} /></span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
      <WhatsappBand />
    </>
  );
}
