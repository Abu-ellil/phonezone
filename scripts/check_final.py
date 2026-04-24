import json
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("D:/DEV2/phonezone/scraped_output/scraped_products.json", "r", encoding="utf-8") as f:
    data = json.load(f)

total = 0
for k, v in data.items():
    total += len(v)
    print(f"{k}: {len(v)} products")
    for p in v[:3]:
        name = p["name"][:70]
        print(f"  SAR {p['base_price']:>6} | {name}")
    if len(v) > 3:
        print(f"  ... +{len(v)-3} more")

print(f"\nTOTAL: {total} products")
