#!/usr/bin/env python3
"""
PhoneZone Product Scraper v2 - Uses noon.com's internal API directly
Fast, free, no API key needed, no browser required.
"""

import json
import os
import re
import sys
import time
import random
import requests
from urllib.parse import quote

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRAPED_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scraped_output")
os.makedirs(SCRAPED_DIR, exist_ok=True)

PRODUCT_SEARCHES = {
    "iPhone17ProMax": {
        "queries": ["iPhone 17 Pro Max"],
        "category": ["ابل"],
        "subcategory": "iPhone 17 Pro Max",
        "max": 6,
    },
    "iPhone17Pro": {
        "queries": ["iPhone 17 Pro"],
        "category": ["ابل"],
        "subcategory": "iPhone 17 Pro",
        "max": 6,
    },
    "iPhone16ProMax": {
        "queries": ["iPhone 16 Pro Max"],
        "category": ["ابل"],
        "subcategory": "iPhone 16 Pro Max",
        "max": 6,
    },
    "iPhone16Pro": {
        "queries": ["iPhone 16 Pro"],
        "category": ["ابل"],
        "subcategory": "iPhone 16 Pro",
        "max": 6,
    },
    "iPhone16": {
        "queries": ["iPhone 16"],
        "category": ["ابل"],
        "subcategory": "iPhone 16",
        "max": 6,
    },
    "iPhone15": {
        "queries": ["iPhone 15"],
        "category": ["ابل"],
        "subcategory": "iPhone 15",
        "max": 6,
    },
    "samsungS26": {
        "queries": ["Samsung Galaxy S26 Ultra"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S26 Ultra",
        "max": 6,
    },
    "samsungS25": {
        "queries": ["Samsung Galaxy S25 Ultra"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S25 Ultra",
        "max": 6,
    },
    "samsungS24": {
        "queries": ["Samsung Galaxy S24 Ultra"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S24 Ultra",
        "max": 6,
    },
    "samsungS23": {
        "queries": ["Samsung Galaxy S23 Ultra"],
        "category": ["جوالات-سامسونج"],
        "subcategory": "Samsung S23 Ultra",
        "max": 6,
    },
    "appleWatches": {
        "queries": ["Apple Watch Series 10", "Apple Watch Ultra"],
        "category": "ساعات ابل",
        "subcategory": "ساعات ابل",
        "max": 10,
    },
    "playstation": {
        "queries": ["PlayStation 5 console", "PS5 Pro"],
        "category": "أجهزة بلاي ستيشن",
        "subcategory": "بلاي ستيشن 5",
        "max": 8,
    },
    "playstationGames": {
        "queries": ["PS5 games"],
        "category": "أجهزة بلاي ستيشن",
        "subcategory": "ألعاب بلاي ستيشن",
        "max": 8,
    },
    "xbox": {
        "queries": ["Xbox Series X"],
        "category": "أجهزة اكس بوكس",
        "subcategory": "اكس بوكس سيريس",
        "max": 6,
    },
}

API_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "Origin": "https://www.noon.com",
    "Referer": "https://www.noon.com/",
    "x-locale": "en-sa",
    "x-currency": "SAR",
    "x-device": "web",
}


class NoonAPIScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(API_HEADERS)
        self.session.timeout = 15

    def search_api(self, query, limit=10):
        url = "https://www.noon.com/_next/data/building/explore/search"
        params = {
            "q": query,
            "limit": str(limit),
            "page": "1",
        }
        try:
            resp = self.session.get(url, params=params, timeout=15)
            if resp.status_code == 200:
                return resp.json()
        except Exception:
            pass

        url2 = "https://api.noon.com/search/api/v4/search"
        params2 = {
            "q": query,
            "limit": str(limit),
            "page": "1",
            "currency": "SAR",
            "locale": "en-sa",
        }
        try:
            resp = self.session.get(url2, params=params2, timeout=15)
            if resp.status_code == 200:
                return resp.json()
        except Exception:
            pass

        return self._scrape_html_search(query, limit)

    def _scrape_html_search(self, query, limit=10):
        url = f"https://www.noon.com/saudi-en/search/?q={quote(query)}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        try:
            resp = requests.get(url, headers=headers, timeout=15)
            if resp.status_code != 200:
                return None

            script_data = self._extract_next_data(resp.text)
            if script_data:
                return script_data

            return self._extract_json_ld(resp.text)
        except Exception as e:
            print(f"  HTML scrape error: {e}")
            return None

    def _extract_next_data(self, html):
        match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
        return None

    def _extract_json_ld(self, html):
        matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        products = []
        for m in matches:
            try:
                data = json.loads(m)
                if isinstance(data, list):
                    products.extend(data)
                elif isinstance(data, dict):
                    if data.get("@type") == "ItemList":
                        items = data.get("itemListElement", [])
                        products.extend(items)
                    elif "Product" in str(data.get("@type", "")):
                        products.append(data)
            except Exception:
                continue
        if products:
            return {"products": products}
        return None

    def _parse_products_from_api(self, data, query=""):
        products = []
        if not data:
            return products

        if isinstance(data, dict):
            for key_path in [
                ["data", "search", "hits"],
                ["data", "catalog", "products"],
                ["hits"],
                ["products"],
                ["catalog", "products"],
                ["search", "hits"],
                ["data", "products"],
                ["props", "pageProps", "search", "hits"],
                ["props", "pageProps", "catalog", "products"],
                ["props", "pageProps", "data", "hits"],
            ]:
                current = data
                try:
                    for key in key_path:
                        current = current[key]
                    if isinstance(current, list):
                        products = current
                        break
                except (KeyError, TypeError):
                    continue

            if not products:
                for key in data:
                    if isinstance(data[key], list) and len(data[key]) > 0:
                        first = data[key][0]
                        if isinstance(first, dict) and ("price" in first or "salePrice" in first or "name" in first):
                            products = data[key]
                            break

            if not products:
                products = self._deep_find_products(data)

        elif isinstance(data, list):
            products = data

        return products

    def _deep_find_products(self, data, depth=0):
        if depth > 5:
            return []
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict):
                    if any(k in item for k in ["price", "salePrice", "image_url", "offerPrice"]):
                        return data
            for item in data:
                result = self._deep_find_products(item, depth + 1)
                if result:
                    return result
        elif isinstance(data, dict):
            for v in data.values():
                result = self._deep_find_products(v, depth + 1)
                if result:
                    return result
        return []

    def normalize_product(self, raw, category_config):
        try:
            name = (
                raw.get("name") or raw.get("title") or raw.get("productName") or ""
            )
            if not name:
                return None

            price = (
                raw.get("salePrice")
                or raw.get("price")
                or raw.get("offerPrice")
                or raw.get("specialPrice")
                or raw.get("base_price")
                or 0
            )

            if isinstance(price, dict):
                price = price.get("value") or price.get("amount") or 0
            if isinstance(price, str):
                price = float(re.sub(r"[^\d.]", "", price) or "0")
            price = float(price) if price else 0

            if price == 0:
                for price_field in ["sale_price", "final_price", "priceEgp", "priceSar"]:
                    val = raw.get(price_field)
                    if val:
                        if isinstance(val, dict):
                            val = val.get("value", 0)
                        try:
                            price = float(re.sub(r"[^\d.]", "", str(val)) or "0")
                        except Exception:
                            pass
                        if price > 0:
                            break

            image_url = (
                raw.get("image_url")
                or raw.get("imageUrl")
                or raw.get("image")
                or raw.get("thumbnail")
                or raw.get("img")
                or ""
            )
            if isinstance(image_url, dict):
                image_url = image_url.get("url", "")
            if not image_url and raw.get("images"):
                imgs = raw["images"]
                if isinstance(imgs, list) and len(imgs) > 0:
                    image_url = imgs[0] if isinstance(imgs[0], str) else imgs[0].get("url", "")

            images = raw.get("images", [])
            if isinstance(images, list):
                images = [
                    img if isinstance(img, str) else img.get("url", "")
                    for img in images
                    if isinstance(img, (str, dict))
                ]
            else:
                images = [image_url] if image_url else []

            url = raw.get("url") or raw.get("productUrl") or ""
            if not url:
                sku = raw.get("sku") or raw.get("id") or raw.get("item_id") or ""
                if sku:
                    url = f"https://www.noon.com/saudi-en/{sku}"

            product_id = raw.get("id") or raw.get("sku") or raw.get("item_id") or ""
            if not product_id:
                product_id = hash(name) % 100000

            stock = "متوفر في المخزون"
            if raw.get("inStock") is False or raw.get("outOfStock") is True:
                stock = "نفذ من المخزون"

            return {
                "url": url,
                "id": str(product_id),
                "name": name,
                "warranty": "ضمان سنتين حاسبات العرب",
                "stock_status": stock,
                "image_url": image_url,
                "images": images[:5],
                "category": category_config["category"],
                "subcategory": category_config["subcategory"],
                "base_price": int(price),
                "variants": generate_variants(price, ""),
            }
        except Exception as e:
            print(f"  Normalize error: {e}")
            return None


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
        key = p.get("name", "").lower().strip()[:80]
        if key and key not in seen:
            seen.add(key)
            unique.append(p)
    return unique


def run_scraper(categories=None, dry_run=False):
    scraper = NoonAPIScraper()
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
            print(f"  Query: {query}")
            data = scraper.search_api(query, config["max"])
            raw_products = scraper._parse_products_from_api(data, query)

            for raw in raw_products:
                product = scraper.normalize_product(raw, config)
                if product and product["base_price"] > 0:
                    cat_products.append(product)

            print(f"  Found {len(raw_products)} raw products")
            time.sleep(random.uniform(2, 4))

        cat_products = deduplicate(cat_products)[:config["max"]]
        all_results[cat_key] = cat_products
        print(f"  Unique products: {len(cat_products)}")

    output_file = os.path.join(SCRAPED_DIR, "scraped_products.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print(f"\nRaw data saved to: {output_file}")

    total = sum(len(v) for v in all_results.values())
    print(f"Total products scraped: {total}")

    if not dry_run:
        generate_js_data_files(all_results)
    else:
        print("\nDry run - JS files not updated.")

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

    parser = argparse.ArgumentParser(description="PhoneZone Noon.com Product Scraper")
    parser.add_argument("--categories", nargs="*", help="Specific categories to scrape")
    parser.add_argument("--dry-run", action="store_true", help="Don't write JS files")
    args = parser.parse_args()

    print("=" * 60)
    print("  PhoneZone Product Scraper v2 - noon.com API")
    print("  Free, no API key required")
    print("=" * 60)

    run_scraper(categories=args.categories, dry_run=args.dry_run)
