import requests
import re
import json

s = requests.Session()
s.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
})

r = s.get("https://www.noon.com/saudi-en/", timeout=20)
print("Homepage status:", r.status_code)
print("Cookies:", dict(s.cookies))

r2 = s.get("https://www.noon.com/saudi-en/search/?q=iPhone+16+Pro+Max", timeout=20)
print("Search status:", r2.status_code)
print("Content length:", len(r2.text))

pattern = r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>'
m = re.search(pattern, r2.text, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    print("Found __NEXT_DATA__ keys:", list(data.keys()))
    pp = data.get("props", {}).get("pageProps", {})
    print("pageProps keys:", list(pp.keys())[:10])
else:
    print("No __NEXT_DATA__ found")
    ld = re.findall(r'<script type="application/ld\+json">(.*?)</script>', r2.text, re.DOTALL)
    print(f"Found {len(ld)} JSON-LD blocks")
    # Print first 500 chars of body
    body_start = r2.text.find("<body")
    if body_start > 0:
        snippet = r2.text[body_start:body_start+500]
        print("Body snippet:", snippet[:300])
