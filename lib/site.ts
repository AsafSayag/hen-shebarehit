export const business = {
  name: "החן שברהיט",
  tagline: "כשנוחות ויופי נפגשים",
  address: "המלאכה 43, נתניה",
  landline: "09-8615297",
  mobile: "052-6260068",
  whatsapp: "https://wa.me/972526260068",
  maps: "https://www.google.com/maps/search/?api=1&query=%D7%94%D7%9E%D7%9C%D7%90%D7%9B%D7%94+43+%D7%A0%D7%AA%D7%A0%D7%99%D7%94",
  waze: "https://waze.com/ul?q=%D7%94%D7%9E%D7%9C%D7%90%D7%9B%D7%94%2043%20%D7%A0%D7%AA%D7%A0%D7%99%D7%94&navigate=yes",
} as const;

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

export function categoryHref(slug: string) {
  return `/catalog/${slug}`;
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
