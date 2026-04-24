# Noon.com Product Scraper - Portfolio Edition

## 🎯 Purpose
Scrape specific products from noon.com for your portfolio/mock e-commerce website.

## 📋 Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Run the scraper:**
```bash
python scrape_noon_products.py
```

## 🚀 Usage

### Quick Start (Pre-configured Products)
The script comes pre-configured with your 7 target products:
- iPhone 17 Pro Max
- Samsung S26 Ultra  
- iPhone 17 Pro
- iPhone 16 Pro Max
- Samsung S25 Ultra
- Apple Watch Series 10
- PlayStation 5

Just run: `python scrape_noon_products.py`

### Custom Products
Edit the `products_to_scrape` list in the `main()` function:

```python
products_to_scrape = [
    {
        'query': 'Your Product Name',
        'category': 'category-name',
        'subcategory': 'Subcategory Name',
        'output_key': 'variableName'
    }
]
```

## 📦 Output

The script generates:
1. **`scraped_products.json`** - Raw scraped data
2. **JavaScript code snippets** - Ready to paste into your React context files
3. **Console output** - Progress updates and formatted code

## 🔧 Integration

### Option 1: Manual Integration
1. Run the scraper
2. Copy the JavaScript snippets from console output
3. Paste into your existing data files:
   - `src/contexts/data/iphone.js`
   - `src/contexts/data/samsung.js`
   - `src/contexts/data/playstation.js`
   - `src/contexts/data/appleWatches.js`

### Option 2: Automatic Integration
The JSON output can be automatically converted to JavaScript format.

## ⚠️ Important Notes

- **For Portfolio Use Only** - This is for educational/mock projects
- **Rate Limiting** - Script includes delays to be respectful
- **Image URLs** - May expire; consider downloading images for long-term use
- **Data Accuracy** - Always verify scraped data

## 🛠️ Troubleshooting

**No products found?**
- noon.com may have changed their HTML structure
- Try running during different times (rate limiting)
- Check if the site is accessible

**Images not loading?**
- noon.com image URLs may be protected/temporary
- Consider downloading images locally for your portfolio

## 📝 Example Output

```javascript
const iPhone17ProMax = [
  {
    "url": "https://www.noon.com/...",
    "id": 12345,
    "name": "iPhone 17 Pro Max - 256GB",
    "warranty": "ضمان سنتين حاسبات العرب",
    "stock_status": "متوفر في المخزون",
    "image_url": "https://f.nooncdn.com/...",
    "category": ["ابل"],
    "subcategory": "iPhone 17 Pro Max",
    "base_price": 5800,
    "variants": [...]
  }
];
```

## 🚀 Next Steps

1. Run the scraper
2. Review the output data
3. Update your existing product files
4. Test your website with new real product data
5. Download images locally if needed for long-term hosting

---

**Portfolio Best Practice:** For a professional portfolio, consider adding a note that this is mock data for demonstration purposes.