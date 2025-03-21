"use client";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";

const images = [
  "https://res.cloudinary.com/masoft/image/upload/v1742340087/00_2_qgs319.jpg",
  "https://res.cloudinary.com/masoft/image/upload/v1742340091/Banner4_qisert.jpg",
  "https://res.cloudinary.com/masoft/image/upload/v1742340091/Banner1_uir2hs.jpg",
  "https://res.cloudinary.com/masoft/image/upload/v1742340091/Banner3_ib99zt.jpg",
  "https://res.cloudinary.com/masoft/image/upload/v1742340090/Banner2_sleqgq.jpg",
];

const responsive = {
  all: {
    breakpoint: { max: 4000, min: 0 },
    items: 1, // يعرض صورة واحدة فقط
  },
};

export default function BannerSlider() {
  return (
    <div className="w-full">
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000} // مدة العرض 3 ثواني
        showDots={true} // النقاط السفلية
        arrows={true} // الأسهم للتنقل
      >
        {images.map((src, index) => (
          <div key={index} className="w-full h-[400px] relative">
            <Image
              src={src}
              alt={`Banner ${index + 1}`}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
