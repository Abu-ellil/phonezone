import requests
import re
import json
import sys
from bs4 import BeautifulSoup
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

s = requests.Session()
s.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ar-SA,ar;q=0.9,en;q=0.8",
})

# Try category pages
category_urls = [
    "https://www.extra.com/ar-sa/mobiles/apple-iphone/c/2-20/",
    "https://www.extra.com/ar-sa/mobiles/samsung/c/2-6/",
    "https://www.extra.com/ar-sa/gaming/playstation/c/4-2/",
]

for url in category_urls:
    r = s.get(url, timeout=15)
    print(f"\n{'='*50}")
    print(f"URL: {url}")
    print(f"Status: {r.status_code}, Length: {len(r.text)}")

    soup = BeautifulSoup(r.text, "html.parser")

    # Find product elements
    product_links = soup.find_all("a", href=re.compile(r"/p/"))
    # Dedup by href
    seen = set()
    unique_links = []
    for a in product_links:
        href = a.get("href", "")
        if href not in seen:
            seen.add(href)
            unique_links.append(a)

    print(f"Unique product links: {len(unique_links)}")
    for a in unique_links[:5]:
        name = a.get_text(strip=True)
        href = a.get("href", "")
        # Get price from nearby element
        parent = a.parent
        price_el = None
        for _ in range(5):
            if parent:
                price_el = parent.select_one("[class*='price'], [class*='Price']")
                if price_el:
                    break
                parent = parent.parent
        price = price_el.get_text(strip=True) if price_el else "N/A"
        print(f"  {name[:60]} | {price} | {href[:60]}")

    # Look for GTM/datalayer product data
    scripts = soup.find_all("script")
    for script in scripts:
        text = script.string or ""
        if "price" in text.lower() and ("product" in text.lower() or "name" in text.lower()) and len(text) > 100:
            # Find JSON product data
            matches = re.findall(r'"name"\s*:\s*"([^"]+)".*?"price"\s*:\s*"?([^",\s]+)', text)
            if matches:
                print(f"\n  GTM product data ({len(matches)} items):")
                for name, price in matches[:5]:
                    print(f"    {name[:50]} = {price}")
                break
