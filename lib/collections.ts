// Hand-picked product groups for the home page: the moving "from our catalog" rail, the pages behind the
// bedroom scene ("how will it look in your home") and the three style collections. The picks were made by
// looking at every product photo (November 2026), so each group shows what its title promises.
import { products, type Product } from "@/lib/products";
import { bedroomSubcategories } from "@/lib/site";

const byId = new Map<number, Product>(products.map((product) => [product.id, product]));

export function pick(ids: readonly number[]): Product[] {
  return ids.flatMap((id) => byId.get(id) ?? []);
}

// The home page rail: studio photos from every category, mixed so neighbouring cards differ.
export const showcaseIds = [
  60026, 61012, 62013, 24441, 60021, 721416, 61002, 62002,
  24304, 60003, 989601817, 61013, 24480, 60043, 62024, 61008,
  724128, 24369, 60005, 62022, 61003, 931174747, 60023, 24512,
] as const;

export type ProductGroup = { key: string; title: string; items: Product[]; total?: number; more?: { href: string; label: string } };

export type RoomPage = {
  slug: string;
  label: string;
  title: string;
  lead: string;
  // Where the bedroom photo is centred in the page's banner, as percentages.
  focus: [number, number];
  catalogHref: string;
  groups: () => ProductGroup[];
};

// How many products a large carousel shows before its "see all" card.
const railLimit = 18;

function limited(key: string, title: string, items: Product[], href: string, noun: string): ProductGroup {
  if (items.length <= railLimit) return { key, title, items };
  return { key, title, items: items.slice(0, railLimit), total: items.length, more: { href, label: `לכל ${items.length} ${noun}` } };
}

// The pages behind the markers on the bedroom photo. Each shows its category as large carousels.
export const roomPages: RoomPage[] = [
  {
    slug: "wardrobes",
    label: "ארונות",
    title: "ארונות לחדר השינה",
    lead: "ארונות הזזה ופתיחה, ארונות ייבוא, חדרי שינה וחדרי ילדים. גוללים, משווים ובוחרים את מה שמתאים לחדר.",
    focus: [11, 44],
    catalogHref: "/catalog/bedrooms",
    groups: () =>
      bedroomSubcategories
        .filter((group) => group.slug !== "holy-closets")
        .map((group) => {
          const items = products.filter((product) => product.bedroomGroups?.includes(group.slug));
          return limited(group.slug, group.title, items, `/catalog/bedrooms/category/${group.slug}`, group.title);
        }),
  },
  {
    slug: "beds",
    label: "מיטות",
    title: "מיטות לחדר השינה",
    lead: "מיטות זוגיות ומיטות יהודיות, בבדים ובגימורים שונים. כל מיטה בתמונה גדולה, כדי לראות כל פרט.",
    focus: [46, 36],
    catalogHref: "/catalog/beds",
    groups: () => [
      limited("double-beds", "מיטות זוגיות", products.filter((p) => p.bedType === "double"), "/catalog/beds#double-beds", "המיטות הזוגיות"),
      limited("jewish-beds", "מיטות יהודיות", products.filter((p) => p.bedType === "jewish"), "/catalog/beds#jewish-beds", "המיטות היהודיות"),
    ],
  },
  {
    slug: "mattresses",
    label: "מזרנים",
    title: "מזרנים לשינה נוחה",
    lead: "מזרנים במידות שונות. כדאי לבוא לאולם ולשכב עליהם, כי את ההבדל מרגישים רק ככה.",
    focus: [61, 62],
    catalogHref: "/catalog/mattresses",
    groups: () => [
      { key: "englander", title: "מזרני Englander", items: products.filter((p) => p.category === "mattresses" && /ENGLANDER/i.test(p.name)) },
      { key: "more-mattresses", title: "עוד מזרנים", items: products.filter((p) => p.category === "mattresses" && !/ENGLANDER/i.test(p.name)) },
    ],
  },
  {
    slug: "armchairs",
    label: "כורסאות",
    title: "כורסאות לפינה שלכם",
    lead: "כורסה לפינת קריאה, ליד החלון או לצד המיטה. מחולקות לפי האופי שלהן, כדי שיהיה קל לבחור.",
    focus: [87, 56],
    catalogHref: "/catalog/living-rooms#armchairs",
    groups: () => [
      { key: "soft", title: "רכות ומעוגלות", items: pick([61003, 61005, 61002, 61008, 61015, 61020, 61023, 61006, 61010, 61011, 61018, 61019]) },
      { key: "frames", title: "עם מסגרת עץ או מתכת", items: pick([61013, 61016, 61017, 61014, 61009, 61021, 61022]) },
      { key: "color", title: "צבע ודוגמה", items: pick([61012, 61004, 61007, 61001]) },
    ],
  },
];

export function getRoomPage(slug: string) {
  return roomPages.find((page) => page.slug === slug);
}

export type StyleCollection = {
  slug: string;
  key: "modern" | "rustic" | "scandinavian";
  title: string;
  card: string;
  lead: string;
  image: string;
  imageAlt: string;
  traits: { title: string; text: string }[];
  groups: { key: string; title: string; ids: number[] }[];
};

// Each product appears in one style only.
export const styleCollections: StyleCollection[] = [
  {
    slug: "modern-warm",
    key: "modern",
    title: "מודרני חם",
    card: "קווים נקיים, בדים רכים וגווני אדמה שמחממים את החלל.",
    lead: "צורות מעוגלות, בדים נעימים כמו בוקלה, וגוונים של שמנת, חול ומוקה. מראה עכשווי ונקי, שעדיין מרגיש ביתי וחמים.",
    image: "/images/design/home/style-modern.webp",
    imageAlt: "פינת אוכל עם שולחן עץ כהה, כיסאות מרופדים בגוון חול ומזנון כהה",
    traits: [
      { title: "צורות רכות", text: "ספות וכורסאות מעוגלות, בלי פינות חדות." },
      { title: "גווני אדמה", text: "שמנת, חול, מוקה וטרוורטין שמשתלבים יחד." },
      { title: "בדים נעימים", text: "בוקלה ובדים בטקסטורה שמזמינים לגעת." },
    ],
    groups: [
      { key: "sofas", title: "ספות", ids: [60021, 60022, 60023, 60003, 60016, 60011, 60042, 60055, 60009, 60049, 60061, 60019] },
      { key: "armchairs", title: "כורסאות", ids: [61003, 61008, 61010, 61012, 61015, 61020, 61023] },
      { key: "dining", title: "שולחנות אוכל", ids: [24480, 24487, 24263, 24323, 23787, 24411, 24246] },
      { key: "chairs", title: "כיסאות אוכל", ids: [24291, 23281, 22892, 24395, 24501, 23842, 24516] },
      { key: "sideboards", title: "מזנונים", ids: [62003, 62009, 62017, 62022, 62014, 62001] },
      { key: "beds", title: "מיטות", ids: [721416, 725313, 724542, 722773, 715076, 701828, 723095] },
      { key: "wardrobes", title: "ארונות", ids: [958239250, 904010083, 944323860, 976898952] },
    ],
  },
  {
    slug: "rustic",
    key: "rustic",
    title: "כפרי",
    card: "גווני עץ חמים, עור וטקסטורות טבעיות, ופרטים שמספרים סיפור.",
    lead: "עץ בגוונים כהים וחמים, עור בגוון קוניאק, ובדים בצבעי אדמה כמו חמרה, חום וירוק זית. מראה שמרגיש כאילו היה שם תמיד.",
    image: "/images/design/home/style-rustic.webp",
    imageAlt: "סלון עם ספה בהירה, כריות בגווני אדמה ושולחן עץ עגול",
    traits: [
      { title: "עץ חמים", text: "גימורי אגוז ואלון כהה, ברגליים, במסגרות ובחזיתות." },
      { title: "עור וטקסטורה", text: "עור ודמוי עור בגוון חום, ובדים עם מרקם." },
      { title: "צבעי אדמה", text: "חמרה, חרדל, חום וירוק זית." },
    ],
    groups: [
      { key: "sofas", title: "ספות", ids: [60027, 60037, 60057, 60005, 60039] },
      { key: "armchairs", title: "כורסאות", ids: [61013, 61017, 61001, 61009] },
      { key: "dining", title: "שולחנות אוכל", ids: [24257, 24281, 23088] },
      { key: "chairs", title: "כיסאות אוכל", ids: [23973, 24384, 24431, 24496, 24508, 23832, 24369] },
      { key: "sideboards", title: "מזנונים", ids: [62013, 62016, 62019, 62024, 62021] },
      { key: "beds", title: "מיטות", ids: [721685, 724128] },
      { key: "wardrobes", title: "ארונות", ids: [989601817, 992266064, 979202037] },
    ],
  },
  {
    slug: "scandinavian",
    key: "scandinavian",
    title: "סקנדינבי",
    card: "אור, פשטות ועץ בהיר לבית מאוורר ונעים.",
    lead: "עץ בהיר, רגליים דקות, ובדים לבנים, אפורים ופסטליים. רהיטים פשוטים שמשאירים לחדר הרבה אוויר ואור.",
    image: "/images/design/home/style-scandinavian.webp",
    imageAlt: "חדר שינה בהיר עם מיטת עץ, מצעים לבנים ושמיכה ירוקה",
    traits: [
      { title: "עץ בהיר", text: "אלון טבעי ורגלי עץ בהירות." },
      { title: "קווים פשוטים", text: "רגליים דקות וצורות נקיות, בלי עומס." },
      { title: "גוונים בהירים", text: "לבן, אפור בהיר ונגיעות פסטל." },
    ],
    groups: [
      { key: "sofas", title: "ספות", ids: [60043, 60041, 60038, 60036, 60026, 60017, 60059, 60044] },
      { key: "armchairs", title: "כורסאות", ids: [61016, 61002, 61005, 61014] },
      { key: "dining", title: "שולחנות אוכל", ids: [24441, 24437, 24446, 21869, 22285, 24473, 23100] },
      { key: "chairs", title: "כיסאות אוכל", ids: [24304, 24379, 23577, 24500, 24512, 23262] },
      { key: "sideboards", title: "מזנונים", ids: [62002, 62006, 62015, 62023] },
      { key: "beds", title: "מיטות", ids: [701612, 725802, 717402, 702118, 721339, 718708] },
      { key: "wardrobes", title: "ארונות", ids: [931174747, 998884717, 906146133, 907004169, 900705659] },
    ],
  },
];

export function getStyleCollection(slug: string) {
  return styleCollections.find((style) => style.slug === slug);
}
