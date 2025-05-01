"use client";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import B1 from "../../public/images/Banner1.jpg";
import B2 from "../../public/images/Banner2.jpg";
import B3 from "../../public/images/Banner3.jpg";
import B5 from "../../public/images/Banner5.jpg";

const images = [
  B3,
  B1,
  B2,
  B5,
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
