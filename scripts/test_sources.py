import requests
import re
import json

s = requests.Session()
s.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
})

# Test Amazon
try:
    r = s.get("https://www.amazon.sa/s?k=iPhone+16+Pro+Max", timeout=15)
    print(f"Amazon.sa status: {r.status_code}, length: {len(r.text)}")
except Exception as e:
    print(f"Amazon.sa error: {e}")

# Test GSMArena
try:
    r = s.get("https://www.gsmarena.com/apple_iphone_16_pro_max-12871.php", timeout=15)
    print(f"GSMArena status: {r.status_code}, length: {len(r.text)}")
except Exception as e:
    print(f"GSMArena error: {e}")

# Test eBay
try:
    r = s.get("https://www.ebay.com/sch/i.html?_nkw=iPhone+16+Pro+Max", timeout=15)
    print(f"eBay status: {r.status_code}, length: {len(r.text)}")
except Exception as e:
    print(f"eBay error: {e}")

# Test BestBuy
try:
    r = s.get("https://www.bestbuy.com/site/searchpage.jsp?st=iPhone+16+Pro+Max", timeout=15)
    print(f"BestBuy status: {r.status_code}, length: {len(r.text)}")
except Exception as e:
    print(f"BestBuy error: {e}")
