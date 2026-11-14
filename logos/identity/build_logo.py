from pathlib import Path

import fitz
from PIL import Image, ImageDraw, ImageFont


HERE = Path(__file__).resolve().parent
FONT_PATH = "/System/Library/Fonts/SFHebrew.ttf"
NAME_DARK = "#333630"
NAME_WARM = "#8A745A"
TAGLINE = "כשנוחות ויופי נפגשים"
BG = "#FAF8F3"


def font(size, weight):
    result = ImageFont.truetype(FONT_PATH, size)
    result.set_variation_by_axes([weight, 28])
    return result


def draw_hebrew(draw, text, x, top, face, color, *, align="left"):
    visual = text[::-1]
    box = draw.textbbox((0, 0), visual, font=face)
    width = box[2] - box[0]
    if align == "center":
        x -= width / 2
    elif align == "right":
        x -= width
    draw.text((round(x), round(top - box[1])), visual, font=face, fill=color)
    return width


def draw_wordmark(draw, center_x, top, size, gap):
    first = font(round(size * 1.12), 650)
    second = font(size, 430)
    first_width = draw.textbbox((0, 0), "החן"[::-1], font=first)[2]
    second_width = draw.textbbox((0, 0), "שברהיט"[::-1], font=second)[2]
    total = first_width + second_width + gap
    left_edge = center_x - total / 2
    draw_hebrew(draw, "שברהיט", left_edge, top + round(size * 0.12), second, NAME_WARM)
    draw_hebrew(draw, "החן", left_edge + second_width + gap, top, first, NAME_DARK)
    return total


mark_doc = fitz.open(HERE / "living-room-mark.svg")
mark_pix = mark_doc[0].get_pixmap(matrix=fitz.Matrix(5, 5), alpha=True)
mark_pix.save(HERE / "living-room-mark.png")
mark = Image.open(HERE / "living-room-mark.png").convert("RGBA")

# Main horizontal signature with the existing brand line.
primary = Image.new("RGBA", (1600, 560), (0, 0, 0, 0))
draw = ImageDraw.Draw(primary)
icon = mark.resize((470, 258), Image.Resampling.LANCZOS)
primary.alpha_composite(icon, (1060, 148))
draw_wordmark(draw, 620, 203, 112, 24)
draw_hebrew(draw, TAGLINE, 620, 335, font(31, 400), NAME_WARM, align="center")
primary.save(HERE / "primary-logo-transparent.png")
on_ivory = Image.new("RGBA", primary.size, BG)
on_ivory.alpha_composite(primary)
on_ivory.convert("RGB").save(HERE / "primary-logo-preview.png")

# A compact header lockup keeps the room mark but leaves out the small tagline.
compact = Image.new("RGBA", (900, 260), (0, 0, 0, 0))
draw = ImageDraw.Draw(compact)
icon = mark.resize((275, 151), Image.Resampling.LANCZOS)
compact.alpha_composite(icon, (605, 54))
draw_wordmark(draw, 305, 92, 75, 16)
compact.save(HERE / "compact-logo-transparent.png")
compact_bg = Image.new("RGBA", compact.size, BG)
compact_bg.alpha_composite(compact)
compact_bg.convert("RGB").save(HERE / "compact-logo-preview.png")

# Present the main and compact sizes together for a direct size check.
board = Image.new("RGB", (1660, 950), "#E8E3D9")
board.paste(on_ivory.convert("RGB"), (30, 30))
compact_bg = compact_bg.resize((900, 260), Image.Resampling.LANCZOS)
board.paste(compact_bg.convert("RGB"), (380, 630))
board.save(HERE / "preview.png")
