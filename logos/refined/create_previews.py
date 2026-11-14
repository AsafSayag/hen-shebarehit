from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
FONT = "/System/Library/Fonts/ArialHB.ttc"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def hebrew(draw, text, x, top, size, color, *, align="right", bold=False):
    font = ImageFont.truetype(FONT_BOLD if bold else FONT, size)
    visual = text[::-1]
    left, glyph_top, right, bottom = draw.textbbox((0, 0), visual, font=font)
    width = right - left
    if align == "center":
        x -= width / 2
    elif align == "right":
        x -= width
    draw.text((round(x), round(top - glyph_top)), visual, font=font, fill=color)
    return width, bottom - glyph_top


def load_symbol(filename, max_width, max_height):
    im = Image.open(ROOT / filename).convert("RGBA")
    alpha = im.getchannel("A")
    box = alpha.point(lambda a: 255 if a > 16 else 0).getbbox()
    im = im.crop(box)
    im.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    return im


cards = []

# 01: the letter ח becomes the frame and armrests of a lounge chair.
card = Image.new("RGB", (1600, 720), "#F8F6F0")
draw = ImageDraw.Draw(card)
mark = load_symbol("symbol-01-chair-het.png", 470, 425)
card.paste(mark, (260 + (470 - mark.width) // 2, 135 + (425 - mark.height) // 2), mark)
hebrew(draw, "חן שבראשית", 1360, 268, 113, "#17382E")
draw.line((810, 419, 1360, 419), fill="#B28B5A", width=2)
hebrew(draw, "ריהוט לבית", 1360, 451, 35, "#83715D")
draw.text((56, 48), "01", font=ImageFont.truetype(FONT, 25), fill="#B28B5A")
card.save(ROOT / "option-01-chair-monogram.png")
cards.append(card)

# 02: a sculptural upholstered chair, set as a quiet atelier signature.
card = Image.new("RGB", (1600, 720), "#FBF8F2")
draw = ImageDraw.Draw(card)
mark = load_symbol("symbol-02-sculptural-chair.png", 360, 385)
card.paste(mark, ((1600 - mark.width) // 2, 73 + (385 - mark.height) // 2), mark)
hebrew(draw, "חן שבראשית", 800, 483, 104, "#4C382F", align="center")
hebrew(draw, "ריהוט לבית", 800, 606, 32, "#A1725D", align="center")
draw.text((56, 48), "02", font=ImageFont.truetype(FONT, 25), fill="#A1725D")
card.save(ROOT / "option-02-sculptural.png")
cards.append(card)

# 03: two interlocking furniture components form a compact brand seal.
card = Image.new("RGB", (1600, 720), "#F4F2EB")
draw = ImageDraw.Draw(card)
mark = load_symbol("symbol-03-joinery.png", 440, 440)
card.paste(mark, (250 + (440 - mark.width) // 2, 134 + (440 - mark.height) // 2), mark)
hebrew(draw, "חן", 1350, 180, 131, "#303B27", bold=True)
hebrew(draw, "שבראשית", 1350, 320, 103, "#303B27")
draw.line((761, 458, 1350, 458), fill="#BFA065", width=2)
hebrew(draw, "ריהוט לבית", 1350, 480, 33, "#786B57")
draw.text((56, 48), "03", font=ImageFont.truetype(FONT, 25), fill="#A18858")
card.save(ROOT / "option-03-joinery.png")
cards.append(card)

board = Image.new("RGB", (1660, 2280), "#E5E1D8")
for i, card in enumerate(cards):
    board.paste(card, (30, 30 + i * 750))
board.save(ROOT / "preview.png")
