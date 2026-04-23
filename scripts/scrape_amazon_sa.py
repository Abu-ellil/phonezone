#!/usr/bin/env python3
"""
PhoneZone Product Scraper v3 - Amazon.sa + GSMArena
Scrapes real product data with SAR prices.
Free, no API key required.
"""

import json
import os
import re
import sys
import time
import random
import requests
from urllib.parse import quote, urljoin
from bs4 import BeautifulSoup

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRAPED_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scraped_output")
os.makedirs(SCRAPED_DIR, exist_ok=True)

PRODUCT_SEARCHES = {
    "iPhone17ProMax": {
        "queries": ["iPhone 17 Pro Max 256GB", "iPhone 17 Pro Max 512GB"],
        "category": ["ابل"],
        "subcategory": "iPhone 17 Pro Max",
        "max": 8,
    },
    "iPhone17Pro": {
        "queries": ["iPhone 17 Pro 256GB", "iPhone 17 Pro 512GB"],
        "category": ["ابل"],
        "subcategory": "iPhone 17 Pro",
        "max": 8,
    },
    "iPhone16ProMax": {
        "queries": ["iPhone 16 Pro Max 256GB", "iPhone 16 Pro Max 512GB"],
        "category": ["ابل"],
        "subcategory": "iPhone 16 Pro Max",
        "max": 8,
    },
    "iPhone16Pro": {
        "queries": ["iPhone 16 Pro 256GB", "iPhone 16 Pro 128GB"],
        "category": ["ابل"],
        "subcategory": "iPhone 16 Pro",
        "max": 8,
    },
    "iPhone16": {
        "queries": ["iPhone 16 128GB Apple", "iPhone 16 256GB Apple"],
        "category": ["ابل"],
        "subcategory": "iPhone 16",
        "max": 8,
    },
    "iPhone15": {
        "queries": ["iPhone 15 128GB Apple", "iPhone 15 256GB"],
        "category": ["ابل"],
        "subcategory": "iPhone 15",
        "max": 8,
    },
    "samsungS26": {
        "queries": ["Samsung Galaxy S26 Ultra 256GB", "Samsung Galaxy S26 Ultra 512GB", "Samsung S26 Ultra"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S26 Ultra",
        "max": 8,
    },
    "samsungS25": {
        "queries": ["Samsung Galaxy S25 Ultra 256GB", "Samsung Galaxy S25 Ultra 512GB", "Samsung S25 Ultra"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S25 Ultra",
        "max": 8,
    },
    "samsungS24": {
        "queries": ["Samsung Galaxy S24 Ultra 256GB", "Samsung Galaxy S24 Ultra 512GB", "Samsung S24 Ultra"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S24 Ultra",
        "max": 8,
    },
    "samsungS23": {
        "queries": ["Samsung Galaxy S23 Ultra 256GB", "Samsung Galaxy S23 Ultra 512GB", "Samsung S23 Ultra"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S23 Ultra",
        "max": 8,
    },
    "appleWatches": {
        "queries": ["Apple Watch Series 10 42mm", "Apple Watch Series 10 46mm", "Apple Watch Ultra 2", "Apple Watch SE"],
        "category": "ساعات ابل",
        "subcategory": "ساعات ابل",
        "max": 12,
    },
    "playstation": {
        "queries": ["PlayStation 5 console disc", "PlayStation 5 Slim", "PS5 Pro console"],
        "category": "أجهزة بلاي ستيشن",
        "subcategory": "بلاي ستيشن 5",
        "max": 10,
    },
    "playstationGames": {
        "queries": ["PS5 game FIFA", "PS5 game Spider-Man", "PS5 game disc"],
        "category": "أجهزة بلاي ستيشن",
        "subcategory": "ألعاب بلاي ستيشن",
        "max": 10,
    },
    "xbox": {
        "queries": ["Xbox Series X 1TB", "Xbox Series S 512GB"],
        "category": "أجهزة اكس بوكس",
        "subcategory": "اكس بوكس سيريس",
        "max": 8,
    },
}


def clean_name(name):
    name = re.sub(r"SAR\s*[\d,]+\.?\d*", "", name)
    name = re.sub(r"\b\d+\s*x\s*\d+\s*Interest with \w+", "", name)
    half = len(name) // 2
    if half > 15 and name[:half].strip() == name[half:].strip():
        name = name[:half].strip()
    parts = name.split(".  .")
    if len(parts) > 1 and len(parts[0]) > 10:
        name = parts[0]
    name = re.sub(r"\s{2,}", " ", name).strip()
    return name


class AmazonSAScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
        })

    def search(self, query, max_results=10):
        url = f"https://www.amazon.sa/s?k={quote(query)}&language=en"
        try:
            resp = self.session.get(url, timeout=20)
            if resp.status_code != 200:
                return []

            soup = BeautifulSoup(resp.text, "html.parser")
            products = []

            results = soup.select('[data-component-type="s-search-result"]')
            if not results:
                results = soup.select(".s-result-item")

            for item in results[:max_results]:
                try:
                    product = self._parse_search_item(item)
                    if product and product.get("name") and product.get("price", 0) > 0:
                        products.append(product)
                except Exception:
                    continue

            return products
        except Exception as e:
            print(f"  Amazon search error: {e}")
            return []

    def _parse_search_item(self, item):
        name = ""
        h2 = item.select_one("h2")
        if h2:
            name = h2.get_text(" ", strip=True)

        if not name or len(name) < 10:
            for selector in [
                ".a-text-normal",
                ".s-line-clamp-2",
                "a span.a-size-base-plus",
                "a span.a-text-normal",
            ]:
                els = item.select(selector)
                full = " ".join(el.get_text(strip=True) for el in els if el.get_text(strip=True))
                if len(full) > len(name):
                    name = full

        name = clean_name(name)

        link_el = item.select_one("h2 a") or item.select_one("a.a-link-normal")
        url = ""
        if link_el and link_el.get("href"):
            href = link_el["href"]
            if href.startswith("/"):
                url = "https://www.amazon.sa" + href.split("/ref=")[0]
            else:
                url = href.split("/ref=")[0] if "/ref=" in href else href

        img_el = item.select_one(".s-image")
        image_url = ""
        if img_el:
            image_url = (
                img_el.get("data-old-hires")
                or img_el.get("srcset", "").split()[-2] if img_el.get("srcset") else ""
            )
            if not image_url:
                image_url = img_el.get("src", "")
            image_url = re.sub(r"_AC_UY\d+_", "_AC_UY400_", image_url)

        price = 0
        price_whole = item.select_one(".a-price .a-price-whole")
        price_fraction = item.select_one(".a-price .a-price-fraction")
        if price_whole:
            whole = re.sub(r"[^\d]", "", price_whole.get_text())
            frac = re.sub(r"[^\d]", "", price_fraction.get_text()) if price_fraction else "0"
            try:
                price = float(f"{whole}.{frac}")
            except ValueError:
                pass

        if price == 0:
            price_el = item.select_one(".a-price .a-offscreen")
            if price_el:
                price_text = price_el.get_text()
                price_match = re.search(r"[\d,]+\.?\d*", price_text)
                if price_match:
                    try:
                        price = float(price_match.group().replace(",", ""))
                    except ValueError:
                        pass

        asin = item.get("data-asin", "") or ""

        return {
            "name": name,
            "url": url,
            "image_url": image_url,
            "price": price,
            "asin": asin,
        }

    def get_product_details(self, url):
        try:
            resp = self.session.get(url, timeout=15)
            if resp.status_code != 200:
                return {}

            soup = BeautifulSoup(resp.text, "html.parser")

            images = []
            for img in soup.select("#imageBlock img, .image .img, [data-a-image-name='landingImage']"):
                src = img.get("data-old-hires") or img.get("src", "")
                if src and "media-amazon" in src:
                    images.append(src)
            if not images:
                for img in soup.select("img[data-a-dynamic-image]"):
                    src = img.get("data-old-hires") or img.get("src", "")
                    if src and "media-amazon" in src:
                        images.append(src)

            desc = ""
            desc_el = soup.select_one("#productDescription") or soup.select_one("#feature-bullets")
            if desc_el:
                desc = desc_el.get_text(strip=True)[:500]

            return {"images": images[:4], "description": desc}
        except Exception:
            return {}


def generate_variants(base_price, category_key):
    base = int(base_price)
    if base == 0:
        return []
    if "Watch" in category_key or "watch" in category_key:
        return [
            {"type": "size", "size": "41mm", "price": base},
            {"type": "size", "size": "45mm", "price": int(base * 1.1)},
        ]
    elif "playstation" in category_key.lower() or "xbox" in category_key.lower():
        return [{"type": "edition", "size": "Standard", "price": base}]
    elif "Games" in category_key:
        return []
    else:
        return [
            {"type": "memory", "size": "256", "price": base},
            {"type": "memory", "size": "512", "price": int(base * 1.15)},
            {"type": "memory", "size": "1TB", "price": int(base * 1.3)},
        ]


def deduplicate(products):
    seen = set()
    unique = []
    for p in products:
        if not p:
            continue
        name = p.get("name", "").lower()
        if "renewed" in name or "refurbished" in name:
            continue
        key = re.sub(r"[^a-z0-9]", "", name[:120])
        if len(key) > 5 and key not in seen:
            seen.add(key)
            unique.append(p)
    return unique


def run_scraper(categories=None, dry_run=False, with_details=False):
    scraper = AmazonSAScraper()
    categories = categories or list(PRODUCT_SEARCHES.keys())
    all_results = {}

    for cat_key in categories:
        if cat_key not in PRODUCT_SEARCHES:
            print(f"Unknown category: {cat_key}")
            continue

        config = PRODUCT_SEARCHES[cat_key]
        print(f"\n{'='*50}")
        print(f"Scraping: {cat_key}")
        print(f"{'='*50}")

        cat_products = []
        for query in config["queries"]:
            print(f"  Searching: {query}")
            results = scraper.search(query, config["max"])
            print(f"  Found {len(results)} results")

            for raw in results:
                product = {
                    "url": raw.get("url", ""),
                    "id": raw.get("asin", "") or str(hash(raw.get("name", "")) % 100000),
                    "name": raw.get("name", ""),
                    "warranty": "ضمان سنتين حاسبات العرب",
                    "stock_status": "متوفر في المخزون",
                    "image_url": raw.get("image_url", ""),
                    "images": [raw.get("image_url", "")],
                    "category": config["category"],
                    "subcategory": config["subcategory"],
                    "base_price": int(raw.get("price", 0)),
                    "variants": generate_variants(raw.get("price", 0), cat_key),
                }
                if product["base_price"] > 0:
                    cat_products.append(product)

            time.sleep(random.uniform(2, 5))

        if with_details:
            for i, prod in enumerate(cat_products):
                if prod.get("url"):
                    print(f"  Getting images {i+1}/{len(cat_products)}: {prod['name'][:50]}...")
                    details = scraper.get_product_details(prod["url"])
                    if details.get("images"):
                        prod["images"] = details["images"]
                        if not prod["image_url"]:
                            prod["image_url"] = details["images"][0]
                    if len(prod["images"]) < 4:
                        base_img = prod.get("image_url", "")
                        while len(prod["images"]) < 4 and base_img:
                            prod["images"].append(base_img)
                    time.sleep(random.uniform(1.5, 3))

        cat_products = deduplicate(cat_products)[:config["max"]]
        all_results[cat_key] = cat_products
        print(f"  Unique products: {len(cat_products)}")

    output_file = os.path.join(SCRAPED_DIR, "scraped_products.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print(f"\nRaw data saved to: {output_file}")

    total = sum(len(v) for v in all_results.values())
    print(f"Total products scraped: {total}")

    if not dry_run and total > 0:
        generate_js_data_files(all_results)
    elif dry_run:
        print("\nDry run - JS files not updated.")
    else:
        print("\nNo products found - JS files not updated.")

    return all_results


def generate_js_data_files(results):
    data_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "src", "contexts", "data"
    )

    iphone_keys = ["iPhone17ProMax", "iPhone17Pro", "iPhone16ProMax", "iPhone16Pro", "iPhone16", "iPhone15"]
    samsung_keys = ["samsungS26", "samsungS25", "samsungS24", "samsungS23"]

    iphone_data = {k: results.get(k, []) for k in iphone_keys}
    samsung_data = {k: results.get(k, []) for k in samsung_keys}
    playstation_data = {
        "playstation": results.get("playstation", []),
        "playstationGames": results.get("playstationGames", []),
    }
    xbox_data = {"xbox": results.get("xbox", [])}
    apple_watches = results.get("appleWatches", [])

    files = {
        "iphone.js": ("iphoneData", iphone_data),
        "samsung.js": ("samsungData", samsung_data),
        "playstation.js": ("playstationData", playstation_data),
        "xbox.js": ("xboxData", xbox_data),
    }

    for filename, (var_name, data) in files.items():
        filepath = os.path.join(data_dir, filename)
        js = f"// Auto-generated by scraper - {time.strftime('%Y-%m-%d %H:%M')}\n"
        js += f"const {var_name} = {json.dumps(data, ensure_ascii=False, indent=2)};\n\n"
        js += f"export default {var_name};\n"
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(js)
        print(f"  Generated: {filename}")

    watches_path = os.path.join(data_dir, "appleWatches.js")
    js = f"// Auto-generated by scraper - {time.strftime('%Y-%m-%d %H:%M')}\n"
    js += f"const appleWatches = {json.dumps(apple_watches, ensure_ascii=False, indent=2)};\n\n"
    js += f"export default appleWatches;\n"
    with open(watches_path, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"  Generated: appleWatches.js")

    print(f"\nAll JS data files updated!")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="PhoneZone Product Scraper - Amazon.sa")
    parser.add_argument("--categories", nargs="*", help="Specific categories to scrape")
    parser.add_argument("--dry-run", action="store_true", help="Don't write JS files")
    parser.add_argument("--with-details", action="store_true", help="Scrape product detail pages for more images")
    args = parser.parse_args()

    print("=" * 60)
    print("  PhoneZone Product Scraper v3 - Amazon.sa")
    print("  Free, no API key required")
    print("=" * 60)

    run_scraper(categories=args.categories, dry_run=args.dry_run, with_details=args.with_details)
