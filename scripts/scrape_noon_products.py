#!/usr/bin/env python3
"""
Noon.com Product Scraper for Portfolio Projects
Scrapes specific products and their images from noon.com
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, quote
from typing import List, Dict, Optional
import os

class NoonProductScraper:
    def __init__(self):
        self.base_url = "https://www.noon.com"
        self.search_url = "https://www.noon.com/saudi-en/search/?q="
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        })

    def search_products(self, query: str, max_results: int = 5) -> List[Dict]:
        """Search for products on noon.com"""
        try:
            search_url = f"{self.search_url}{quote(query)}"
            response = self.session.get(search_url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')
            products = []

            # Find product cards
            product_cards = soup.find_all('div', class_='productCard') or \
                           soup.find_all('div', attrs={'data-qa': 'product-card'})

            for card in product_cards[:max_results]:
                product_data = self.extract_product_data(card)
                if product_data:
                    products.append(product_data)

            return products

        except Exception as e:
            print(f"Error searching for {query}: {str(e)}")
            return []

    def extract_product_data(self, product_card) -> Optional[Dict]:
        """Extract product data from a product card"""
        try:
            # Extract product URL
            product_link = product_card.find('a', href=True)
            if not product_link:
                return None

            product_url = urljoin(self.base_url, product_link['href'])

            # Extract product name
            name_elem = product_link.find('div', class_='name') or \
                       product_link.find('span', attrs={'data-qa': 'product-name'})
            name = name_elem.get_text(strip=True) if name_elem else "Unknown Product"

            # Extract price
            price_elem = product_card.find('span', class_='price') or \
                        product_card.find('span', attrs={'data-qa': 'product-price'})
            price = self.extract_price(price_elem) if price_elem else 0

            # Extract image URL
            img_elem = product_card.find('img')
            image_url = img_elem.get('src') or img_elem.get('data-src') if img_elem else ""

            # Extract stock status
            stock_elem = product_card.find('span', class_='stock') or \
                        product_card.find('div', attrs={'data-qa': 'stock-status'})
            stock_status = stock_elem.get_text(strip=True) if stock_elem else "متوفر في المخزون"

            # Generate product ID from URL
            product_id = self.generate_product_id(product_url)

            return {
                'url': product_url,
                'id': product_id,
                'name': name,
                'image_url': image_url,
                'stock_status': stock_status,
                'base_price': price,
                'variants': self.generate_variants(price)
            }

        except Exception as e:
            print(f"Error extracting product data: {str(e)}")
            return None

    def extract_price(self, price_elem) -> int:
        """Extract numeric price from price element"""
        try:
            price_text = price_elem.get_text(strip=True)
            # Remove currency symbols and extract numbers
            price_match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
            if price_match:
                return int(float(price_match.group()) * 1.2)  # Convert to SAR roughly
            return 0
        except:
            return 0

    def generate_product_id(self, url: str) -> int:
        """Generate product ID from URL"""
        # Extract numbers from URL to create ID
        numbers = re.findall(r'\d+', url)
        return int(numbers[-1]) if numbers else hash(url) % 10000

    def generate_variants(self, base_price: int) -> List[Dict]:
        """Generate memory variants based on base price"""
        variants = [
            {'type': 'memory', 'size': '256', 'price': base_price},
            {'type': 'memory', 'size': '512', 'price': int(base_price * 1.15)},
            {'type': 'memory', 'size': 'تيرا', 'price': int(base_price * 1.25)}
        ]
        return variants

    def get_product_details(self, product_url: str) -> Optional[Dict]:
        """Get detailed product information from product page"""
        try:
            response = self.session.get(product_url, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract all product images
            images = []
            img_elements = soup.find_all('img', src=re.compile(r'noon|product'))
            for img in img_elements[:5]:  # Get up to 5 images
                img_url = img.get('src') or img.get('data-src')
                if img_url and 'noon' in img_url:
                    images.append(img_url)

            # Extract warranty info
            warranty_elem = soup.find('div', text=re.compile(r'warranty|ضمان', re.I))
            warranty = warranty_elem.get_text(strip=True) if warranty_elem else "ضمان سنتين حاسبات العرب"

            # Extract description
            desc_elem = soup.find('div', class_='description') or \
                       soup.find('div', attrs={'data-qa': 'product-description'})
            description = desc_elem.get_text(strip=True) if desc_elem else ""

            return {
                'images': images,
                'warranty': warranty,
                'description': description
            }

        except Exception as e:
            print(f"Error getting product details: {str(e)}")
            return None

    def format_for_react(self, products: List[Dict], category: str, subcategory: str) -> Dict:
        """Format scraped data for React/JavaScript context"""
        formatted_products = []

        for product in products:
            # Get additional details if URL exists
            details = self.get_product_details(product['url']) if product.get('url') else {}

            formatted_product = {
                'url': product.get('url', ''),
                'id': product.get('id', 0),
                'name': product.get('name', ''),
                'warranty': details.get('warranty', 'ضمان سنتين حاسبات العرب'),
                'stock_status': product.get('stock_status', 'متوفر في المخزون'),
                'image_url': product.get('image_url', ''),
                'images': details.get('images', [product.get('image_url', '')]),
                'category': [category],
                'subcategory': subcategory,
                'base_price': product.get('base_price', 0),
                'variants': product.get('variants', [])
            }
            formatted_products.append(formatted_product)
            time.sleep(2)  # Be respectful to the server

        return formatted_products

    def scrape_specific_products(self, product_queries: List[Dict]) -> Dict:
        """Scrape multiple specific products"""
        all_scraped_data = {}

        for query_data in product_queries:
            query = query_data['query']
            category = query_data['category']
            subcategory = query_data['subcategory']
            output_key = query_data['output_key']

            print(f"Searching for: {query}")
            products = self.search_products(query, max_results=3)

            if products:
                formatted_products = self.format_for_react(products, category, subcategory)
                all_scraped_data[output_key] = formatted_products
                print(f"Found {len(formatted_products)} products for {query}")
            else:
                print(f"No products found for {query}")

            time.sleep(3)  # Be respectful between searches

        return all_scraped_data

def main():
    """Main function to scrape specific products"""
    scraper = NoonProductScraper()

    # Define the specific products you want to scrape
    products_to_scrape = [
        {
            'query': 'iPhone 17 Pro Max',
            'category': 'ابل',
            'subcategory': 'iPhone 17 Pro Max',
            'output_key': 'iPhone17ProMax'
        },
        {
            'query': 'Samsung S26 Ultra',
            'category': 'سامسونج',
            'subcategory': 'Samsung S26 Ultra',
            'output_key': 'samsungS26'
        },
        {
            'query': 'iPhone 17 Pro',
            'category': 'ابل',
            'subcategory': 'iPhone 17 Pro',
            'output_key': 'iPhone17Pro'
        },
        {
            'query': 'iPhone 16 Pro Max',
            'category': 'ابل',
            'subcategory': 'iPhone 16 Pro Max',
            'output_key': 'iPhone16ProMax'
        },
        {
            'query': 'Samsung S25 Ultra',
            'category': 'جوالات-سامسونج',
            'subcategory': 'Samsung S25 Ultra',
            'output_key': 'samsungS25'
        },
        {
            'query': 'Apple Watch Series 10',
            'category': 'ابل',
            'subcategory': 'Apple Watch',
            'output_key': 'appleWatches'
        },
        {
            'query': 'PlayStation 5',
            'category': 'بلايستيشن',
            'subcategory': 'PlayStation 5',
            'output_key': 'playstation'
        }
    ]

    # Scrape the products
    scraped_data = scraper.scrape_specific_products(products_to_scrape)

    # Save to JSON file
    output_file = 'scraped_products.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(scraped_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Scraping complete! Data saved to {output_file}")
    print(f"📊 Total categories scraped: {len(scraped_data)}")

    # Generate JavaScript code snippet
    print("\n" + "="*50)
    print("📝 JAVASCRIPT CODE SNIPPET:")
    print("="*50)
    for key, products in scraped_data.items():
        if products:
            print(f"\n// {key}:")
            print(f"const {key} = {json.dumps(products, ensure_ascii=False, indent=2)};")
            print(f"\nexport default {{ {key} }};")

if __name__ == "__main__":
    main()