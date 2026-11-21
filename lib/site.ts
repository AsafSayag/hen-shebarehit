export const business = {
  name: "החן שברהיט",
  tagline: "איכות ושירות, זה אנחנו",
  // The owner answers the mobile number; his name is shown next to it wherever it appears.
  owner: "שמואל",
  address: "המלאכה 43, נתניה",
  landline: "09-8615297",
  mobile: "052-6260068",
  mobileDisplay: "052-626-0068",
  whatsapp: "https://wa.me/972526260068",
  maps: "https://www.google.com/maps/place/%D7%94%D7%97%D7%9F+%D7%A9%D7%91%D7%A8%D7%94%D7%99%D7%98/data=!4m2!3m1!1s0x0:0xcf3890f3acd6183f",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3373.0391562387294!2d34.860541700000006!3d32.2839252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d412eb09c467f%3A0xcf3890f3acd6183f!2z15TXl9efINep15HXqNeU15nXmA!5e0!3m2!1siw!2sil!4v1794905525060!5m2!1siw!2sil",
  waze: "https://waze.com/ul?q=%D7%94%D7%9E%D7%9C%D7%90%D7%9B%D7%94%2043%20%D7%A0%D7%AA%D7%A0%D7%99%D7%94&navigate=yes",
  appleMaps: "https://maps.apple.com/?q=%D7%94%D7%97%D7%9F%20%D7%A9%D7%91%D7%A8%D7%94%D7%99%D7%98&ll=32.2839252,34.8605417",
} as const;

// Opening hours, confirmed by the business on 20 November 2026.
export const openingHours = [
  { days: "ראשון–חמישי", short: "א׳–ה׳", hours: "9:00-20:00" },
  { days: "שישי", short: "ו׳", hours: "9:00-13:00" },
  { days: "שבת", short: "שבת", hours: "סגור" },
] as const;

export const openingHoursLine = "א׳–ה׳ 9:00-20:00 · ו׳ 9:00-13:00";

// The business's only social profile; the site links to Facebook and no other network.
export const social = {
  facebook: "https://www.facebook.com/profile.php?id=61588336546147",
} as const;

// Pages linked from the footer's legal row.
export const legalPages = [
  { href: "/terms", label: "תקנון ותנאי שימוש" },
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/returns", label: "ביטולים, החזרות והחלפות" },
  { href: "/accessibility", label: "הצהרת נגישות" },
] as const;

export type CatalogCard = { key: string; title: string; text: string; href: string; image: string; link: string };

// The eight entry points of the designer's catalog. Sofas and armchairs share one page with a section for each.
export const catalogCards: CatalogCard[] = [
  { key: "sofas", title: "ספות", text: "המקום שבו כולם נפגשים בסוף היום.", href: "/catalog/living-rooms#sofas", image: "/images/design/categories/sofas.webp", link: "לכל הספות" },
  { key: "armchairs", title: "כורסאות", text: "פינה אישית לקפה, לספר ולמנוחה.", href: "/catalog/living-rooms#armchairs", image: "/images/design/categories/armchairs.webp", link: "לכל הכורסאות" },
  { key: "sideboards", title: "מזנונים", text: "מקום לכל הדברים שרוצים שיהיו קרובים, אבל מסודרים.", href: "/catalog/sideboards", image: "/images/design/categories/sideboards.webp", link: "לכל המזנונים" },
  { key: "dining-sets", title: "פינות אוכל", text: "שולחן אחד לארוחות הגדולות והקטנות.", href: "/catalog/dining-sets", image: "/images/design/categories/dining-sets.webp", link: "לכל פינות האוכל" },
  { key: "dining-chairs", title: "כיסאות אוכל", text: "נוחות לשיחות שנמשכות אחרי הארוחה.", href: "/catalog/dining-chairs", image: "/images/design/categories/dining-chairs.webp", link: "לכל כיסאות האוכל" },
  { key: "beds", title: "מיטות", text: "לסיים בהן יום ארוך ולהתחיל אחד חדש.", href: "/catalog/beds", image: "/images/design/categories/beds.webp", link: "לכל המיטות" },
  { key: "mattresses", title: "מזרנים", text: "לילות שקטים ונוחים, כל לילה מחדש.", href: "/catalog/mattresses", image: "/images/design/categories/mattresses.webp", link: "לכל המזרנים" },
  { key: "wardrobes", title: "ארונות", text: "לבגדים, למצעים ולכל מה שצריך למצוא לו מקום.", href: "/catalog/bedrooms", image: "/images/design/categories/wardrobes.webp", link: "לבחירת סוג ארון · 6 סוגים" },
];

export function whatsappLink(message: string) {
  return `${business.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type CategoryIconName =
  | "bed"
  | "wardrobe"
  | "mattress"
  | "chair"
  | "dining"
  | "sofa"
  | "sideboard"
  | "holy-closet";

export type Category = {
  slug: string;
  title: string;
  icon: CategoryIconName;
  tone: string;
};

export const categories: Category[] = [
  { slug: "beds", title: "מיטות", icon: "bed", tone: "sand" },
  { slug: "bedrooms", title: "ארונות וחדרי שינה", icon: "wardrobe", tone: "stone" },
  { slug: "mattresses", title: "מזרונים", icon: "mattress", tone: "linen" },
  { slug: "dining-chairs", title: "כסאות אוכל", icon: "chair", tone: "clay" },
  { slug: "dining-sets", title: "פינות אוכל", icon: "dining", tone: "sand" },
  { slug: "living-rooms", title: "סלונים וכורסאות", icon: "sofa", tone: "stone" },
  { slug: "sideboards", title: "מזנונים", icon: "sideboard", tone: "linen" },
];

export const bedroomSubcategories = [
  { slug: "sliding-wardrobes", title: "ארונות הזזה", icon: "wardrobe", tone: "stone" },
  { slug: "hinged-wardrobes", title: "ארונות פתיחה", icon: "wardrobe", tone: "linen" },
  { slug: "holy-closets", title: "ארונות קודש", icon: "holy-closet", tone: "clay" },
  { slug: "imported-wardrobes", title: "ארונות ייבוא", icon: "wardrobe", tone: "sand" },
  { slug: "bedroom-sets", title: "חדרי שינה", icon: "bed", tone: "stone" },
  { slug: "kids-rooms", title: "חדרי ילדים", icon: "bed", tone: "linen" },
] as const;

const typeLabels: Record<string, string> = {
  sofas: "ספות",
  armchairs: "כורסאות",
  sideboards: "מזנונים",
  "dining-chairs": "כיסאות אוכל",
  "dining-sets": "פינות אוכל",
  mattresses: "מזרנים",
  beds: "מיטות",
  bedrooms: "ארונות וחדרי שינה",
};

// The small label above a product name on its card.
export function productTypeLabel(product: { category: string; collection?: string }) {
  return typeLabels[product.collection ?? ""] ?? typeLabels[product.category] ?? "";
}

export function bedroomGroupImage(slug: string) {
  return `/images/design/wardrobes/${slug}.webp`;
}

export function categoryHref(slug: string) {
  return `/catalog/${slug}`;
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

// Meta descriptions for the catalog pages (what search results show under the title). {count} is the number of models.
export const categoryDescriptions: Record<string, string> = {
  "living-rooms": "ספות, סלונים פינתיים, ספות שזלונג וכורסאות במגוון בדים וגוונים. {count} דגמים באולם התצוגה של החן שברהיט, המלאכה 43 בנתניה.",
  sideboards: "מזנונים לסלון, תלויים ועומדים, בגימורי עץ, שמנת ושחור. {count} דגמים באולם התצוגה של החן שברהיט, המלאכה 43 בנתניה.",
  "dining-sets": "שולחנות אוכל נפתחים מאבן קרמית, פורניר ולמינציה, עגולים, אובליים ומלבניים. {count} דגמים באולם התצוגה של החן שברהיט בנתניה.",
  "dining-chairs": "זוגות כיסאות לפינת האוכל, מרופדים בבד רחיץ או בדמוי עור, עם מידות מלאות. {count} דגמים באולם התצוגה של החן שברהיט בנתניה.",
  beds: "מיטות זוגיות ומיטות יהודיות מרופדות, עם בדים ומידות לבחירה. {count} דגמים באולם התצוגה של החן שברהיט, המלאכה 43 בנתניה.",
  mattresses: "מזרנים עם קפיצי פוקט, ויסקו ולטקס, במגוון מידות ודרגות קשיחות. בואו לשכב עליהם באולם התצוגה של החן שברהיט בנתניה.",
  bedrooms: "ארונות הזזה ופתיחה, ארונות ייבוא, חדרי שינה וחדרי ילדים קומפלט: {count} דגמים עם מידות, באולם התצוגה של החן שברהיט בנתניה.",
};

export function categoryDescription(slug: string, count: number) {
  const text = categoryDescriptions[slug];
  return text ? text.replace("{count}", String(count)) : undefined;
}
