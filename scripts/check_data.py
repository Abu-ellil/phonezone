import json
with open("D:/DEV2/phonezone/scraped_output/scraped_products.json", "r", encoding="utf-8") as f:
    data = json.load(f)
for k, v in data.items():
    print(f"{k}: {len(v)} products")
    for p in v[:3]:
        name = p["name"][:60]
        price = p["base_price"]
        print(f"  - {name}... SAR {price}")
    if len(v) > 3:
        print(f"  ... and {len(v)-3} more")
