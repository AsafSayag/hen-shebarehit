from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
SERIF = "/System/Library/Fonts/Supplemental/NewPeninimMT.ttc"
CALLIGRAPHIC = "/System/Library/Fonts/Supplemental/Raanana.ttc"
SANS = "/System/Library/Fonts/ArialHB.ttc"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def measure(draw, text, font):
    box = draw.textbbox((0, 0), text[::-1], font=font)
    return box[2] - box[0], box[3] - box[1], box[1]


def write(draw, text, x, top, font, color, align="center"):
    width, height, offset = measure(draw, text, font)
    if align == "center":
        x -= width / 2
    elif align == "right":
        x -= width
    draw.text((round(x), round(top - offset)), text[::-1], font=font, fill=color)
    return width, height


cards = []

# 1. Editorial wordmark: the business name carries the identity.
im = Image.new("RGB", (1600, 720), "#FAF8F4")
d = ImageDraw.Draw(im)
main = ImageFont.truetype(SERIF, 150)
small = ImageFont.truetype(SANS, 31)
write(d, "החן שברהיט", 800, 274, main, "#242B29")
write(d, "כשנוחות ויופי נפגשים", 800, 476, small, "#857C70")
im.save(OUT / "01-editorial-wordmark.png")
cards.append(im)

# 2. An atelier signature, with the two halves of the name set in one line.
im = Image.new("RGB", (1600, 720), "#F8F5EE")
d = ImageDraw.Draw(im)
strong = ImageFont.truetype(CALLIGRAPHIC, 149)
quiet = ImageFont.truetype(SERIF, 132)
right_edge = 1300
first_width, _ = write(d, "החן", right_edge, 284, strong, "#2C342F", "right")
write(d, "שברהיט", right_edge - first_width - 43, 307, quiet, "#84705A", "right")
d.line((302, 470, 1298, 470), fill="#C8BCA9", width=2)
write(d, "ריהוט בוטיק", 1298, 498, ImageFont.truetype(SANS, 31), "#726A5D", "right")
im.save(OUT / "02-atelier-signature.png")
cards.append(im)

# 3. A compact typographic lockup for the storefront and site header.
im = Image.new("RGB", (1600, 720), "#F6F4EE")
d = ImageDraw.Draw(im)
head = ImageFont.truetype(BOLD, 161)
body = ImageFont.truetype(SANS, 117)
write(d, "החן", 800, 156, head, "#2E332F")
write(d, "שברהיט", 800, 350, body, "#2E332F")
d.line((601, 519, 999, 519), fill="#B09676", width=2)
write(d, "כשנוחות ויופי נפגשים", 800, 553, ImageFont.truetype(SANS, 29), "#786F63")
im.save(OUT / "03-modern-lockup.png")
cards.append(im)

board = Image.new("RGB", (1660, 2280), "#E6E1D8")
for i, card in enumerate(cards):
    board.paste(card, (30, 30 + i * 750))
    bd = ImageDraw.Draw(board)
    bd.text((82, 72 + i * 750), f"0{i + 1}", font=ImageFont.truetype(SANS, 23), fill="#A58D72")
board.save(OUT / "preview.png")
