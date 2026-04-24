import json
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("D:/DEV2/phonezone/scraped_output/scraped_products.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for cat in ["samsungS26", "samsungS25", "samsungS24"]:
    products = data.get(cat, [])
    print(f"\n{cat}: {len(products)} products")
    for p in products:
        print(f"  SAR {p['base_price']} | {p['name'][:80]}")
