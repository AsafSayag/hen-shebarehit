# Builds public/og-image.jpg, the default link preview for WhatsApp, Facebook and others:
# the home hero photo with the lamp mark, the business name and the tagline from the logo.
#
# Run from the project root after `next dev` has run once (it writes the Assistant font files used here):
#   python3 scripts/build-share-image.py
# Needs Pillow and PyMuPDF (fitz). The tagline below must match `business.tagline` in lib/site.ts.
import glob
import io

import fitz
from PIL import Image, ImageDraw, ImageFont

TAGLINE = "איכות ושירות, זה אנחנו"

MARK = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 72" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path d="M32 2v15" stroke="#c9b79c" stroke-width="1.8"/><path d="M17 33c0-9.4 6.7-16 15-16s15 6.6 15 16z" fill="#c9b79c"/>
<circle cx="32" cy="36.5" r="2.6" fill="#c9b79c"/><path d="M24 42.5q8 4.5 16 0" stroke="#c9b79c" stroke-width="1.6"/>
<path d="M17 59v-3.5a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3V59" stroke="#f6f2eb" stroke-width="2.4"/>
<path d="M12 68v-7.5a3 3 0 0 1 6 0V63h28v-2.5a3 3 0 0 1 6 0V68z" stroke="#f6f2eb" stroke-width="2.4"/></svg>'''


def assistant_subsets():
    """Next splits Assistant (OFL) into a Hebrew file and a Latin file; punctuation such as the comma is only in the Latin one."""
    hebrew = latin = None
    for path in sorted(glob.glob(".next/dev/static/media/*.woff2")):
        face = ImageFont.truetype(path, 40)
        notdef = face.getmask("").getbbox()
        if face.getmask("א").getbbox() != notdef:
            hebrew = path
        elif face.getmask(",").getbbox() != notdef:
            latin = path
    if not hebrew or not latin:
        raise SystemExit("Assistant font files not found: run `npm run dev` once, then try again.")
    return hebrew, latin


HEBREW, LATIN = assistant_subsets()


def font(size, weight, path=HEBREW):
    face = ImageFont.truetype(path, size)
    face.set_variation_by_axes([weight])
    return face


doc = fitz.open(stream=MARK.encode(), filetype="svg")
pix = doc[0].get_pixmap(matrix=fitz.Matrix(8, 8), alpha=True)
mark = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")
mark = mark.resize((86, round(86 * mark.height / mark.width)), Image.LANCZOS)

W, H = 1200, 630
photo = Image.open("public/images/design/home/hero.webp").convert("RGB")
scale = max(W / photo.width, H / photo.height)
photo = photo.resize((round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS)
left = round((photo.width - W) * 0.2)
top = round((photo.height - H) / 2)
canvas = photo.crop((left, top, left + W, top + H))
# Darken the right side, where the text sits.
shade = Image.new("L", (W, 1))
for x in range(W):
    t = max(0.0, (x - W * 0.30) / (W * 0.70))
    shade.putpixel((x, 0), int(195 * t ** 1.1))
canvas = Image.composite(Image.new("RGB", (W, H), (40, 30, 22)), canvas, shade.resize((W, H))).convert("RGBA")
d = ImageDraw.Draw(canvas)


def rtl(text, y, face, fill, right=1120):
    """Draws a Hebrew run ending at `right` (Pillow has no bidi here, so the letters are reversed) and returns its left edge."""
    vis = text[::-1]
    box = d.textbbox((0, 0), vis, font=face)
    w = box[2] - box[0]
    d.text((right - w - box[0], y - box[1]), vis, font=face, fill=fill)
    return right - w


def rtl_with_comma(text, y, size, fill, right=1120):
    """A Hebrew line with one comma: the comma comes from the Latin file, on the same baseline as the letters."""
    before, after = (part.strip() for part in text.split(",", 1))
    hebrew = font(size, 400)
    edge = rtl(before, y, hebrew, fill, right)
    comma = font(size, 400, LATIN)
    # Baseline of the Hebrew run: rtl() puts the top of the ink at y.
    baseline = y - d.textbbox((0, 0), before[::-1], font=hebrew)[1] + hebrew.getmetrics()[0]
    cbox = d.textbbox((0, 0), ",", font=comma)
    d.text((edge - 2 - cbox[2], baseline - comma.getmetrics()[0]), ",", font=comma, fill=fill)
    space = d.textlength(" ", font=hebrew)
    return rtl(after, y, hebrew, fill, right=edge - 2 - (cbox[2] - cbox[0]) - space)


cream, tan = (246, 242, 235), (201, 183, 156)
# Name: "החן" bold cream and "שברהיט" light tan, as in the logo.
first_left = rtl("החן", 236, font(104, 700), cream)
rtl("שברהיט", 236, font(104, 300), tan, right=first_left - 26)
canvas.alpha_composite(mark, (1120 - mark.width, 92))
if "," in TAGLINE:
    rtl_with_comma(TAGLINE, 372, 38, tan)
else:
    rtl(TAGLINE, 372, font(38, 400), tan)
d.line([(980, 446), (1120, 446)], fill=tan, width=2)
small = font(34, 400)
edge = rtl("ריהוט בוטיק לבית", 474, small, cream)
d.ellipse([edge - 22, 488, edge - 14, 496], fill=tan)
rtl("אולם תצוגה בנתניה", 474, small, cream, right=edge - 36)
canvas.convert("RGB").save("public/og-image.jpg", quality=86, optimize=True, progressive=True)
print("public/og-image.jpg")
