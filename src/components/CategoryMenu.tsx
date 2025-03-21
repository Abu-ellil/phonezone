"use client";
import { useState } from "react";
import Link from "next/link";

interface Subcategory {
  name: string;
  url: string;
  route: string;
  id: string;
}

interface Category {
  name: string;
  url: string;
  route: string;
  subcategories: Subcategory[];
}

interface CategoryMenuProps {
  categories: Category[];
}

export default function CategoryMenu({ categories }: CategoryMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleCategory = (categoryName: string) => {
    if (activeCategory === categoryName) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryName);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {categories.map((category) => (
          <li key={category.name} className="relative">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full px-4 py-2 text-right text-gray-700 hover:bg-gray-50 flex justify-between items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transform transition-transform ${
                  activeCategory === category.name ? "rotate-180" : ""
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
              <span>{category.name}</span>
            </button>
            {activeCategory === category.name && (
              <div className="bg-gray-50">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/category/${encodeURIComponent(
                      category.name
                    )}/${encodeURIComponent(subcategory.name)}`}
                    className="block px-6 py-2 text-right text-gray-600 hover:bg-gray-100"
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
  );
}
