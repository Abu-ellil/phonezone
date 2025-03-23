"use client";
import { useState } from "react";
import { getProducts } from "@/utils/data";
import Image from "next/image";
import Link from "next/link";
import { getDualCurrencyPrice } from "@/utils/currency";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: number;
  name: string;
  image_url: string;
  base_price: number;
  variants?: {
    type: string;
    size: string;
    price: number;
  }[];
  category: string[];
  subcategory?: string;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const products = getProducts();
    const filteredProducts = products.filter((product) => {
      const searchLower = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        (product.category &&
          product.category.some((cat) =>
            cat.toLowerCase().includes(searchLower)
          )) ||
        (product.subcategory &&
          product.subcategory.toLowerCase().includes(searchLower))
      );
    });

    setSearchResults(filteredProducts);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="component-base secondary">
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="ابحث عن منتجات..."
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] text-right"
                autoFocus
              />
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-end gap-2">
                      {product.variants ? (
                        <span className="text-sm font-medium text-primary">
                          {
                            getDualCurrencyPrice(
                              product.variants[0].price.toString()
                            ).aed
                          }
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-primary">
                          {
                            getDualCurrencyPrice(product.base_price.toString())
                              .aed
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد نتائج للبحث
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
