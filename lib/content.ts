// Marketing copy for the content pages, taken from the designer's mockups (November 2026).
// Where the mockup showed placeholders or claims we cannot confirm, the copy sticks to what the
// business has confirmed: the Netanya showroom, personal advice, customization on some models,
// and delivery with assembly. Customer feedback informs the wording but is not presented as a
// guarantee of delivery times, prices or product quality.

export const features = [
  { icon: "delivery", title: "משלוח עד הבית", text: "הרהיטים שבחרתם מגיעים אליכם הביתה, בדיוק כמו שהובטח." },
  { icon: "person", title: "יחס אישי וסבלני", text: "מקשיבים למה שהבית צריך, עונים על כל שאלה וזמינים גם אחרי ההזמנה." },
  { icon: "sliders", title: "התאמה אישית", text: "בחלק מהדגמים אפשר לבחור בד, צבע או מידה, כדי שהרהיט יתאים לבית שלכם." },
  { icon: "sofa", title: "אולם תצוגה", text: "יכולים לבוא לשבת, לגעת ולהרגיש את הרהיטים לפני שמחליטים." },
] as const;

export const homeCopy = {
  hero: {
    title: "יש דברים שפשוט כיף לחזור אליהם.",
    lead: "הספה שנרגעים עליה בסוף היום, השולחן שתמיד יש סביבו מקום לעוד אחד. רהיטים שהופכים לחלק מהחיים שלנו.",
    primary: "לצפייה בקטלוג",
    secondary: "קצת עלינו",
  },
  categories: {
    title: "מה אתם מחפשים לבית?",
    lead: "כל הרהיטים שלנו, מחולקים לפי קטגוריות כדי שיהיה לכם קל למצוא את מה שאתם צריכים.",
  },
  products: {
    title: "מהקטלוג שלנו",
    lead: "כמה דגמים ששווה להכיר מתוך {count} הדגמים שבקטלוג.",
    link: "לכל הקטלוג",
  },
  room: {
    title: "איך זה ייראה אצלכם בבית?",
    lead: "ריכזנו כמה רעיונות לשילובים של רהיטים, צבעים וחומרים. אולי תמצאו כאן משהו שתרצו לנסות.",
  },
  styles: {
    title: "איזה סגנון מתאים לכם?",
    lead: "אוהבים מראה נקי ומודרני? אולי משהו חמים יותר? בואו לראות כמה כיוונים.",
  },
  features: {
    title: "כמה דברים שכדאי לדעת עלינו",
    lead: "אנחנו רוצים שיהיה לכם נעים ופשוט למצוא את הרהיטים המתאימים לכם.",
  },
  about: {
    eyebrow: "קצת עלינו",
    title: "נעים להכיר, אנחנו החן שברהיט",
    paragraphs: [
      "ב״החן שברהיט״, חנות ריהוט בוטיק בנתניה, אנחנו מאמינים שרהיט טוב הוא כזה שמזמין אתכם להישאר. באולם התצוגה תמצאו סלונים וכורסאות, מיטות ומזרנים, פינות אוכל ומזנונים.",
      "שמואל גרידיש, בעל החנות, מלווה כל בחירה מקרוב: מקשיב למה שהבית צריך ועוזר לדייק את המידה, הסגנון והנוחות.",
    ],
    link: "עוד קצת עלינו",
  },
  reviews: {
    eyebrow: "ביקורות Google",
    title: "מה הלקוחות שלנו מספרים",
    link: "לכל הביקורות",
  },
  visit: {
    title: "נשמח לראות אתכם אצלנו",
    lead: "תמונות זה נחמד, אבל אין כמו לראות את הצבעים מקרוב, להרגיש את הבדים ולבדוק אם הספה באמת נוחה.",
    question: "יש לכם שאלה? כתבו לנו בוואטסאפ ונחזור אליכם.",
    whatsappText: "שלום, אשמח לתאם ביקור באולם התצוגה.",
  },
} as const;

// The style cards link to the category shown in each photo; the catalog has no style filter yet.
export const styleCards = [
  { key: "modern", title: "מודרני חם", text: "קווים נקיים, בדים רכים וגווני אדמה שמחממים את החלל.", image: "/images/design/home/style-modern.webp", href: "/catalog/dining-sets", link: "לפינות האוכל" },
  { key: "rustic", title: "כפרי", text: "עץ מלא, טקסטורות טבעיות ופרטים שמספרים סיפור.", image: "/images/design/home/style-rustic.webp", href: "/catalog/living-rooms#sofas", link: "לספות ולסלונים" },
  { key: "scandinavian", title: "סקנדינבי", text: "אור, פשטות ועץ בהיר לבית מאוורר ונעים.", image: "/images/design/home/style-scandinavian.webp", href: "/catalog/beds", link: "למיטות" },
] as const;

// Hotspots on the bedroom scene; positions are percentages of the image (from the left and top).
export const roomHotspots = [
  { key: "wardrobe", label: "ארונות", text: "ארונות הזזה ופתיחה, ארונות ייבוא וארונות קודש.", href: "/catalog/bedrooms", thumb: "/images/design/home/room-wardrobe.webp", x: 11, y: 44 },
  { key: "bed", label: "מיטות", text: "מיטות זוגיות ומיטות יהודיות, בבדים ובגימורים שונים.", href: "/catalog/beds", thumb: "/images/design/categories/beds.webp", x: 46, y: 36 },
  { key: "mattress", label: "מזרנים", text: "מזרנים לשינה נוחה, במידות שונות.", href: "/catalog/mattresses", thumb: "/images/design/categories/mattresses.webp", x: 61, y: 62 },
  { key: "armchair", label: "כורסאות", text: "כורסה לפינת קריאה או לצד המיטה.", href: "/catalog/living-rooms#armchairs", thumb: "/images/design/categories/armchairs.webp", x: 87, y: 56 },
] as const;

export const whatsappBand = {
  title: "יש לכם שאלה? כתבו לנו בוואטסאפ",
  text: "נשמח לענות על כל שאלה על הדגמים, הבדים, המידות וההזמנות.",
  button: "לשיחה בוואטסאפ",
  message: "שלום, יש לי שאלה על רהיט מהאתר.",
} as const;

export const aboutCopy = {
  meta: {
    title: "אודות",
    description: "החן שברהיט, חנות ריהוט בוטיק ברחוב המלאכה 43 בנתניה. הכירו את אולם התצוגה, את שמואל גרידיש ואת הדרך שבה בוחרים רהיטים לבית.",
  },
  hero: {
    eyebrow: "קצת עלינו",
    title: "נעים להכיר.",
    lead: "אנחנו החן שברהיט, ואתם מוזמנים להרגיש בבית.",
  },
  story: {
    title: "הסיפור שלנו",
    paragraphs: [
      "״החן שברהיט״ היא חנות ריהוט בוטיק בנתניה. באולם התצוגה תמצאו סלונים וכורסאות, מיטות, מזרנים, פינות אוכל ומזנונים לבית, במגוון סגנונות.",
      "יש משהו כיף בלבחור רהיטים לבית. לפעמים מגיעים כשכבר יודעים בדיוק מה רוצים, ולפעמים דווקא משהו שלא חשבתם עליו מצליח לתפוס את העין.",
      "אנחנו אוהבים את התהליך הזה. את ההתלבטויות בין צבעים, את הניסיון לדמיין איך משהו ייראה בסלון ואת הרגע שבו פתאום מוצאים משהו שפשוט מרגיש נכון.",
      "באולם התצוגה שלנו בנתניה תוכלו לראות את הרהיטים מקרוב, להרגיש את החומרים, לשאול שאלות ולהתלבט כמה שצריך. אנחנו כאן כדי לעזור, אבל הבחירה היא תמיד שלכם.",
    ],
  },
  process: {
    title: "מהשאלה הראשונה ועד הבית",
    lead: "ככה זה עובד אצלנו, ואנחנו מלווים אתכם בכל שלב.",
    steps: [
      { icon: "chat", title: "כותבים לנו או קופצים לאולם", text: "שאלה על דגם, בד או זמינות? שולחים הודעה בוואטסאפ, או מגיעים בשעות הפתיחה." },
      { icon: "swatch", title: "מתייעצים ובוחרים", text: "מקשיבים למה שהבית צריך וממליצים על כמה אפשרויות. בחלק מהדגמים בוחרים בד, צבע או מידה." },
      { icon: "delivery", title: "מתאמים משלוח", text: "מתאמים איתכם את המשלוח, ונשארים זמינים לכל שאלה גם אחרי ההזמנה." },
      { icon: "home", title: "הרהיט מגיע הביתה", text: "עד הדלת ועם הרכבה במקום, בדיוק כמו שהובטח." },
    ],
  },
  reviews: {
    title: "מה הלקוחות שלנו מספרים",
    text: "לקוחות חוזרים ומתארים יחס אישי וסבלני, זמינות גם אחרי ההזמנה, מחיר הוגן ורהיטים שמגיעים בדיוק כמו שהובטח.",
    link: "לכל הביקורות ב-Google",
  },
} as const;

export const contactCopy = {
  meta: {
    title: "צרו קשר",
    description: "צרו קשר עם החן שברהיט, המלאכה 43 נתניה. וואטסאפ וטלפון לשאלות על דגמים, בדים וזמינות, ניווט לאולם התצוגה ושאלות נפוצות.",
  },
  hero: {
    title: "נשמח לשמוע מכם",
    lead: "שאלה על דגם, בד או זמינות? כתבו לנו, התקשרו או קפצו לאולם התצוגה.",
  },
  cards: {
    whatsapp: { title: "וואטסאפ או שיחה", note: "מענה אישי לכל שאלה", whatsapp: "וואטסאפ", call: "התקשרו" },
    showroom: { title: "אולם התצוגה", navigate: "ניווט לאולם" },
    social: { title: "עקבו אחרינו", subtitle: "פייסבוק ואינסטגרם", text: "מוזמנים לעקוב אחרינו גם ברשתות." },
  },
  faq: {
    title: "שאלות ששואלים אותנו הרבה",
    lead: "לא מצאתם תשובה? כתבו לנו בוואטסאפ.",
  },
} as const;

export const faqs = [
  { question: "למה אין מחירים באתר?", answer: "המחירים משתנים לפי הדגם, הבד והמידה. כתבו לנו בוואטסאפ על הדגם שמעניין אתכם ונחזור אליכם עם כל הפרטים." },
  { question: "האם יש משלוח?", answer: "כן. אנחנו מביאים את הרהיטים עד הבית ומרכיבים אותם במקום. את מועד המשלוח מתאמים איתכם." },
  { question: "אפשר לבחור בד, צבע או מידה?", answer: "בחלק מהדגמים כן. כתבו לנו איזה דגם מעניין אתכם, ונספר אילו אפשרויות יש בו." },
  { question: "צריך לתאם הגעה לאולם התצוגה?", answer: "אפשר להגיע בשעות הפתיחה. אם אתם באים לראות דגם מסוים, כדאי לכתוב לנו קודם כדי לוודא שהוא מוצג באולם." },
  { question: "איך בודקים אם דגם זמין?", answer: "שלחו לנו בוואטסאפ את שם הדגם או צילום מסך מהאתר, ונבדוק עבורכם את הזמינות." },
] as const;
