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
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
})

r = s.get("https://www.amazon.sa/s?k=Samsung+Galaxy+S26+Ultra&language=en", timeout=15)
soup = BeautifulSoup(r.text, "html.parser")

# Try different selectors
results = soup.select('[data-component-type="s-search-result"]')
print(f"data-component-type results: {len(results)}")

results2 = soup.select(".s-result-item")
print(f"s-result-item: {len(results2)}")

results3 = soup.select("[data-asin]")
print(f"data-asin: {len(results3)}")

# Check for CAPTCHA or blocking
title = soup.select_one("title")
print(f"\nTitle: {title.get_text() if title else 'N/A'}")

# Check if blocked
if "captcha" in r.text.lower() or "robot" in r.text.lower():
    print("BLOCKED - CAPTCHA detected!")

# Try getting product names from any element
h2s = soup.find_all("h2")
print(f"\nH2 elements: {len(h2s)}")
for h in h2s[:10]:
    text = h.get_text(strip=True)
    if text:
        print(f"  {text[:80]}")
