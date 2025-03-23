"use client";
import Link from "next/link";
import { useState } from "react";
import { getCategories } from "@/utils/data";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import SearchModal from "./SearchModal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount } = useCart();

  // Get categories and filter out duplicates by name
  const allCategories = getCategories();
  const uniqueCategoryNames = new Set();
  const categories = allCategories.filter((category) => {
    if (uniqueCategoryNames.has(category.name)) {
      return false;
    }
    uniqueCategoryNames.add(category.name);
    return true;
  });

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
            <div className="hidden md:block text-white">
              <div className="container mx-auto px-4">
                <ul className="flex justify-center space-x-8 space-x-reverse flex-wrap">
                  {categories.map((category) => (
                    <li key={category.name} className="relative group">
                      <div className="py-3 text-center cursor-pointer text-gray-700 hover:text-gray-200 flex items-center">
                        <Link
                          href={`/category/${encodeURIComponent(
                            category.name
                          )}`}
                          className="flex items-center"
                        >
                          <span>{category.name}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
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
                        </Link>
                      </div>
                      {isDropdownOpen === category.name && (
                        <div
                          className="absolute right-0 z-10 w-48 py-2 bg-white rounded-lg shadow-xl border border-gray-200 
               max-h-60 overflow-y-auto"
                          style={{ touchAction: "none" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.name}
                              href={`/category/${encodeURIComponent(
                                category.name
                              )}/${encodeURIComponent(subcategory.name)}`}
                              className="block px-4 py-2 text-right text-gray-700 hover:bg-[#3498db] hover:text-white"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
            <div className="relative w-full mb-4">
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
            <nav className="flex flex-col space-y-4 text-right">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="border-b border-gray-200 pb-2"
                >
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-[#3498db] pr-20 pl-4"
                  >
                    <Link
                      href={`/category/${encodeURIComponent(category.name)}`}
                      className="flex items-center justify-between w-full"
                    >
                      <span>{category.name}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transform transition-transform ${
                          isDropdownOpen === category.name ? "rotate-180" : ""
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
                    </Link>
                  </button>
                  {isDropdownOpen === category.name && (
                    <div className="mt-2 space-y-2 pr-4">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          href={`/category/${encodeURIComponent(
                            category.name
                          )}/${encodeURIComponent(subcategory.name)}`}
                          className="block py-1 text-gray-600 hover:text-[#3498db]"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
