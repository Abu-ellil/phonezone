#!/usr/bin/env python3
"""
Product Image Search Script
Searches for real product images based on your product data.
"""

import re
import json
import webbrowser
from urllib.parse import quote_plus
from pathlib import Path


def extract_color_from_name(name):
    """Extract color information from Arabic product name."""
    color_map = {
        'أسود': 'black',
        'ابيض': 'white',
        'أبيض': 'white',
        'رمادي': 'gray',
        'سكري': 'space gray',
        'ذهبي': 'gold',
        'وردي': 'pink',
        'ازرق': 'blue',
        'أزرق': 'blue',
        'اخضر': 'green',
        'أخضر': 'green',
        'بنفسجي': 'purple',
        'طبيعي': 'natural',
        'تيتانيوم': 'titanium'
    }

    for arabic, english in color_map.items():
        if arabic in name:
            return english
    return ''


def extract_model_from_name(name):
    """Extract model information from product name."""
    # iPhone models
    iphone_match = re.search(r'ايفون\s*(\d+)\s*(?:برو\s*(?:ماكس)?)?', name)
    if iphone_match:
        model_num = iphone_match.group(1)
        if 'بروماكس' in name or 'برو ماكس' in name:
            return f"iPhone {model_num} Pro Max"
        elif 'برو' in name:
            return f"iPhone {model_num} Pro"
        else:
            return f"iPhone {model_num}"

    # Samsung models
    samsung_match = re.search(r'سامسونج\s*s?(\d+)\s*(?:الترا)?', name)
    if samsung_match:
        model_num = samsung_match.group(1)
        if 'الترا' in name or 'ترا' in name:
            return f"Samsung Galaxy S{model_num} Ultra"
        else:
            return f"Samsung Galaxy S{model_num}"

    return None


def generate_search_queries(product):
    """Generate image search queries for a product."""
    queries = []

    name = product.get('name', '')
    model = extract_model_from_name(name)
    color = extract_color_from_name(name)

    if model:
        # Official product images
        if color:
            query = f"{model} {color} official product"
        else:
            query = f"{model} official product"
        queries.append({
            'query': query,
            'source': 'Official',
            'url': generate_google_images_url(query)
        })

        # Stock photos
        if color:
            stock_query = f"{model} {color} professional product photography"
        else:
            stock_query = f"{model} professional product photography"
        queries.append({
            'query': stock_query,
            'source': 'Stock',
            'url': generate_google_images_url(stock_query)
        })

        # Real photos
        if color:
            real_query = f"{model} {color} real photo"
        else:
            real_query = f"{model} real photo"
        queries.append({
            'query': real_query,
            'source': 'Real',
            'url': generate_google_images_url(real_query)
        })

        # Apple/Samsung official
        if 'iPhone' in model:
            queries.append({
                'query': f"site:apple.com {model}",
                'source': 'Apple Official',
                'url': generate_google_images_url(f"site:apple.com {model}")
            })
        elif 'Samsung' in model:
            queries.append({
                'query': f"site:samsung.com {model}",
                'source': 'Samsung Official',
                'url': generate_google_images_url(f"site:samsung.com {model}")
            })

    return queries


def generate_google_images_url(query):
    """Generate Google Images search URL."""
    encoded_query = quote_plus(query)
    return f"https://www.google.com/search?tbm=isch&q={encoded_query}"


def generate_bing_images_url(query):
    """Generate Bing Images search URL."""
    encoded_query = quote_plus(query)
    return f"https://www.bing.com/images/search?q={encoded_query}"


def parse_js_file(file_path):
    """Parse JavaScript file to extract product data."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON objects from JS files
    # This is a simple approach - you might need to adjust based on your file structure
    products = []

    # Try to extract arrays from the file
    array_matches = re.findall(r'\[\s*\{[^]]*\}', content, re.DOTALL)

    for match in array_matches[:1]:  # Limit to avoid overwhelming results
        try:
            # Try to parse as JSON
            # Remove JavaScript comments and trailing commas
            cleaned = re.sub(r'//.*?\n', '', match)
            cleaned = re.sub(r',\s*([}\]])', r'\1', cleaned)

            # This is a simplified approach - you might need a proper JS parser
            products.append({'raw': match})
        except:
            pass

    return products


def search_product_images(product_name=None, open_browser=True, limit=5):
    """
    Search for product images.

    Args:
        product_name: Specific product name to search for (optional)
        open_browser: Whether to open search results in browser
        limit: Maximum number of products to process
    """
    base_path = Path(__file__).parent.parent
    data_dir = base_path / 'src' / 'contexts' / 'data'

    all_products = []

    # Read product data files
    js_files = ['iphone.js', 'samsung.js']  # Add more as needed

    for js_file in js_files:
        file_path = data_dir / js_file
        if file_path.exists():
            print(f"Processing {js_file}...")
            try:
                # Simple regex-based extraction
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Extract product objects (simplified)
                product_matches = re.findall(
                    r'\{\s*"url"[^}]*"name"\s*:\s*"([^"]+)"[^}]*\}',
                    content,
                    re.DOTALL
                )

                for match in product_matches[:limit]:
                    all_products.append({'name': match})

            except Exception as e:
                print(f"Error processing {js_file}: {e}")

    # Filter by product name if specified
    if product_name:
        all_products = [p for p in all_products if product_name.lower() in p['name'].lower()]

    print(f"\nFound {len(all_products)} products")

    # Generate search queries
    all_queries = []
    for i, product in enumerate(all_products[:limit], 1):
        print(f"\n{i}. {product['name']}")
        queries = generate_search_queries(product)

        for query_info in queries:
            print(f"   [{query_info['source']}] {query_info['query']}")
            print(f"   URL: {query_info['url']}")
            all_queries.append(query_info)

        if open_browser and queries:
            # Open first query in browser
            print(f"   Opening browser for {queries[0]['source']} search...")
            webbrowser.open(queries[0]['url'])

    # Save queries to file
    output_file = base_path / 'scripts' / 'image_search_queries.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_queries, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Saved {len(all_queries)} search queries to {output_file}")

    return all_queries


def search_single_product(product_name):
    """Search for images of a specific product."""
    print(f"Searching for images: {product_name}")
    queries = generate_search_queries({'name': product_name})

    if queries:
        print(f"\nOpening {len(queries)} search tabs...")
        for i, query in enumerate(queries, 1):
            print(f"{i}. [{query['source']}] {query['query']}")
            webbrowser.open(query['url'])

        return queries
    else:
        print("Could not generate search queries for this product.")
        return []


def main():
    """Main function."""
    import argparse

    parser = argparse.ArgumentParser(description='Search for product images')
    parser.add_argument('--product', '-p', help='Specific product name to search for')
    parser.add_argument('--no-browser', action='store_true', help='Don\'t open browser')
    parser.add_argument('--limit', '-l', type=int, default=10, help='Limit number of products')

    args = parser.parse_args()

    if args.product:
        search_single_product(args.product)
    else:
        search_product_images(
            open_browser=not args.no_browser,
            limit=args.limit
        )


if __name__ == '__main__':
    main()
