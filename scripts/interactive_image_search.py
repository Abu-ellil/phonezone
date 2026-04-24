#!/usr/bin/env python3
"""
Interactive Product Image Search
Simple interactive tool to search for product images.
"""

import webbrowser
from urllib.parse import quote_plus


def extract_product_info(arabic_name):
    """Extract model and color from Arabic product name."""
    # Model extraction
    model = None
    if 'ايفون' in arabic_name:
        if '17 بروماكس' in arabic_name:
            model = 'iPhone 17 Pro Max'
        elif '17 برو' in arabic_name:
            model = 'iPhone 17 Pro'
        elif '16 بروماكس' in arabic_name:
            model = 'iPhone 16 Pro Max'
        elif '16 برو' in arabic_name:
            model = 'iPhone 16 Pro'
        elif '15 بروماكس' in arabic_name:
            model = 'iPhone 15 Pro Max'
        elif '14 بروماكس' in arabic_name:
            model = 'iPhone 14 Pro Max'
    elif 'سامسونج' in arabic_name:
        if 'S26' in arabic_name and 'الترا' in arabic_name:
            model = 'Samsung Galaxy S26 Ultra'
        elif 'S25' in arabic_name and 'الترا' in arabic_name:
            model = 'Samsung Galaxy S25 Ultra'
        elif 'S24' in arabic_name and 'الترا' in arabic_name:
            model = 'Samsung Galaxy S24 Ultra'

    # Color extraction
    color_map = {
        'أسود': 'Black',
        'ابيض': 'White',
        'أبيض': 'White',
        'رمادي': 'Gray',
        'سكري': 'Space Gray',
        'ذهبي': 'Gold',
        'وردي': 'Pink',
        'ازرق': 'Blue',
        'أزرق': 'Blue',
        'اخضر': 'Green',
        'أخضر': 'Green',
        'بنفسجي': 'Purple',
        'طبيعي': 'Natural Titanium'
    }

    color = ''
    for arabic, english in color_map.items():
        if arabic in arabic_name:
            color = english
            break

    return model, color


def create_search_urls(model, color):
    """Create image search URLs for a product."""
    urls = []

    if not model:
        return urls

    # Build search query
    if color:
        query = f"{model} {color}"
    else:
        query = model

    # Google Images - Official
    urls.append({
        'name': f'Google Images - {query} Official',
        'url': f"https://www.google.com/search?tbm=isch&q={quote_plus(query + ' official product')}"
    })

    # Google Images - Stock Photos
    urls.append({
        'name': f'Google Images - {query} Stock',
        'url': f"https://www.google.com/search?tbm=isch&q={quote_plus(query + ' professional product photography')}"
    })

    # Official site search
    if 'iPhone' in model:
        urls.append({
            'name': f'Apple Official - {model}',
            'url': f"https://www.google.com/search?tbm=isch&q={quote_plus(f'site:apple.com {model}')}"
        })
    elif 'Samsung' in model:
        urls.append({
            'name': f'Samsung Official - {model}',
            'url': f"https://www.google.com/search?tbm=isch&q={quote_plus(f'site:samsung.com {model}')}"
        })

    return urls


def main():
    """Interactive main function."""
    print("=" * 60)
    print("Product Image Search Tool")
    print("=" * 60)
    print("\nEnter product names in Arabic to search for images")
    print("Examples:")
    print("  - ايفون 17 بروماكس - تيتانيوم أسود")
    print("  - سامسونج S26 الترا أبيض")
    print("\nType 'quit' to exit")
    print("=" * 60)

    while True:
        print("\n" + "-" * 60)
        product_name = input("Enter product name (or 'quit'): ").strip()

        if product_name.lower() in ['quit', 'exit', 'q']:
            print("\nGoodbye! 👋")
            break

        if not product_name:
            continue

        # Extract product info
        model, color = extract_product_info(product_name)

        if not model:
            print(f"❌ Could not identify product model from: {product_name}")
            print("   Try using the full product name from your data")
            continue

        print(f"\n📱 Detected Model: {model}")
        print(f"🎨 Detected Color: {color if color else 'Not specified'}")

        # Create search URLs
        search_urls = create_search_urls(model, color)

        if not search_urls:
            print("❌ Could not generate search URLs")
            continue

        print(f"\n🔍 Found {len(search_urls)} search options:")
        for i, url_info in enumerate(search_urls, 1):
            print(f"   {i}. {url_info['name']}")
            print(f"      {url_info['url']}")

        # Ask if user wants to open searches
        choice = input("\nOpen searches in browser? (y/n): ").strip().lower()

        if choice in ['y', 'yes', 'Y']:
            print(f"\n🌐 Opening {len(search_urls)} browser tabs...")
            for url_info in search_urls:
                webbrowser.open(url_info['url'])
            print("✓ Done! Check your browser")
        else:
            print("\nSearch URLs generated but not opened.")
            print("You can copy the URLs above and use them manually")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nGoodbye! 👋")
    except Exception as e:
        print(f"\n❌ Error: {e}")
