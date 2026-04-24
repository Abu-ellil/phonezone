"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { fetchCategories } from "@/api/categories";

interface Subcategory {
  name: string;
  englishName?: string;
}

interface Category {
  name: string;
  englishName?: string;
  subcategories: Subcategory[];
}

const CATEGORY_ORDER = [
  "هواتف ابل",
  "هواتف سامسونج",
  "ساعات ابل",
  "اجهزة سوني",
  "اكس بوكس",
  "اكسسوارات",
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState("");
  const { cartCount } = useCart();
  const { searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen("");
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = searchProducts(searchQuery);
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchProducts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        setLoading(false);
      } catch {
        setError("حدث خطأ في تحميل التصنيفات");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (categoryName: string) => {
    setIsDropdownOpen(isDropdownOpen === categoryName ? "" : categoryName);
  };

  const filteredCategories = categories
    .filter((c) => CATEGORY_ORDER.includes(c.name))
    .sort((a, b) => CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name));

  const renderCategoryLink = (name: string, englishName?: string) => (
    <>
      {name}{" "}
      {englishName && name !== englishName ? `(${englishName})` : ""}
    </>
  );

  return (
    <header className="sticky top-0 z-50 h-20">
      <div className="bg-white shadow-md w-full">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="فتح القائمة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center mr-4">
              <Image
                src="/logoo.png"
                alt="AliiExpress UAE"
                width={90}
                height={40}
                style={{ width: 'auto', height: 'auto' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.logo-fallback')) {
                    const span = document.createElement('span');
                    span.className = 'logo-fallback text-red-600 font-bold text-lg';
                    span.textContent = 'AliiExpress';
                    parent.appendChild(span);
                  }
                }}
              />
            </Link>

            {/* Desktop Category Navigation */}
            <nav className="hidden md:block" ref={dropdownRef}>
              <div className="container mx-auto">
                {loading ? (
                  <div className="flex justify-center py-2">
                    <span className="text-gray-500 text-sm">جاري تحميل التصنيفات...</span>
                  </div>
                ) : error ? (
                  <div className="flex justify-center py-2">
                    <span className="text-red-500 text-sm">{error}</span>
                  </div>
                ) : (
                  <ul className="flex justify-center space-x-2 space-x-reverse flex-wrap">
                    {filteredCategories.map((category) => (
                      <li key={category.name} className="relative group">
                        <div
                          className="py-2 px-2 text-center cursor-pointer text-gray-700 hover:text-red-600 flex items-center"
                          onClick={() => toggleCategory(category.name)}
                        >
                          <span className="text-xs">{category.name}</span>
                          {category.subcategories.length > 0 && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                        {isDropdownOpen === category.name && category.subcategories.length > 0 && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50" style={{ touchAction: "none" }}>
                            <Link
                              href={`/category/${encodeURIComponent(category.name)}`}
                              className="block px-4 py-2 text-right text-gray-700 hover:bg-red-600 hover:text-white font-bold border-b border-gray-200"
                              onClick={() => setIsDropdownOpen("")}
                            >
                              كل منتجات {category.name}
                            </Link>
                            {category.subcategories.map((subcategory) => (
                              <Link
                                key={subcategory.name}
                                href={`/category/${encodeURIComponent(category.name)}/${encodeURIComponent(subcategory.name)}`}
                                className="block px-4 py-2 text-right text-gray-700 hover:bg-red-600 hover:text-white"
                                onClick={() => setIsDropdownOpen("")}
                              >
                                {renderCategoryLink(subcategory.name, subcategory.englishName)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </nav>

            {/* Cart */}
            <div className="flex items-center gap-2">
              <nav className="flex items-center space-x-6 space-x-reverse">
                <Link
                  href="/cart"
                  className="flex items-center hover:text-red-600 text-gray-500 border border-b-gray-400 p-2 rounded-sm relative"
                  aria-label="سلة التسوق"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </nav>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            ref={menuRef}
            className={`md:hidden fixed top-[80px] right-0 bottom-0 w-3/4 bg-white z-50 border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ direction: "rtl" }}
          >
            <div className="p-4">
              {/* Search */}
              <div className="relative w-full mb-6">
                <input
                  type="text"
                  placeholder="ابحث عن منتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-right"
                />
                <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" aria-label="بحث">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 z-50 mt-1 max-h-64 overflow-y-auto">
                    {searchResults.map((product: any) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <div className="flex-1 text-right">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.price} د.إ</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-3 pr-2">الفئات</h3>

              {loading ? (
                <div className="flex justify-center py-4">
                  <span className="text-gray-500">جاري تحميل التصنيفات...</span>
                </div>
              ) : error ? (
                <div className="flex justify-center py-4">
                  <span className="text-red-500">{error}</span>
                </div>
              ) : (
                <nav className="flex flex-col space-y-1 text-right">
                  {filteredCategories.map((category) => (
                    <div key={category.name} className="border-b border-gray-100 pb-2">
                      <div className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-red-600 px-2">
                        <Link
                          href={`/category/${encodeURIComponent(category.name)}`}
                          className="flex-grow text-right"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {renderCategoryLink(category.name, category.englishName)}
                        </Link>
                        {category.subcategories.length > 0 && (
                          <button onClick={() => toggleCategory(category.name)} className="p-1" aria-label={`فتح ${category.name}`}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 transform transition-transform ${isDropdownOpen === category.name ? "rotate-180" : ""}`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {isDropdownOpen === category.name && category.subcategories.length > 0 && (
                        <div className="mt-1 space-y-1 pr-6 bg-gray-50 rounded-md py-2">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.name}
                              href={`/category/${encodeURIComponent(category.name)}/${encodeURIComponent(subcategory.name)}`}
                              className="block py-1.5 px-2 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {renderCategoryLink(subcategory.name, subcategory.englishName)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
