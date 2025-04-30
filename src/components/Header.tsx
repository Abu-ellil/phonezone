"use client";
import { useState, useEffect } from "react";
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState("");
  const { cartCount } = useCart();
  const { xboxProducts, appleWatchesProducts } = useProducts();

  // Get categories from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("حدث خطأ في تحميل التصنيفات");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (categoryName: string) => {
    if (isDropdownOpen === categoryName) {
      setIsDropdownOpen("");
    } else {
      setIsDropdownOpen(categoryName);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-20">
      {/* Top header with logo, search and cart */}
      <div className="bg-white shadow-md w-full">
        <div className="max-w-[1200px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo */}

            <Link href="/" className="flex items-center mr-4">
              <Image src="/logoo.png" alt="Logo" width={90} height={40} />
            </Link>
            {/* Category Navigation Bar */}
            <nav className="hidden md:block">
              <div className="container mx-auto">
                {loading ? (
                  <div className="flex justify-center py-2">
                    <span className="text-gray-500 text-sm">
                      جاري تحميل التصنيفات...
                    </span>
                  </div>
                ) : error ? (
                  <div className="flex justify-center py-2">
                    <span className="text-red-500 text-sm">
                      حدث خطأ في تحميل التصنيفات
                    </span>
                  </div>
                ) : (
                  <ul className="flex justify-center space-x-2 space-x-reverse flex-wrap">
                    {categories
                      .filter((category) =>
                        [
                          "هواتف ابل",
                          "هواتف سامسونج",
                          "ساعات ابل",
                          "اجهزة سوني",
                          "اكس بوكس",
                          "اكسسوارات",
                        ].includes(category.name)
                      )
                      .sort((a, b) => {
                        const order = [
                          "هواتف ابل",
                          "هواتف سامسونج",
                          "ساعات ابل",
                          "اجهزة سوني",
                          "اكس بوكس",
                          "اكسسوارات",
                        ];
                        return order.indexOf(a.name) - order.indexOf(b.name);
                      })
                      .map((category) => (
                        <li key={category.name} className="relative group">
                          <div
                            className="py-2 px-2 text-center cursor-pointer text-gray-700 hover:text-[#3498db] flex items-center"
                            onClick={() => toggleCategory(category.name)}
                          >
                            <span className="text-xs">
                              {category.name}{" "}
                              {category.englishName &&
                              category.name !== category.englishName
                                ? ``
                                : ""}
                            </span>
                            {category.subcategories.length > 0 && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            )}
                          </div>
                          {isDropdownOpen === category.name &&
                            category.subcategories.length > 0 && (
                              <div
                                className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50"
                                style={{ touchAction: "none" }}
                              >
                                <Link
                                  href={`/category/${encodeURIComponent(
                                    category.name
                                  )}`}
                                  className="block px-4 py-2 text-right text-gray-700 hover:bg-[#3498db] hover:text-white font-bold border-b border-gray-200"
                                  onClick={() => setIsDropdownOpen("")}
                                >
                                  كل منتجات {category.name}
                                </Link>
                                {category.subcategories.map(
                                  (subcategory: {
                                    name: string;
                                    englishName?: string;
                                  }) => (
                                    <Link
                                      key={subcategory.name}
                                      href={`/category/${encodeURIComponent(
                                        category.name
                                      )}/${encodeURIComponent(
                                        subcategory.name
                                      )}`}
                                      className="block px-4 py-2 text-right text-gray-700 hover:bg-[#3498db] hover:text-white"
                                      onClick={() => setIsDropdownOpen("")}
                                    >
                                      {subcategory.name}{" "}
                                      {subcategory.englishName &&
                                      subcategory.name !==
                                        subcategory.englishName
                                        ? `(${subcategory.englishName})`
                                        : ""}
                                    </Link>
                                  )
                                )}
                              </div>
                            )}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </nav>
            <div className="flex items-center gap-2">
              {/* Navigation */}
              <nav className="flex items-center space-x-6 space-x-reverse">
                <Link
                  href="/cart"
                  className="flex items-center hover:text-[#3498db] text-gray-500 border border-b-gray-400 p-2 rounded-sm relative"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
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
            className={`md:hidden fixed top-[80px] right-0 bottom-0 w-3/4 bg-white z-50 border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ direction: "rtl" }}
          >
            <div className="p-4">
              <div className="relative w-full mb-6">
                <input
                  type="text"
                  placeholder="ابحث عن منتجات..."
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-right"
                />
                <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-3 pr-2">
                الفئات
              </h3>

              {loading ? (
                <div className="flex justify-center py-4">
                  <span className="text-gray-500">جاري تحميل التصنيفات...</span>
                </div>
              ) : error ? (
                <div className="flex justify-center py-4">
                  <span className="text-red-500">
                    حدث خطأ في تحميل التصنيفات
                  </span>
                </div>
              ) : (
                <nav className="flex flex-col space-y-1 text-right">
                  {categories
                    .filter((category) =>
                      [
                        "هواتف ابل",
                        "هواتف سامسونج",
                        "ساعات ابل",
                        "اجهزة سوني",
                        "اكس بوكس",
                        "اكسسوارات",
                      ].includes(category.name)
                    )
                    .sort((a, b) => {
                      const order = [
                        "هواتف ابل",
                        "هواتف سامسونج",
                        "ساعات ابل",
                        "اجهزة سوني",
                        "اكس بوكس",
                        "اكسسوارات",
                      ];
                      return order.indexOf(a.name) - order.indexOf(b.name);
                    })
                    .map((category) => (
                      <div
                        key={category.name}
                        className="border-b border-gray-100 pb-2"
                      >
                        <div className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-[#3498db] px-2">
                          <Link
                            href={`/category/${encodeURIComponent(
                              category.name
                            )}`}
                            className="flex-grow text-right"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {category.name}{" "}
                            {category.englishName &&
                            category.name !== category.englishName
                              ? `(${category.englishName})`
                              : ""}
                          </Link>
                          {category.subcategories.length > 0 && (
                            <button
                              onClick={() => toggleCategory(category.name)}
                              className="p-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 transform transition-transform ${
                                  isDropdownOpen === category.name
                                    ? "rotate-180"
                                    : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                        {isDropdownOpen === category.name &&
                          category.subcategories.length > 0 && (
                            <div className="mt-1 space-y-1 pr-6 bg-gray-50 rounded-md py-2">
                              {category.subcategories.map(
                                (subcategory: {
                                  name: string;
                                  englishName?: string;
                                }) => (
                                  <Link
                                    key={subcategory.name}
                                    href={`/category/${encodeURIComponent(
                                      category.name
                                    )}/${encodeURIComponent(subcategory.name)}`}
                                    className="block py-1.5 px-2 text-sm text-gray-600 hover:text-[#3498db] hover:bg-gray-100 rounded-md transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {subcategory.name}{" "}
                                    {subcategory.englishName &&
                                    subcategory.name !== subcategory.englishName
                                      ? `(${subcategory.englishName})`
                                      : ""}
                                  </Link>
                                )
                              )}
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
