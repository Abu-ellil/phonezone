#!/usr/bin/env python3
"""
Simple Product Scraper - Fallback Version
Uses alternative approaches for scraping
"""

import sys
import json
from urllib.parse import quote

def create_mock_product_data():
    """Create realistic mock data based on noon.com product patterns"""
    products = {
        "iPhone17ProMax": [
            {
                "url": "https://www.noon.com/saudi-en/iphone-17-pro-max-256gb-natural-titanium/",
                "id": 200,
                "name": "iPhone 17 Pro Max - Natural Titanium",
                "warranty": "ضمان سنتين حاسبات العرب",
                "stock_status": "متوفر في المخزون",
                "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=800&fit=crop"
                ],
                "category": ["ابل"],
                "subcategory": "iPhone 17 Pro Max",
                "base_price": 5800,
                "variants": [
                    {"type": "memory", "size": "256", "price": 5800},
                    {"type": "memory", "size": "512", "price": 6300},
                    {"type": "memory", "size": "تيرا", "price": 6800}
                ]
            }
        ],
        "samsungS26": [
            {
                "url": "https://www.noon.com/saudi-en/samsung-galaxy-s26-ultra-5g/",
                "id": 300,
                "name": "Samsung Galaxy S26 Ultra - Black",
                "warranty": "ضمان سنتين حاسبات العرب",
                "stock_status": "متوفر في المخزون",
                "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop"
                ],
                "category": ["سامسونج"],
                "subcategory": "Samsung S26 Ultra",
                "base_price": 5200,
                "variants": [
                    {"type": "memory", "size": "256", "price": 5200},
                    {"type": "memory", "size": "512", "price": 5700},
                    {"type": "memory", "size": "تيرا", "price": 6700}
                ]
            }
        ],
        "iPhone17Pro": [
            {
                "url": "https://www.noon.com/saudi-en/iphone-17-pro-256gb/",
                "id": 204,
                "name": "iPhone 17 Pro - White Titanium",
                "warranty": "ضمان سنتين حاسبات العرب",
                "stock_status": "متوفر في المخزون",
                "image_url": "https://res.cloudinary.com/masoft/image/upload/v1743030537/mbnna0sduouklh7tivvt.jpg",
                "images": [
                    "https://res.cloudinary.com/masoft/image/upload/v1743030537/mbnna0sduouklh7tivvt.jpg",
                    "https://res.cloudinary.com/masoft/image/upload/v1743030536/curjlevkxbnylefvows4.jpg"
                ],
                "category": ["ابل"],
                "subcategory": "iPhone 17 Pro",
                "base_price": 4800,
                "variants": [
                    {"type": "memory", "size": "256", "price": 4800},
                    {"type": "memory", "size": "512", "price": 5300},
                    {"type": "memory", "size": "تيرا", "price": 5800}
                ]
            }
        ],
        "iPhone16ProMax": [
            {
                "url": "https://www.noon.com/saudi-en/iphone-16-pro-max-256gb/",
                "id": 4,
                "name": "iPhone 16 Pro Max - White Titanium",
                "warranty": "ضمان سنتين حاسبات العرب",
                "stock_status": "متوفر في المخزون",
                "image_url": "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=400&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop"
                ],
                "category": ["ابل"],
                "subcategory": "iPhone 16 Pro Max",
                "base_price": 4200,
                "variants": [
                    {"type": "memory", "size": "256", "price": 4200},
                    {"type": "memory", "size": "512", "price": 4700},
                    {"type": "memory", "size": "تيرا", "price": 5200}
                ]
            }
        ],
        "samsungS25": [
            {
                "url": "https://www.noon.com/saudi-en/samsung-galaxy-s25-ultra-5g/",
                "id": 106,
                "name": "Samsung Galaxy S25 Ultra - Black",
                "warranty": "ضمان سنتين حاسبات العرب",
                "stock_status": "متوفر في المخزون",
                "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop"
                ],
                "category": ["جوالات-سامسونج"],
                "subcategory": "Samsung S25 Ultra",
                "base_price": 4200,
                "variants": [
                    {"type": "memory", "size": "256", "price": 4200},
                    {"type": "memory", "size": "512", "price": 4700},
                    {"type": "memory", "size": "تيرا", "price": 5700}
                ]
            }
        ],
        "appleWatches": [
            {
                "url": "https://www.noon.com/saudi-en/apple-watch-series-10/",
                "id": 500,
                "name": "Apple Watch Series 10 - Aluminum Case",
                "warranty": "ضمان سنة واحدة أبل",
                "stock_status": "متوفر في المخزون",
                "image_url": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop"
                ],
                "category": ["ابل"],
                "subcategory": "Apple Watch",
                "base_price": 1800,
                "variants": [
                    {"type": "size", "size": "41mm", "price": 1800},
                    {"type": "size", "size": "45mm", "price": 2000}
                ]
            }
        ],
        "playstation": [
            {
                "url": "https://www.noon.com/saudi-en/playstation-5-console/",
                "id": 600,
                "name": "PlayStation 5 Console - Standard Edition",
                "warranty": "ضمان سنة واحدة سوني",
                "stock_status": "متوفر في المخزون",
                "image_url": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=800&fit=crop"
                ],
                "category": ["بلايستيشن"],
                "subcategory": "PlayStation 5",
                "base_price": 2100,
                "variants": [
                    {"type": "edition", "size": "Standard", "price": 2100},
                    {"type": "edition", "size": "Digital", "price": 1800}
                ]
            }
        ]
    }
    return products

def main():
    print("Product Data Generator for Portfolio")
    print("=" * 40)

    # Generate mock product data
    products = create_mock_product_data()

    # Save to JSON
    output_file = 'products_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"Data saved to {output_file}")

    # Generate JavaScript files
    for key, product_list in products.items():
        js_content = f"const {key} = {json.dumps(product_list, ensure_ascii=False, indent=2)};\n\nexport default {{ {key} }};"

        js_file = f'{key}.js'
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(js_content)

        print(f"Created: {js_file}")

    print("\n" + "=" * 40)
    print("Product data files generated successfully!")
    print("You can now use these files in your React project.")

if __name__ == "__main__":
    main()