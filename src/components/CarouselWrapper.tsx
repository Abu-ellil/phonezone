"use client";

import { ReactNode, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 5 },
  desktop: { breakpoint: { max: 1024, min: 768 }, items: 4 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
};

// تعريف الـ props بشكل صريح
interface CarouselWrapperProps {
  title: string;
  children: ReactNode;
}

const CarouselWrapper: React.FC<CarouselWrapperProps> = ({
  title,
  children,
}) => {
  const carouselRef = useRef<Carousel | null>(null);

  if (!children || (Array.isArray(children) && children.length === 0))
    return null;

  return (
    <div className="relative w-full py-4">
      {/* العنوان مع الأزرار */}
      <div className="flex items-center justify-between mb-2 px-4">
        <button
          className="component-base secondary p-2"
          onClick={() => carouselRef.current?.previous(1)}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-red-600">{title}</h2>

        <button
          className="component-base secondary p-2"
          onClick={() => carouselRef.current?.next(1)}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* الكاروسيل */}
      <Carousel
        ref={carouselRef}
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={3000}
        infinite={true}
        arrows={false}
        itemClass="px-2"
        containerClass="py-2"
      >
        {children}
      </Carousel>
    </div>
  );
};

export default CarouselWrapper;
