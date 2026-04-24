import json
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

with open("D:/DEV2/phonezone/scraped_output/scraped_products.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for k, v in data.items():
    counts = [len(p.get("images", [])) for p in v]
    avg = sum(counts) / len(counts) if counts else 0
    print(f"{k}: {len(v)} products, images per product: {counts}, avg: {avg:.1f}")
    # Show first product images
    if v:
        p = v[0]
        print(f"  Example: {p['name'][:50]}")
        for i, img in enumerate(p.get("images", [])[:4]):
            print(f"    img {i+1}: {img[:80]}...")
