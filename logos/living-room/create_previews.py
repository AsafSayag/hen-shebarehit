from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

HERE = Path(__file__).resolve().parent
SERIF = "/System/Library/Fonts/Supplemental/NewPeninimMT.ttc"
SANS = "/System/Library/Fonts/ArialHB.ttc"
MODERN = "/System/Library/Fonts/SFHebrew.ttf"
NAME = "החן שברהיט"
TAGLINE = "כשנוחות ויופי נפגשים"


def text_center(draw, text, center_x, top, font, color):
    visual = text[::-1]
    box = draw.textbbox((0, 0), visual, font=font)
    x = center_x - (box[2] - box[0]) / 2
    draw.text((round(x), round(top - box[1])), visual, font=font, fill=color)


def sketch_asset(filename, max_size):
    asset = Image.open(HERE / filename).convert("RGBA")
    alpha = asset.getchannel("A").point(lambda value: 0 if value < 25 else value)
    asset.putalpha(alpha)
    asset.thumbnail(max_size, Image.Resampling.LANCZOS)
    return asset


cards = []

# Architectural elevation: the complete living-room scene is the visual mark.
card = Image.new("RGB", (1800, 1100), "#FBF9F5")
asset = sketch_asset("room-elevation.png", (1570, 720))
card.paste(asset, ((1800 - asset.width) // 2, 44), asset)
draw = ImageDraw.Draw(card)
text_center(draw, NAME, 900, 811, ImageFont.truetype(SERIF, 124), "#302D29")
text_center(draw, TAGLINE, 900, 962, ImageFont.truetype(SANS, 31), "#8D8072")
card.save(HERE / "01-elevation-logo.png")
cards.append(card)

# A compact, calmer version of the selected living-room direction.
card = Image.new("RGB", (1800, 1100), "#F9F7F2")
draw = ImageDraw.Draw(card)
text_center(draw, NAME, 900, 118, ImageFont.truetype(MODERN, 108), "#383531")
text_center(draw, TAGLINE, 900, 248, ImageFont.truetype(SANS, 29), "#766C60")
asset = sketch_asset("room-sketch.png", (1420, 605))
card.paste(asset, ((1800 - asset.width) // 2, 355), asset)
card.save(HERE / "02-interior-sketch-logo-v3.png")
cards.append(card)

# Living-room rendering shows the identity as signage in an interior setting.
photo = Image.open(HERE / "room-render.png").convert("RGB")
card = ImageOps.fit(photo, (1800, 1100), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
draw = ImageDraw.Draw(card)
text_center(draw, NAME, 900, 145, ImageFont.truetype(SERIF, 126), "#40342B")
text_center(draw, TAGLINE, 900, 290, ImageFont.truetype(SANS, 30), "#6A5B4E")
card.save(HERE / "03-rendered-interior-logo.png")
cards.append(card)

board = Image.new("RGB", (1860, 3390), "#E5E1D9")
draw = ImageDraw.Draw(board)
for i, card in enumerate(cards):
    y = 30 + i * 1120
    board.paste(card, (30, y))
    draw.rounded_rectangle((65, y + 32, 132, y + 76), radius=7, fill="#FBF9F5")
    draw.text((82, y + 39), f"0{i + 1}", font=ImageFont.truetype(SANS, 23), fill="#8B765E")
board.save(HERE / "preview.png")
