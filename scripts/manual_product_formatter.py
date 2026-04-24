#!/usr/bin/env python3
"""
Manual Product Data Formatter
Helps format product data manually from noon.com for your portfolio
"""

import json

def create_product_template():
    """Create a template for manual product entry"""
    template = {
        "url": "",
        "id": 0,
        "name": "",
        "warranty": "ضمان سنتين حاسبات العرب",
        "stock_status": "متوفر في المخزون",
        "image_url": "",
        "images": [],
        "category": [],
        "subcategory": "",
        "base_price": 0,
        "variants": []
    }
    return template

def format_product_data(
    name, url, image_url, price, category, subcategory,
    warranty="ضمان سنتين حاسبات العرب",
    stock_status="متوفر في المخزون",
    additional_images=None
):
    """Format product data in your React structure"""
    product_id = hash(url) % 10000  # Generate ID from URL

    variants = [
        {'type': 'memory', 'size': '256', 'price': price},
        {'type': 'memory', 'size': '512', 'price': int(price * 1.15)},
        {'type': 'memory', 'size': 'تيرا', 'price': int(price * 1.25)}
    ]

    images = [image_url]
    if additional_images:
        images.extend(additional_images)

    return {
        'url': url,
        'id': product_id,
        'name': name,
        'warranty': warranty,
        'stock_status': stock_status,
        'image_url': image_url,
        'images': images,
        'category': [category],
        'subcategory': subcategory,
        'base_price': price,
        'variants': variants
    }

def generate_javascript_code(products_data, variable_name):
    """Generate JavaScript code from formatted data"""
    js_code = f"const {variable_name} = {json.dumps(products_data, ensure_ascii=False, indent=2)};\n\nexport default {{ {variable_name} }};"
    return js_code

def main():
    """Interactive manual product entry"""
    print("🛒 Manual Product Data Formatter")
    print("=" * 40)

    products = []

    while True:
        print(f"\n📱 Product {len(products) + 1}")
        template = create_product_template()

        name = input("Product name (or 'done' to finish): ")
        if name.lower() == 'done':
            break

        url = input("Product URL from noon.com: ")
        image_url = input("Main image URL: ")
        price = int(input("Base price (SAR): "))
        category = input("Category (ابل/سامسونج/etc): ")
        subcategory = input("Subcategory: ")

        # Ask for additional images
        additional_images = []
        while True:
            extra_img = input("Additional image URL (or press Enter to continue): ")
            if not extra_img:
                break
            additional_images.append(extra_img)

        product = format_product_data(
            name=name,
            url=url,
            image_url=image_url,
            price=price,
            category=category,
            subcategory=subcategory,
            additional_images=additional_images if additional_images else None
        )

        products.append(product)
        print(f"✅ Added: {name}")

    if products:
        variable_name = input("\nEnter variable name (e.g., iPhone17ProMax): ")

        # Save to JSON
        with open(f'{variable_name}.json', 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)

        # Generate JavaScript
        js_code = generate_javascript_code(products, variable_name)

        # Save JavaScript
        with open(f'{variable_name}.js', 'w', encoding='utf-8') as f:
            f.write(js_code)

        print(f"\n✅ Files created:")
        print(f"   - {variable_name}.json")
        print(f"   - {variable_name}.js")
        print(f"\n📋 JavaScript code to copy:")
        print("=" * 40)
        print(js_code)
        print("=" * 40)

if __name__ == "__main__":
    main()