"""Regenerates public/og.png, apple-touch-icon.png and favicon-32.png.
Run once after changing the design: python3 scripts/assets/render-assets.py
Requires: pip install playwright && playwright install chromium
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

here = Path(__file__).resolve().parent
public = here.parent.parent / "public"

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1200, "height": 630})
    pg.goto((here / "og.html").as_uri())
    pg.wait_for_timeout(400)
    pg.screenshot(path=str(public / "og.png"))
    svg = (public / "favicon.svg").read_text()
    for size, name in [(180, "apple-touch-icon.png"), (32, "favicon-32.png")]:
        pg = b.new_page(viewport={"width": size, "height": size})
        pg.set_content(f'<html><body style="margin:0;background:#090a0d">{svg.replace("<svg ", f"<svg width={size} height={size} ")}</body></html>')
        pg.screenshot(path=str(public / name), omit_background=False)
    b.close()
print("assets written")
