#!/usr/bin/env python3
"""Write a short description (one or two sentences) for every product to data/product-descriptions.json.

The first sentence says what the product is, from its name and the supplier's details. The second gives the
main dimensions when the supplier lists them. Products that came without details (the sofas, armchairs and
sideboards from the Drive, and the beds) get a sentence written from their name and photo, with no dimensions.

Run again after importing products: python3 scripts/build-product-descriptions.py
A hand-written text in data/product-descriptions-manual.json always wins over the generated one.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
SOURCES = ["products", "mattresses", "zvz-mattresses", "drive-furniture", "nammal-beds", "guber-products"]
CM = "ס״מ"

# What the photos show, for products the supplier sent without details (checked one by one, November 2026).
PHOTO_NOTES = {
    # Sofas
    60001: "עם כריות גב רכות וגדולות", 60002: "עם כריות גב רכות", 60003: "עם משענות יד מעוגלות",
    60004: "עם מושבים עמוקים וכריות גב", 60005: "בבד בעל מראה קטיפתי", 60006: "בבד בעל מראה קטיפתי ועם הרבה כריות",
    60007: "עם משענות יד מעוגלות", 60008: "בבד עם מרקם ועם כריות גב רכות", 60009: "עם כריות גב רכות",
    60010: "בבד בעל מראה קטיפתי", 60011: "עם מושב מעוגל וכריות גב", 60012: "עם כריות גב גדולות",
    60013: "עם כריות גב רכות", 60014: "עם כריות גב גבוהות", 60015: "על רגליים נמוכות", 60016: "עם קצה שזלונג מעוגל",
    60017: "על רגליים דקות שחורות", 60018: "בקווים נקיים", 60019: "בצורת קשת, שמתאימה לסלון מרווח",
    60020: "בקווים ישרים ונקיים", 60021: "עם פרטי עץ במשענות היד", 60022: "בצורת קשת, על רגלי עץ קטנות",
    60023: "עם משענות יד מעוגלות בגוון מעט כהה יותר", 60024: "עם משענות יד מעוגלות", 60025: "עם מושב רחב ועמוק",
    60026: "עם מושבים מכופתרים, על רגליים דקות", 60027: "על בסיס עץ כהה", 60028: "על בסיס נמוך",
    60029: "בקווים נקיים", 60030: "עם מושבים עמוקים", 60031: "בת שתי ספות על רגליים דקות",
    60032: "על רגלי מתכת דקות", 60033: "על רגליים דקות", 60034: "על רגליים דקות", 60035: "על רגליים דקות",
    60036: "על רגלי עץ", 60037: "בריפוד במראה עור, עם כריות גב", 60038: "על רגלי עץ בהירות",
    60039: "בבד בעל מראה קטיפתי", 60040: "על רגליים דקות", 60041: "עם גב מכופתר ובסיס עץ",
    60042: "עם משענות יד מעוגלות", 60043: "עם גב מכופתר, על רגלי עץ באלכסון", 60044: "בקווים נקיים ופשוטים",
    60045: "עם משענות יד מעוגלות", 60046: "על רגליים דקות", 60047: "בבד קורדרוי עם פסים",
    60048: "עם כריות גב רכות", 60049: "עם כריות גב גדולות", 60050: "עם מושבים עמוקים", 60051: "עם הדום מרובע",
    60052: "על רגליים זהובות", 60053: "בבד עם מרקם", 60054: "עם מושבים מכופתרים", 60055: "עם משענות יד מעוגלות",
    60056: "עם מושבים נמוכים ורחבים", 60057: "עם כריות בגוונים מנוגדים", 60058: "על רגליים דקות",
    60059: "על רגליים קטנות", 60060: "בצורת קשת", 60061: "עם מושבים עמוקים",
    # Armchairs
    61001: "בריפוד במראה עור ובצורה פיסולית", 61002: "בצורה מעוגלת ורכה", 61003: "בצורה מעוגלת שעוטפת את היושב",
    61004: "בעיצוב שובב ועגול", 61005: "עם גב פתוח ומעוגל", 61006: "בצורה מעוגלת", 61007: "עם פס צבע מנוגד",
    61008: "עם מושב עגול ובד מפוספס", 61009: "עם מסגרת מתכת שחורה ומשענת במראה עור", 61010: "עם מושב עגול ומשענת מעוגלת",
    61011: "עם משענת גבוהה וכרית גב", 61012: "על רגליים שחורות דקות", 61013: "עם מסגרת עץ ומשענות יד מעץ",
    61014: "על בסיס עץ מעוגל", 61015: "עם מושב עגול ומשענת קשתית", 61016: "עם מסגרת עץ ומושב מרופד",
    61017: "עם מסגרת עץ", 61018: "בצורה עגולה ורכה", 61019: "בצורה עגולה ורכה", 61020: "עם כרית גב רכה",
    61021: "בבד בדוגמה, על מסגרת מתכת", 61022: "על רגלי מתכת דקות", 61023: "בצורה מעוגלת ורכה",
    # Sideboards
    62001: "מזנון לבן עם חזית בתבליט מעוצב ורגליים שחורות", 62002: "מזנון בגוון שמנת עם חזיתות בצורת קשתות ורגלי עץ",
    62003: "מזנון מעוגל בגוון שמנת עם משטח בגוון עץ", 62004: "מזנון תלוי עם חזית פסים", 62005: "מזנון תלוי בגוון אבן",
    62006: "מזנון לבן עם חזית מחורצת ודלתות הזזה, על רגליים", 62007: "מזנון תלוי עם חזיתות בתבליט",
    62008: "מזנון שחור עם תא פתוח בגוון עץ", 62009: "מזנון ארוך בגוון שמנת עם רגליים זהובות",
    62010: "מזנון בשחור ובגוון עץ", 62011: "מזנון לבן עם חזיתות בתבליט", 62012: "מזנון בגוון אבן עם חזיתות מחורצות",
    62013: "מזנון עם חזית עץ אגוז בדוגמת אדרה, על רגליים בהירות", 62014: "מזנון בגוון ורוד עתיק עם חזית מחורצת וידיות זהב",
    62015: "מזנון במראה עץ אפור, על רגלי עץ", 62016: "מזנון בגוון אגוז עם תא פתוח, על רגלי עץ באלכסון",
    62017: "מזנון מעוגל בגוון שמנת עם חזית מחורצת", 62018: "מזנון שחור בקווים ישרים", 62019: "מזנון בגוון חום עם חזית עץ מפוספסת",
    62020: "מזנון בגוון אפור כהה", 62021: "מזנון שחור עם חזית עץ מפוספסת וספרייה פתוחה", 62022: "מזנון אובלי בגוון שמנת עם חזית מחורצת",
    62023: "שידה לבנה עם צדדים מעוגלים ומגירות", 62024: "מזנון אובלי בגוון חום על מסגרת מתכת שחורה", 62025: "מזנון אפור עם חזית בתבליט שחור",
    62026: "מזנון שחור עם תא פתוח",
}

# (start of the name, what it is, what it is good for)
SOFA_SHAPES = [
    ("ספת שזלונג", "ספת שזלונג", "בהרחבת השזלונג אפשר לשבת או להניח את הרגליים."),
    ("סלון פינתי", "סלון פינתי", "הוא מנצל את פינת החדר ונותן מקום ישיבה לכל המשפחה."),
    ("ספה מעוגלת", "ספה בקווים מעוגלים", "הקווים הרכים מרככים את הסלון ומזמינים לשבת."),
    ("ספה והדום", "ספה עם הדום תואם", "את ההדום אפשר להצמיד לספה או להשתמש בו כמקום ישיבה נוסף."),
    ("ספה קלאסית", "ספה קלאסית", "קווים פשוטים שמשתלבים בקלות בסלון, גם לצד רהיטים קיימים."),
    ("ספה מרופדת", "ספה מרופדת", "ריפוד נוח לישיבה ארוכה, מול הטלוויזיה או עם אורחים."),
    ("ספה רחבה", "ספה רחבה ועמוקה", "יש בה מקום לכל המשפחה."),
    ("ספה מעוצבת", "ספה מעוצבת", "מוסיפה לסלון נוכחות בלי להעמיס עליו."),
    ("ספה רכה", "ספה רכה ותפוחה", "מזמינה לשקוע בה בסוף היום."),
    ("ספה תפוחה", "ספה רכה ותפוחה", "מזמינה לשקוע בה בסוף היום."),
    ("מערכת ישיבה", "מערכת ישיבה", ""),
]
HANGING_SIDEBOARD = "הוא נתלה על הקיר, כך שהרצפה נשארת פנויה והחדר נראה מרווח."
COLORS = ["אפור בהיר", "אפור כהה", "ורוד עתיק", "שמנת", "קרם", "אבן", "חול", "אפור", "ירוק", "ירקרק", "חמרה", "מוקה", "ורוד",
          "בז׳", "בז'", "חום", "תכלת", "גרפיט", "פחם", "שחור", "לבן", "אגוז", "קאמל", "כתום", "חרדל"]


def clean(text: str) -> str:
    text = text.replace('ס"מ', CM).replace("ס”מ", CM).replace("ס''מ", CM).replace("’", "'")
    text = re.sub(r"\s+", " ", text).strip(" .,¦·–-")
    return text


def number(value: str) -> str:
    value = value.rstrip(".")
    return value[:-2] if value.endswith(".0") else value


def name_color(name: str) -> str | None:
    """The colour words of a name, with their preposition: "בגוון שמנת" or "בשמנת ובחמרה"."""
    match = re.search(r"בגוון ([^,]+?)(?:$| עם| ו)", name)
    if match:
        return f"בגוון {match.group(1).strip()}"
    match = re.search(r" ב(\S+) ו(\S+)$", name)
    if match and match.group(1) in COLORS:
        return f"ב{match.group(1)} וב{match.group(2)}"
    for color in COLORS:
        if re.search(rf"(^|\s){re.escape(color)}($|\s)", name):
            return f"בגוון {color}"
    return None


def join_list(items: list[str]) -> str:
    items = [item for item in items if item]
    if len(items) <= 1:
        return "".join(items)
    last = items[-1]
    return ", ".join(items[:-1]) + (" ו־" if last[:1].isdigit() or last[:1].isascii() and last[:1].isalpha() else " ו") + last


def dims_sentence(width=None, height=None, depth=None, length=None, prefix="מידות") -> str | None:
    parts = []
    if length:
        parts.append(f"אורך {number(length)}")
    if width:
        parts.append(f"רוחב {number(width)}")
    if depth:
        parts.append(f"עומק {number(depth)}")
    if height:
        parts.append(f"גובה {number(height)}")
    if len(parts) < 2:
        return None
    return f"{prefix}: {', '.join(parts)} {CM}."


def first_value(text: str, label: str) -> str | None:
    match = re.search(rf"{label}\s*[:–\-]?\s*(\d+(?:\.\d+)?)", text)
    return match.group(1) if match else None


# Living room (sofas, armchairs) and sideboards: no supplier details, so a sentence from the name and photo.
def describe_drive(product: dict) -> str:
    name, pid = product["name"], product["id"]
    note = PHOTO_NOTES.get(pid)
    color = name_color(name)
    color_part = f" {color}" if color else ""
    if product.get("collection") == "sideboards":
        # The photo notes already carry the colour from the name.
        base = note or f"מזנון{color_part}"
        if "תלוי" in base:
            return f"{base}. {HANGING_SIDEBOARD}"
        if base.startswith("שידה"):
            return f"{base}. מתאימה לסלון, לפינת האוכל או לכניסה לבית."
        if "ספרייה" in base:
            return f"{base}. משלב אחסון סגור ומדפים פתוחים לספרים ולחפצים."
        return f"{base}. מתאים לסלון, מתחת לטלוויזיה או לאורך הקיר."
    # The colour is already in the product name, shown right above the description, so it is not repeated.
    if product.get("collection") == "armchairs":
        lead = "כורסה" + (f" {note}" if note else color_part)
        return f"{lead}. מתאימה לפינת קריאה, לסלון או לחדר השינה."
    noun, benefit = next(((noun, benefit) for key, noun, benefit in SOFA_SHAPES if name.startswith(key)), ("ספה", ""))
    lead = noun + (f" {note}" if note else color_part)
    return f"{lead}. {benefit}".strip()


def describe_chair(product: dict) -> str:
    details = [clean(line) for line in product["details"]]
    text = " ¦ ".join(details)
    upholstery = "בדמוי עור" if "דמוי עור" in text else "בבד רחיץ" if "רחיץ" in text else "בבד"
    color = None
    for pattern in [r"מרופדים ב?ד[^¦]*?בגוון ([^¦,]+)", r"גוון ריפוד(?: הכיסא)?\s*[:–\-]\s*([^¦,]+)", r"גוון הבד:\s*([^¦,]+)", r"גוון הריפוד ([^¦,]+)",
                    r"גוון דמוי עור\s*[–\-]\s*([^¦,]+)", r"גב ומושב בגוון (?:דמוי )?([^¦,]+)", r"(?:^|¦ )גוון:? ([^¦,]+)"]:
        match = re.search(pattern, text)
        if match:
            color = re.sub(r"^(דמוי )?עור (בגוון )?", "", match.group(1).replace("דמוי עור בגוון", "").replace("בד משולב בגווני", "").strip())
            break
    legs = None
    match = re.search(r"רגליים בגוון ([^¦,.]+)", text) or re.search(r"רגלי (?:ה)?(?:ברזל|מתכת)[^¦]*?(?:בגימור|בגוון) ([^¦,.]+)", text)
    if match:
        legs = match.group(1).strip()
    fully = "כולל ברגליים" in text or "כל חלקי הכיסאות מרופדים" in text
    lead = f"זוג כיסאות לפינת האוכל, מרופדים {upholstery}"
    if color:
        lead += f" בגוון {color}"
    features = []
    if "משענת מעוגלת" in text or "גב מעוגל" in text:
        features.append("משענת מעוגלת")
    if legs and not fully:
        features.append(f"רגלי מתכת בגימור {legs}")
    if features:
        lead += ", עם " + join_list(features)
    lead += ". הריפוד עוטף את כל הכיסא, כולל הרגליים." if fully else "."
    # Dimensions: the lines after "מידות:".
    dims_lines = details[details.index("מידות:") + 1:] if "מידות:" in details else [line for line in details if "רוחב" in line]
    dims_text = " ¦ ".join(dims_lines)
    width = first_value(re.sub(r"מידות גב[^¦]*", "", dims_text), "רוחב")
    depth = first_value(re.sub(r"עומק מושב[^¦]*", "", dims_text), "עומק")
    seat_line = re.search(r"מידות מושב[^¦]*", dims_text)
    height = first_value(dims_text, "גובה כללי(?: מהריצפה)?") or first_value(re.sub(r"(מידות מושב[^¦]*|גובה מושב[^¦]*)", "", dims_text), "גובה")
    seat = first_value(dims_text, "גובה מושב(?: מהרצפה)?") or (first_value(seat_line.group(0), "גובה") if seat_line else None)
    sentence = dims_sentence(width=width, depth=depth, height=height, prefix="מידות כל כיסא")
    if sentence and seat:
        sentence = sentence[:-1] + f", גובה המושב {number(seat)} {CM}."
    return lead + (f" {sentence}" if sentence else "")


def describe_table(product: dict) -> str:
    name = product["name"]
    details = [clean(line) for line in product["details"]]
    text = " ¦ ".join(details)
    shape = "עגול" if ("עגול" in name or "קוטר" in text[:80]) else "אובלי" if ("אובלי" in name or "אובאלית" in text) else ""
    top = "אבן קרמית" if "אבן קרמית" in name or "אבן קרמית" in text else "פורניר עץ" if "פורניר" in text else "למינציה"
    color = None
    for pattern in [r"גוון פלטה:\s*([^¦,]+)", r"גוון: פלטה ([^\s¦]+) ורגליים", r"גוון: פלטה ורגליים בגימור ([^\s¦]+)",
                    r"פלט[הת][^¦]*?בגוון ([^¦,.(]+?)(?: כמוצג| עם|,|\.| ¦|$)"]:
        match = re.search(pattern, text)
        if match:
            color = match.group(1).strip()
            break
    if not color:
        match = re.search(r" [–\-] ([^\d–\-]{2,18}?)(?: עם רגל.*| רגל.*)?$", name)
        color = match.group(1).strip() if match else None
    legs_material = "עץ" if "רגלי עץ" in name or "פורניר אגוז" in text and "בסיס" in text else "ברזל"
    leg_color = None
    for pattern in [r"גוון (?:ה)?רגל\s*:\s*([^¦,.]+)", r"(?:^|¦ |, )רגליים:\s*(?:גוון |גימור )?([^¦,.]+)", r"ורגליים בגימור ([^¦,.]+)",
                    r"רגלי השולחן עשויות ברזל (?:בגוון|בגימור) ([^¦,.]+?)(?: כמוצג|\.|$| ¦)"]:
        match = re.search(pattern, text)
        if match:
            leg_color = match.group(1).strip()
            break
    if not leg_color:
        match = re.search(r"רגל(?:י ברזל)? (?:בגוון |בגימור )?(מוקה|אגוז|אלון|שחור|וניל)", name)
        leg_color = match.group(1) if match else None
    pedestal = "רגל בסיס" in text or "רגל מרכזית" in text
    lead = f"שולחן אוכל{' ' + shape if shape else ''} נפתח, עם פלטת {top}"
    if color and color not in ("אבן קרמית",):
        lead += f" בגוון {color}"
    if pedestal:
        lead += " ורגל בסיס מעוצבת במרכז"
    else:
        lead += f" ורגלי {legs_material}"
        if leg_color and leg_color not in (color or "") and len(leg_color) < 16:
            lead += f" בגימור {leg_color}"
    lead += "."
    # Dimensions from the "מידות:" lines; the supplier's sentences sometimes mix metres and centimetres.
    closed = re.search(r"(?:מידות:? ¦ |מידות השולחן\s*:)\s*((?:אורך|קוטר)[^¦]*)", text)
    opened = re.search(r"(?:שולחן )?במצב פתוח:\s*אורך\s*(\d+)", text)
    seats = re.search(r"(?:עד|להכיל)\s*(\d+(?:-\d+)?)\s*סועדים", text)
    sentence = ""
    if closed:
        part = closed.group(1)
        length = first_value(part, "אורך")
        diameter = first_value(part, "קוטר")
        width = first_value(part, "רוחב")
        if diameter:
            sentence = f"קוטר {number(diameter)} {CM}"
        elif length:
            sentence = f"אורך {number(length)}" + (f", רוחב {number(width)}" if width else "") + f" {CM}"
        if sentence and opened:
            sentence += f", ובמצב פתוח אורך {opened.group(1)} {CM}"
    if not sentence:
        match = re.search(r"באורך (\d+(?:\.\d+)?) מ(?:טר|')?,? (?:ו)?נפתח (?:למידה|לאורך|ל-?)\s*(\d+(?:\.\d+)?) מ", name + " " + text)
        if match and float(match.group(1)) < 10:
            sentence = f"אורך {round(float(match.group(1)) * 100)} {CM}, ובמצב פתוח אורך {round(float(match.group(2)) * 100)} {CM}"
    if sentence and seats:
        sentence += f", עד {seats.group(1)} סועדים"
    return lead + (f" {sentence}." if sentence else "")


def describe_mattress(product: dict) -> str:
    details = [clean(line) for line in product["details"]]
    features = [line for line in details if not re.search(r"גובה המזרן|דרגת קשיחות", line)]
    firmness = next((line.split(":", 1)[1].strip() for line in details if line.startswith("דרגת קשיחות")), None)
    height = next((first_value(line, "גובה המזרן") for line in details if "גובה המזרן" in line), None)
    if features and features[0].startswith("מזרן"):
        lead = features[0] + (", עם " + join_list(features[1:3]) if len(features) > 1 else "")
    else:
        lead = "מזרן עם " + join_list(features[:3])
    firmness = {"קשיח": "גבוהה"}.get(firmness or "", firmness)
    if firmness:
        lead += f", בדרגת קשיחות {firmness}"
    lead += "."
    sizes = [size.replace(" × ", "×") for size in product.get("sizes") or []]
    sentence = ""
    if height:
        sentence = f"גובה המזרן {height} {CM}"
    if sizes:
        sizes_text = f"{len(sizes)} מידות, מ־{sizes[0]} עד {sizes[-1]}" if len(sizes) > 3 else join_list(sizes)
        sentence = (sentence + ", והוא " if sentence else "") + f"זמין ב־{sizes_text} {CM}"
    return lead + (f" {sentence}." if sentence else "")


def describe_bed(product: dict) -> str:
    name = product["name"]
    model = re.sub(r"^מיטה (זוגית|יהודית) דגם ", "", name).replace(" כולל ארגז מצעים", "")
    jewish = product.get("bedType") == "jewish"
    if product["id"] in (718708, 718688):
        lead = f"מיטה זוגית מרופדת בעיצוב נמוך ונקי, בלי ראש מיטה, דגם {model}."
    elif jewish:
        lead = f"מיטה יהודית מרופדת דגם {model}, לשני מזרנים נפרדים."
    else:
        lead = f"מיטה זוגית מרופדת דגם {model}, עם ראש מיטה מרופד."
    if "ארגז מצעים" in name:
        lead = lead[:-1] + " וארגז מצעים."
    # Variant labels look like "הפרדה: חזית שלמה · בד: אריג בז' 26400" or "מידה: 160/200" or "צבע: אבן · מידה: 180/200".
    options: dict[str, list[str]] = {}
    for variant in product.get("bedVariants") or []:
        for part in variant["label"].split("·"):
            if ":" not in part:
                continue
            key, value = (item.strip() for item in part.split(":", 1))
            options.setdefault(key, [])
            if value not in options[key]:
                options[key].append(value)
    extras = []
    fabrics = options.get("בד", [])
    if fabrics:
        named = []
        for fabric in fabrics:
            plain = re.sub(r"\s*(\+\s*)?[A-Z]*\d[\dA-Z]*(\s*\+\s*\d+)?\s*$", "", fabric).strip()
            if plain not in ("אריג", "") and plain not in named:
                named.append(plain)
        if len(fabrics) == 1:
            extras.append(f"מגיעה ב{named[0]}" if named else "")
        elif named:
            extras.append(f"אפשר לבחור בין {len(fabrics)} בדים, ביניהם {join_list(named[:3])}")
        else:
            extras.append(f"אפשר לבחור בין {len(fabrics)} בדים")
    if options.get("צבע"):
        extras.append(f"מגיעה בגוונים {join_list(options['צבע'])}")
    if options.get("הפרדה"):
        fronts = ["חזית שלמה" if "שלמה" in item else "חזית וגב חצויים" if "גב" in item else "חזית חצויה" for item in options["הפרדה"]]
        fronts = [front for front in ["חזית שלמה", "חזית חצויה", "חזית וגב חצויים"] if front in fronts]
        extras.append("עם " + (", ".join(fronts[:-1]) + " או " + fronts[-1] if len(fronts) > 1 else fronts[0]))
    sentence = ", ".join(extra for extra in extras if extra)
    sizes = sorted((size.replace("/", "×") for size in options.get("מידה", [])), key=lambda size: [int(n) for n in size.split("×")])
    if sizes:
        sizes_text = f"מתאימה למזרן במידות {join_list(sizes)} {CM}" if len(sizes) > 1 else f"מתאימה למזרן {sizes[0]} {CM}"
        sentence = f"{sentence}. {sizes_text}" if sentence else sizes_text
    return lead + (f" {sentence}." if sentence else "")


def wardrobe_dims(text: str) -> str | None:
    width = first_value(text, "רוחב")
    height = first_value(text, "גובה")
    depth = first_value(re.sub(r"עומק/ · אורך[^¦]*", "", text), "עומק")
    if depth and float(depth) > 100:
        depth = None
    if not width:
        match = re.search(r"(\d{3}(?:\.\d)?)/(\d{3})", text)
        if match:
            width, height = match.group(1), match.group(2)
    if not width:
        match = re.search(r"ארון (\d\.\d{2}) מ'", text)
        if match:
            width = str(round(float(match.group(1)) * 100))
    return dims_sentence(width=width, height=height, depth=depth)


def describe_wardrobe(product: dict, group: str) -> str:
    name = product["name"]
    text = " ¦ ".join(clean(line) for line in product["details"])
    both = f"{name} ¦ {text}"
    if group == "holy-closets" or "ארון קודש" in name:
        lead = "ארון קודש לספרי הקודש של הבית, עם מדפים לאורך כל הגובה."
    else:
        kind = "ארון הזזה" if "הזזה" in name or group == "sliding-wardrobes" else "ארון פתיחה"
        doors = re.search(r"(\d)\s*דלתות", both)
        lead = kind + (f" {doors.group(1)} דלתות" if doors else "")
        extras = []
        color = re.search(r"צבע (דמוי עץ אלון|אלון בהיר|אפור בהיר|[^\s·–,+\d()]+)", both)
        if color and color.group(1) not in ("תנור", "פנים", "דלתות"):
            lead += f" בצבע {color.group(1)}"
        elif "שמנת" in both:
            lead += " בצבע שמנת"
        elif not doors:
            lead += " לחדר השינה"
        if "מראה" in name:
            extras.append("מראה")
        if "זכוכית" in both or "אלומיניום" in both:
            extras.append("דלתות זכוכית במסגרת אלומיניום")
        if "לד" in re.sub(r"[א-ת]לד|לד[א-ת]", "", both):
            extras.append("תאורת לד")
        if extras:
            lead += ", עם " + join_list(extras)
        if "מלמין" in both:
            lead += ", עשוי מלמין יצוק"
        lead += "."
        if "160-240" in both:
            return lead + f" הרוחב לבחירה, בין 160 ל־240 {CM}, ועומק הארון 60 {CM}."
    sentence = wardrobe_dims(text)
    return lead + (f" {sentence}" if sentence else "")


ROOM_ITEMS = [
    ("מיטה", "מיטה"), ("שידות", "שתי שידות לילה"), ("שידה", "שידות לילה"), ("שידת 2 מגירות", "שידות לילה"), ("קומודה", "קומודה"), ("קמודה", "קומודה"),
    ("שידת מגירות", "שידת מגירות"), ("שידת איפור", "שידת איפור"), ("מראה", "מראה"), ("ספסל", "ספסל מרופד"),
    ("ארון", "ארון"),
]


def mattress_size(text: str) -> str | None:
    match = re.search(r"(?:משטח השינה|מזרן|מיזרון|למזרן)[^¦\d]{0,12}(\d{2,3})\s*(?:[*/xX×]|על)\s*(\d{3})", text)
    if match:
        a, b = sorted([int(match.group(1)), int(match.group(2))])
        return f"{a}×{b}"
    # A line that starts with the bed's size ("מיטה140/190"), not the bed's outer size ("מידות חיצוניות למיטה156/201").
    match = re.search(r"(?:^|¦ )מיטה\s*(\d{3})/(\d{3})", text)
    if match:
        return f"{match.group(1)}×{match.group(2)}"
    return None


def describe_room(product: dict, group: str) -> str:
    name = product["name"]
    text = " ¦ ".join(clean(line) for line in product["details"])
    model = re.sub(r"^(חדר שינה|חדר ילדים)( קומפלט)?( דגם)?\s*[–\-]?\s*", "", name).strip()
    if group == "kids-rooms" and name.startswith("מיטת חבר"):
        opens = re.search(r"פתיחה ל ?(\d) מיטות", text)
        drawers = "2 מגירות" in text
        lead = f"מיטת חבר לחדר הילדים{', שנפתחת ל־' + opens.group(1) + ' מיטות' if opens else ''}{' ועם 2 מגירות' if drawers else ''}."
        size = mattress_size(text) or ("80×190" if "80X190" in text else None)
        return lead + (f" מתאימה למזרן {size} {CM}." if size else "")
    found = []
    for key, label in ROOM_ITEMS:
        if key in text and label not in found and not (label == "שידות לילה" and "שתי שידות לילה" in found):
            if key == "ארון" and "ארון" not in re.sub(r"ארון ¦|ארון ·", "ארון ", text):
                continue
            found.append(label)
    if "קמודה גבר" in text:
        found = [item for item in found if item != "קומודה"] + ["קומודה", "קומודת גבר"]
    if group == "kids-rooms" and "שולחן כתיבה" in text:
        found = [item for item in ["ארון", "שולחן כתיבה", "שידה", "כוורת" if "כוורת" in text or "כוננית" in text else "", "מיטה" if "מיטה" in text else ""] if item]
    kind = "חדר ילדים קומפלט" if group == "kids-rooms" else "חדר שינה קומפלט"
    if name.startswith("מיטה מעור"):
        return "מיטה בריפוד עור אמיתי (דגם דאימונד) עם שתי שידות לילה בדמוי עור (דגם נובה) ומגירות עם טריקה שקטה. מגיעה בגוונים מוקה, חום בהיר, קרם וקאמל."
    if not found or text in ("חדר קומפלט", "שולחן", "מיטה"):
        simple = {"שולחן": "שולחן עבודה לחדר הילדים או הנוער", "מיטה": "מיטת נוער", "חדר קומפלט": kind}
        return f"{simple.get(text, kind)}, דגם {model}. לפרטים על הפריטים ועל המידות, כתבו לנו בוואטסאפ."
    size = mattress_size(text)
    if size and "מיטה" not in found:
        found.insert(0, "מיטה")
    lead = f"{kind}, דגם {model}: {join_list(found)}."
    if size:
        more = " (יש גם מידות נוספות)" if "מידות נוספות" in text or "אפשרות להזמין" in text else ""
        return lead + f" המיטה מתאימה למזרן {size} {CM}{more}."
    return lead


def describe(product: dict) -> str:
    category = product["category"]
    if category == "living-rooms" or category == "sideboards":
        return describe_drive(product)
    if category == "dining-chairs":
        return describe_chair(product)
    if category == "dining-sets":
        return describe_table(product)
    if category == "mattresses":
        return describe_mattress(product)
    if category == "beds":
        return describe_bed(product)
    group = (product.get("bedroomGroups") or [""])[0]
    if group in ("bedroom-sets", "kids-rooms"):
        return describe_room(product, group)
    return describe_wardrobe(product, group)


def main() -> None:
    text_overrides = json.loads((DATA / "text-overrides.json").read_text())
    manual_path = DATA / "product-descriptions-manual.json"
    manual = json.loads(manual_path.read_text()) if manual_path.exists() else {}
    out = {}
    for source in SOURCES:
        for product in json.loads((DATA / f"{source}.json").read_text()):
            product = {**product, **text_overrides.get(str(product["id"]), {})}
            key = str(product["id"])
            out[key] = manual.get(key) or re.sub(r"\s+", " ", describe(product)).replace(" ,", ",").strip()
    (DATA / "product-descriptions.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {len(out)} descriptions")


if __name__ == "__main__":
    main()
