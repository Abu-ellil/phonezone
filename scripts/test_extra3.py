import requests
import re
import json
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

s = requests.Session()
s.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.360",
})

r = s.get("https://www.extra.com/ar-sa/search?q=iphone+16+pro+max", timeout=15)
text = r.text

# Find Unbxd config
for pattern in [
    r'unbxdSiteName\s*[=:]\s*["\']([^"\']+)',
    r'unbxdSiteKey\s*[=:]\s*["\']([^"\']+)',
    r'unbxdApiKey\s*[=:]\s*["\']([^"\']+)',
    r'siteName\s*[=:]\s*["\']([^"\']*extra[^"\']*)',
    r'SiteName\s*[=:]\s*["\']([^"\']+)',
    r'unbxd.*?key\s*[=:]\s*["\']([^"\']+)',
    r'unbxd.*?site\s*[=:]\s*["\']([^"\']+)',
    r'apiKey\s*[=:]\s*["\']([a-f0-9]+)',
]:
    m = re.findall(pattern, text, re.I)
    if m:
        print(f"Pattern '{pattern[:30]}': {m[:3]}")

# Look for config object
unbxd_config = re.search(r'unbxd(?:Config|Settings|Init)?\s*[=:]\s*\{([^}]+)\}', text, re.I)
if unbxd_config:
    print(f"\nUnbxd config: {unbxd_config.group(0)[:300]}")

# The SDK URL has the site name
sdk_match = re.search(r'ss-unbxd-auk-([^/]+)/', text)
if sdk_match:
    site_key = sdk_match.group(1)
    print(f"\nSite key from SDK URL: {site_key}")

# Try searching for the API key near Unbxd references
unbxd_blocks = re.findall(r'.{0,100}unbxd.{0,200}', text, re.I)
for b in unbxd_blocks[:5]:
    clean = re.sub(r'\s+', ' ', b)
    print(f"\n  Block: {clean[:200]}")

# Try the Unbxd search directly with common keys
# Pattern: https://search.unbxd.io/v2/1.0/{apikey}/{sitekey}/search
test_sites = [
    "ss-unbxd-auk-extra-saudi-ar-prod11541714990564",
    "extra-saudi-ar-prod11541714990564",
    "extra-saudi-ar-prod",
]

for sk in test_sites:
    url = f"https://search.unbxd.io/v2/1.0/{sk}/{sk}/search?q=iphone&rows=2&lang=ar"
    try:
        r2 = s.get(url, timeout=10)
        print(f"\n  {sk}: {r2.status_code}")
        if r2.status_code == 200:
            data = r2.json()
            print(f"  KEYS: {list(data.keys())}")
            break
    except Exception as e:
        print(f"\n  {sk}: {e}")

# Try the extra.com API
for path in [
    "https://api.extra.com/v1/products?search=iphone",
    "https://api.extra.com/products?search=iphone",
]:
    try:
        r3 = s.get(path, timeout=10)
        print(f"\n{path}: {r3.status_code} - {r3.headers.get('content-type','?')[:50]}")
        if r3.status_code == 200:
            print(f"  {r3.text[:200]}")
    except Exception as e:
        print(f"\n{path}: {e}")
