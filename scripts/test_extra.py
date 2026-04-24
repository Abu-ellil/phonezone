import requests
import re
import json

s = requests.Session()
s.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ar-SA,ar;q=0.9,en;q=0.8",
})

# Test homepage
r = s.get("https://www.extra.com/ar-sa/", timeout=15)
print(f"Homepage status: {r.status_code}, length: {len(r.text)}")

# Test search
r2 = s.get("https://www.extra.com/ar-sa/iphone-16-pro-max/c/", timeout=15)
print(f"Category page status: {r2.status_code}, length: {len(r2.text)}")

# Check for __NEXT_DATA__
m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r2.text, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    print("Found __NEXT_DATA__!")
    pp = data.get("props", {}).get("pageProps", {})
    print("pageProps keys:", list(pp.keys())[:15])
else:
    print("No __NEXT_DATA__")

# Check for API calls pattern
api_patterns = re.findall(r'(https?://[^\s"\']+api[^\s"\']*)', r2.text[:5000])
if api_patterns:
    print(f"Found {len(api_patterns)} API URLs")
    for u in api_patterns[:5]:
        print(f"  {u[:100]}")

# Check for JSON data in scripts
scripts = re.findall(r'<script[^>]*>(.*?)</script>', r2.text[:50000], re.DOTALL)
print(f"\nFound {len(scripts)} scripts in first 50k chars")
for i, sc in enumerate(scripts[:10]):
    if "product" in sc.lower() or "price" in sc.lower() or "data" in sc.lower()[:50]:
        print(f"  Script {i}: {sc[:200]}")
