import requests
import json
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SITE_KEY = "ss-unbxd-auk-extra-saudi-ar-prod11541714990564"
API_KEY = "8fb45132f31d81ab46966cc135c24430"

s = requests.Session()
s.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "application/json",
})

# Try different Unbxd API URL formats
test_urls = [
    f"https://search.unbxd.io/v2/1.0/{API_KEY}/{SITE_KEY}/search?q=iphone&rows=3",
    f"https://search.unbxd.io/v2.0/{API_KEY}/{SITE_KEY}/search?q=iphone&rows=3",
    f"https://search.unbxd.io/search?apikey={API_KEY}&sitekey={SITE_KEY}&q=iphone&rows=3",
    f"https://search.unbxd.io/v2/1.0/{SITE_KEY}/{API_KEY}/search?q=iphone&rows=3",
    f"https://search.unbxd.io/v2/{API_KEY}/{SITE_KEY}/search?q=iphone&rows=3",
    f"https://search.unbxd.io/api/v1/{API_KEY}/{SITE_KEY}/search?q=iphone&rows=3",
    f"https://search.unbxd.io/api/{API_KEY}/{SITE_KEY}/search?q=iphone&rows=3",
]

for url in test_urls:
    try:
        r = s.get(url, timeout=10)
        short = url.split("search.unbxd.io")[1][:60]
        print(f"{r.status_code} - {short}")
        if r.status_code == 200:
            data = r.json()
            products = data.get("response", {}).get("products", [])
            print(f"  PRODUCTS FOUND: {len(products)}")
            if products:
                p = products[0]
                print(f"  Keys: {list(p.keys())[:15]}")
            break
    except Exception as e:
        print(f"  Error: {e}")

# Also try the extra.com internal API by checking the JS bundle
r2 = s.get("https://www.extra.com/ar-sa/search?q=iphone+16+pro+max", timeout=15)
# Find the search JS file
js_files = __import__("re").findall(r'src=["\']([^"\']*search[^"\']*\.js)', r2.text)
print(f"\nSearch JS files: {js_files[:3]}")

# Find XHR/fetch patterns
fetch_patterns = __import__("re").findall(r'fetch\(["\']([^"\']+)', r2.text[:100000])
print(f"Fetch URLs: {fetch_patterns[:5]}")

ajax_patterns = __import__("re").findall(r'\$\.(?:get|post|ajax)\(["\']([^"\']+)', r2.text[:100000])
print(f"Ajax URLs: {ajax_patterns[:5]}")

# Check for product data in the HTML itself (server-side rendered)
from bs4 import BeautifulSoup
soup = BeautifulSoup(r2.text, "html.parser")

# Check product tiles
tiles = soup.select("[data-sku], [data-productid], .product-tile, .product-item")
print(f"\nProduct tiles: {len(tiles)}")

# Check for any product names
names = soup.select(".product-name, .product__name, [class*='product-name'], [class*='productName']")
print(f"Product names: {len(names)}")
for n in names[:3]:
    print(f"  {n.get_text(strip=True)[:80]}")

# Check grid items
grid = soup.select(".grid-item, .product-grid .item, [class*='productCard']")
print(f"Grid items: {len(grid)}")

# Look at all links with product in href
product_links = soup.find_all("a", href=__import__("re").compile(r"/p/"))
print(f"Product links (/p/): {len(product_links)}")
for a in product_links[:3]:
    print(f"  {a.get('href', '')[:80]} | {a.get_text(strip=True)[:50]}")
