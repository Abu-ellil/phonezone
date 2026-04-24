#!/usr/bin/env python3
"""
PhoneZone Product Scraper - Uses Playwright to scrape real data from noon.com
Free, no API key required.
"""

import asyncio
import json
import os
import re
import sys
import time
import random
from urllib.parse import quote
from playwright.async_api import async_playwright

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRAPED_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scraped_output")
os.makedirs(SCRAPED_DIR, exist_ok=True)

PRODUCT_SEARCHES = {
    "iPhone17ProMax": {
        "queries": ["iPhone 17 Pro Max", "ايفون 17 برو ماكس"],
        "category": ["ابل"],
        "subcategory": "iPhone 17 Pro Max",
        "max": 6,
    },
    "iPhone17Pro": {
        "queries": ["iPhone 17 Pro", "ايفون 17 برو"],
        "category": ["ابل"],
        "subcategory": "iPhone 17 Pro",
        "max": 6,
    },
    "iPhone16ProMax": {
        "queries": ["iPhone 16 Pro Max", "ايفون 16 برو ماكس"],
        "category": ["ابل"],
        "subcategory": "iPhone 16 Pro Max",
        "max": 6,
    },
    "iPhone16Pro": {
        "queries": ["iPhone 16 Pro", "ايفون 16 برو"],
        "category": ["ابل"],
        "subcategory": "iPhone 16 Pro",
        "max": 6,
    },
    "iPhone16": {
        "queries": ["iPhone 16", "ايفون 16"],
        "category": ["ابل"],
        "subcategory": "iPhone 16",
        "max": 6,
    },
    "iPhone15": {
        "queries": ["iPhone 15", "ايفون 15"],
        "category": ["ابل"],
        "subcategory": "iPhone 15",
        "max": 6,
    },
    "samsungS26": {
        "queries": ["Samsung Galaxy S26 Ultra", "سامسونج جالاكسي S26 الترا"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S26 Ultra",
        "max": 6,
    },
    "samsungS25": {
        "queries": ["Samsung Galaxy S25 Ultra", "سامسونج جالاكسي S25 الترا"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S25 Ultra",
        "max": 6,
    },
    "samsungS24": {
        "queries": ["Samsung Galaxy S24 Ultra", "سامسونج جالاكسي S24"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S24 Ultra",
        "max": 6,
    },
    "samsungS23": {
        "queries": ["Samsung Galaxy S23 Ultra", "سامسونج جالاكسي S23"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S23 Ultra",
        "max": 6,
    },
    "appleWatches": {
        "queries": ["Apple Watch Series 10", "Apple Watch Ultra 2", "ساعة ابل"],
        "category": "ساعات ابل",
        "subcategory": "ساعات ابل",
        "max": 10,
    },
    "playstation": {
        "queries": ["PlayStation 5", "بلاي ستيشن 5", "PS5 Pro"],
        "category": "أجهزة بلاي ستيشن",
        "subcategory": "بلاي ستيشن 5",
        "max": 8,
    },
    "playstationGames": {
        "queries": ["PS5 games", "العاب بلاي ستيشن 5"],
        "category": "أجهزة بلاي ستيشن",
        "subcategory": "ألعاب بلاي ستيشن",
        "max": 8,
    },
    "xbox": {
        "queries": ["Xbox Series X", "اكس بوكس سيريس"],
        "category": "أجهزة اكس بوكس",
        "subcategory": "اكس بوكس سيريس",
        "max": 6,
    },
}


async def random_delay(min_s=2, max_s=5):
    await asyncio.sleep(random.uniform(min_s, max_s))


async def accept_cookies(page):
    try:
        cookie_btn = page.locator('button:has-text("Accept"), button:has-text("Accept All"), button:has-text("قبول")')
        if await cookie_btn.count() > 0:
            await cookie_btn.first.click()
            await asyncio.sleep(1)
    except Exception:
        pass


async def scrape_search_results(page, query, max_results=5):
    search_url = f"https://www.noon.com/saudi-en/search/?q={quote(query)}"
    print(f"  Navigating to: {search_url}")

    success = await navigate_with_retry(page, search_url)
    if not success:
        print(f"  Failed to load page after retries")
        return []
    await asyncio.sleep(3)
    await accept_cookies(page)

    products = []

    product_cards = page.locator(
        '[data-qa="product-card"], '
        '.productCard, '
        '[class*="productCard"], '
        '[class*="product-card"], '
        '[class*="ProductCard"]'
    )

    card_count = await product_cards.count()
    print(f"  Found {card_count} product cards")

    if card_count == 0:
        all_links = page.locator('a[href*="/p/"]')
        link_count = await all_links.count()
        print(f"  Found {link_count} product links")

        for i in range(min(link_count, max_results)):
            try:
                link = all_links.nth(i)
                href = await link.get_attribute("href") or ""
                text = await link.inner_text()
                img = link.locator("img").first
                img_src = ""
                try:
                    img_src = await img.get_attribute("src") or ""
                    if not img_src:
                        img_src = await img.get_attribute("data-src") or ""
                except Exception:
                    pass

                price = extract_price_from_text(text)
                name = extract_name_from_text(text)

                if name:
                    products.append({
                        "url": f"https://www.noon.com{href}" if href.startswith("/") else href,
                        "name": name,
                        "image_url": img_src,
                        "price": price,
                    })
            except Exception as e:
                print(f"  Error extracting link {i}: {e}")
                continue

        return products[:max_results]

    for i in range(min(card_count, max_results)):
        try:
            card = product_cards.nth(i)

            link_el = card.locator("a[href]").first
            href = await link_el.get_attribute("href") or ""
            full_url = f"https://www.noon.com{href}" if href.startswith("/") else href

            img_el = card.locator("img").first
            img_src = ""
            try:
                img_src = await img_el.get_attribute("src") or ""
                if not img_src or "placeholder" in img_src:
                    img_src = await img_el.get_attribute("data-src") or ""
            except Exception:
                pass

            card_text = await card.inner_text()
            name = extract_name_from_text(card_text)
            price = extract_price_from_text(card_text)

            if name:
                products.append({
                    "url": full_url,
                    "name": name,
                    "image_url": img_src,
                    "price": price,
                })
        except Exception as e:
            print(f"  Error extracting card {i}: {e}")
            continue

    return products[:max_results]


async def scrape_product_detail(page, url):
    try:
        success = await navigate_with_retry(page, url, max_retries=2)
        if not success:
            return {"images": [], "body_text": ""}
        await asyncio.sleep(2)

        images = []
        img_selectors = [
            'img[src*="nooncdn"]',
            'img[src*="cloudinary"]',
            'img[src*="product"]',
            '[class*="gallery"] img',
            '[class*="image"] img',
            '[class*="carousel"] img',
        ]
        for sel in img_selectors:
            loc = page.locator(sel)
            count = await loc.count()
            for j in range(count):
                try:
                    src = await loc.nth(j).get_attribute("src") or ""
                    if src and "logo" not in src.lower() and "icon" not in src.lower():
                        if src not in images:
                            images.append(src)
                except Exception:
                    continue
            if images:
                break

        body_text = await page.inner_text("body")

        return {
            "images": images[:5],
            "body_text": body_text[:2000],
        }
    except Exception as e:
        print(f"  Error scraping detail: {e}")
        return {"images": [], "body_text": ""}


def extract_price_from_text(text):
    price_patterns = [
        r'(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\s*(?:SAR|ر\.س|SAR\s)',
        r'(?:SAR|ر\.س)\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)',
        r'(\d{3,5}(?:\.\d{2})?)',
    ]
    for pattern in price_patterns:
        match = re.search(pattern, text)
        if match:
            price_str = match.group(1).replace(",", "").replace(" ", "")
            try:
                return float(price_str)
            except ValueError:
                continue
    return 0


def extract_name_from_text(text):
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for line in lines:
        if len(line) > 10 and not re.match(r'^[\d,.]+\s*(SAR|ر\.س)', line):
            return line[:150]
    return ""


def generate_variants(base_price, category_key):
    if "Watch" in category_key or "watch" in category_key:
        return [
            {"type": "size", "size": "41mm", "price": int(base_price)},
            {"type": "size", "size": "45mm", "price": int(base_price * 1.1)},
        ]
    elif "playstation" in category_key.lower() or "xbox" in category_key.lower():
        return [
            {"type": "edition", "size": "Standard", "price": int(base_price)},
        ]
    elif "Games" in category_key:
        return []
    else:
        return [
            {"type": "memory", "size": "256", "price": int(base_price)},
            {"type": "memory", "size": "512", "price": int(base_price * 1.15)},
            {"type": "memory", "size": "1TB", "price": int(base_price * 1.3)},
        ]


def deduplicate_products(products):
    seen = set()
    unique = []
    for p in products:
        key = p.get("name", "").lower().strip()
        if key and key not in seen:
            seen.add(key)
            unique.append(p)
    return unique


async def navigate_with_retry(page, url, max_retries=3):
    for attempt in range(max_retries):
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            return True
        except Exception as e:
            print(f"  Attempt {attempt+1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(3)
    return False


async def run_scraper(categories=None, scrape_details=False):
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--disable-http2", "--disable-blink-features=AutomationControlled"],
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            viewport={"width": 1920, "height": 1080},
            locale="en-SA",
            extra_http_headers={
                "Accept-Language": "en-SA,en;q=0.9,ar;q=0.8",
            },
        )
        page = await context.new_page()

        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        """)

        all_results = {}
        categories_to_scrape = categories or list(PRODUCT_SEARCHES.keys())

        for cat_key in categories_to_scrape:
            if cat_key not in PRODUCT_SEARCHES:
                print(f"Unknown category: {cat_key}")
                continue

            config = PRODUCT_SEARCHES[cat_key]
            print(f"\n{'='*50}")
            print(f"Scraping: {cat_key}")
            print(f"{'='*50}")

            cat_products = []
            for query in config["queries"]:
                print(f"\n  Query: {query}")
                try:
                    results = await scrape_search_results(page, query, config["max"])
                    cat_products.extend(results)
                    print(f"  Got {len(results)} products")
                except Exception as e:
                    print(f"  Error: {e}")

                await random_delay(3, 6)

            cat_products = deduplicate_products(cat_products)[:config["max"]]

            if scrape_details:
                for i, prod in enumerate(cat_products):
                    if prod.get("url"):
                        print(f"  Scraping detail {i+1}/{len(cat_products)}: {prod['name'][:50]}...")
                        detail = await scrape_product_detail(page, prod["url"])
                        if detail["images"]:
                            prod["images"] = detail["images"]
                            if not prod.get("image_url"):
                                prod["image_url"] = detail["images"][0]
                        await random_delay(2, 4)

            formatted = []
            for idx, prod in enumerate(cat_products):
                base_price = prod.get("price", 0)
                if base_price == 0:
                    continue

                formatted_prod = {
                    "url": prod.get("url", ""),
                    "id": f"{cat_key}_{idx}",
                    "name": prod.get("name", ""),
                    "warranty": "ضمان سنتين حاسبات العرب",
                    "stock_status": "متوفر في المخزون",
                    "image_url": prod.get("image_url", ""),
                    "images": prod.get("images", [prod.get("image_url", "")]),
                    "category": config["category"],
                    "subcategory": config["subcategory"],
                    "base_price": int(base_price),
                    "variants": generate_variants(base_price, cat_key),
                }
                formatted.append(formatted_prod)

            all_results[cat_key] = formatted
            print(f"\n  Total unique products for {cat_key}: {len(formatted)}")

        await browser.close()
        return all_results


def save_results(results):
    output_file = os.path.join(SCRAPED_DIR, "scraped_products.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nSaved raw results to: {output_file}")
    return output_file


def generate_js_data_files(results):
    data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "contexts", "data")

    iphone_keys = ["iPhone17ProMax", "iPhone17Pro", "iPhone16ProMax", "iPhone16Pro", "iPhone16", "iPhone15"]
    samsung_keys = ["samsungS26", "samsungS25", "samsungS24", "samsungS23"]
    playstation_keys = ["playstation", "playstationGames"]

    iphone_data = {k: results.get(k, []) for k in iphone_keys}
    samsung_data = {k: results.get(k, []) for k in samsung_keys}
    playstation_data = {
        "playstation": results.get("playstation", []),
        "playstationGames": results.get("playstationGames", []),
    }
    xbox_data = {"xbox": results.get("xbox", [])}
    apple_watches_data = results.get("appleWatches", [])

    js_files = {
        "iphone.js": iphone_data,
        "samsung.js": samsung_data,
        "playstation.js": playstation_data,
        "xbox.js": xbox_data,
        "appleWatches.js": apple_watches_data,
    }

    for filename, data in js_files.items():
        filepath = os.path.join(data_dir, filename)
        js_content = f"// Auto-generated by scraper - {time.strftime('%Y-%m-%d %H:%M')}\n"
        if isinstance(data, list):
            js_content += f"const appleWatches = {json.dumps(data, ensure_ascii=False, indent=2)};\n\nexport default appleWatches;\n"
        else:
            var_name = filename.replace(".js", "")
            if var_name == "appleWatches":
                js_content += f"const appleWatches = {json.dumps(data, ensure_ascii=False, indent=2)};\n\nexport default appleWatches;\n"
            else:
                js_content += f"// بيانات منتجات {var_name.capitalize()}\n"
                js_content += f"const {var_name}Data = {json.dumps(data, ensure_ascii=False, indent=2)};\n\nexport default {var_name}Data;\n"

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(js_content)
        print(f"Generated: {filepath}")

    print(f"\nAll JS data files updated in: {data_dir}")


async def main():
    import argparse
    parser = argparse.ArgumentParser(description="PhoneZone Noon.com Product Scraper")
    parser.add_argument("--categories", nargs="*", help="Specific categories to scrape")
    parser.add_argument("--details", action="store_true", help="Scrape product detail pages for more images")
    parser.add_argument("--dry-run", action="store_true", help="Scrape but don't write JS files")
    args = parser.parse_args()

    print("=" * 60)
    print("  PhoneZone Product Scraper - noon.com")
    print("  Free scraper using Playwright")
    print("=" * 60)

    results = await run_scraper(
        categories=args.categories,
        scrape_details=args.details,
    )

    save_results(results)

    total = sum(len(v) for v in results.values())
    print(f"\nTotal products scraped: {total}")

    if not args.dry_run:
        generate_js_data_files(results)
        print("\nDone! Your app data files have been updated.")
        print("Run 'npm run dev' to see the changes.")
    else:
        print("\nDry run - JS files not updated. Check scraped_output/ for raw data.")


if __name__ == "__main__":
    asyncio.run(main())
