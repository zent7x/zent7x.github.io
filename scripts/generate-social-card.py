"""Regenerate the checked-in social card; requires fonttools and cairosvg.

This is an optional asset-authoring tool, not part of the site build.
Uses the site's local Geist fonts and original SVG project marks.
"""
from pathlib import Path
from xml.etree import ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
ET.register_namespace('', 'http://www.w3.org/2000/svg')
fonts = {
    'regular': TTFont(PUBLIC / 'assets/geist-sans-latin-400-normal-gapTbOY8.woff2'),
    'semibold': TTFont(PUBLIC / 'assets/geist-sans-latin-600-normal-DFOURf8L.woff2'),
}


def text(value, x, y, size, color, weight='regular'):
    font = fonts[weight]
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    pen = SVGPathPen(glyphs)
    cursor = 0
    for character in value:
        name = cmap[ord(character)]
        glyphs[name].draw(TransformPen(pen, (1, 0, 0, 1, cursor, 0)))
        cursor += font['hmtx'][name][0]
    scale = size / font['head'].unitsPerEm
    return f'<path fill="{color}" transform="translate({x} {y}) scale({scale} {-scale})" d="{pen.getCommands()}"/>'


def mark(name, x, y, color):
    sprite = ET.parse(PUBLIC / 'logos/v2/marks.svg').getroot()
    symbol = next(child for child in sprite if child.get('id') == name)
    artwork = ''.join(ET.tostring(child, encoding='unicode') for child in symbol)
    return f'<g transform="translate({x} {y}) scale(1.8)" color="{color}">{artwork}</g>'


parts = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">',
    '<title id="title">Adeeb Bashir — zentex</title>',
    '<desc id="desc">Founder and security researcher in Kashmir. Building warm.run and routing.run.</desc>',
    '<rect width="1200" height="630" fill="#141414"/>',
    text('zentex', 88, 100, 25, '#b0b0b0'),
    text('Kashmir, India', 899, 100, 24, '#909090'),
    '<path d="M88 140H1112M88 444H1112" stroke="#303030"/>',
    text('Adeeb Bashir', 84, 269, 80, '#e8e8e8', 'semibold'),
    text('Founder & security researcher', 88, 337, 34, '#b0b0b0'),
    mark('warm', 86, 488, '#e4ae79'),
    text('warm.run', 144, 520, 28, '#e4ae79'),
    mark('routing', 359, 488, '#b8a4e8'),
    text('routing.run', 417, 520, 28, '#b8a4e8'),
    text('zent7x.com', 949, 519, 25, '#909090'),
    '</svg>',
]
svg = '\n'.join(parts)
(PUBLIC / 'media/og-portfolio.svg').write_text(svg)
cairosvg.svg2png(bytestring=svg.encode(), write_to=str(PUBLIC / 'media/og-portfolio.png'))
print('Generated social card: 1200 × 630 SVG and PNG.')
