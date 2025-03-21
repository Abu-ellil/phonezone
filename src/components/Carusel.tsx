"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getProducts } from "@/utils/data";
import Image from "next/image";
import Link from "next/link";
import { getDualCurrencyPrice } from "@/utils/currency";

function Carousel() {
  const products = getProducts().slice(0, 10);
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
                      <span className="text-sm font-bold text-blue-600">
                        {getDualCurrencyPrice(product.price).aed}
                      </span>
                    )}
                    {product.original_price &&
                      product.price !== product.original_price && (
                        <span className="text-xs text-gray-500 line-through">
                          {getDualCurrencyPrice(product.original_price).aed}
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
