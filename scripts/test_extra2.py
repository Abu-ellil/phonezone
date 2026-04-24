import requests
import re
import json
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

s = requests.Session()
s.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
})

# Try search page
r = s.get("https://www.extra.com/ar-sa/search?q=iphone+16+pro+max", timeout=15)
print(f"Search page status: {r.status_code}, length: {len(r.text)}")

# Find Unbxd in full text
unbxd_matches = re.findall(r'unbxd[A-Za-z]*["\':=\s]+["\']?([A-Za-z0-9_-]+)', r.text, re.I)
print(f"Unbxd matches: {unbxd_matches[:10]}")

# Find any API calls
api_calls = re.findall(r'["\']https?://[^"\']*?(?:api|search|product|catalog)[^"\']*["\']', r.text, re.I)
print(f"\nAPI URLs found: {len(api_calls)}")
for u in api_calls[:10]:
    print(f"  {u.strip('\"')}")

# Find product data in HTML
product_blocks = re.findall(r'data-product[^"]*="[^"]*"', r.text[:50000])
print(f"\nProduct data attrs: {len(product_blocks)}")
for p in product_blocks[:5]:
    print(f"  {p[:100]}")

# Check for product JSON in script tags
scripts = re.findall(r'<script[^>]*>([\s\S]{50,}?)</script>', r.text)
for i, sc in enumerate(scripts):
    if '"price"' in sc or '"product"' in sc or '"sku"' in sc:
        print(f"\nScript {i} has product data:")
        print(f"  {sc[:300]}")

# Try the extra.com product API
test_urls = [
    "https://www.extra.com/ar-sa/search?q=iphone&format=ajax",
    "https://www.extra.com/ar-sa/api/products?q=iphone",
]
for url in test_urls:
    try:
        r2 = s.get(url, timeout=10)
        print(f"\n{url}: {r2.status_code} ({len(r2.text)} bytes)")
        if "json" in r2.headers.get("content-type", ""):
            print(f"  {r2.text[:200]}")
    except:
        pass
