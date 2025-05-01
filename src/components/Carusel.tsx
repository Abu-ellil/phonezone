"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllProducts } from "@/contexts/data";
import Image from "next/image";
import Link from "next/link";

function Carousel() {
  interface Product {
    id: string | number;
    name: string;
    price?: number | string;
    original_price?: number | string;
    base_price?: number | string;
    image_url: string;
  }
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = getAllProducts();
      setProducts(data.slice(0, 10));
    };
    fetchProducts();
  }, []);
  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 5,
    swipeToSlide: true,
    dots: true,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full py-6 h-80">
      <div className="container mx-auto px-4">
        <Slider {...settings}>
          {products.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="px-2 group"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-100 h-64">
                <div className="relative h-40 w-full">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="p-2"
                  />
                </div>
                <div className="p-3 text-right">
                  <h3 className="text-xs font-medium text-gray-900 line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex flex-col items-end">
                    {product.price && (
                      <span className="text-sm font-bold text-red-600">
                        {typeof product.price === "number"
                          ? product.price.toFixed(2)
                          : product.price}{" "}
                        د.إ
                      </span>
                    )}
                    {(product.original_price || product.base_price) &&
                      product.price !== product.original_price && (
                        <span className="text-xs text-gray-500 line-through">
                          {product.original_price || product.base_price} د.إ
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Carousel;
