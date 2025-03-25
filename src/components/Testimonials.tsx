"use client";

import { useState } from "react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  location?: string;
  rating: number;
  comment: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "امنه عبيد",
    location: "",
    rating: 5,
    comment: "مره حلوه سماعه",
    image: "/images/avatar_male.png",
  },
  {
    id: 2,
    name: "علي العربي",
    rating: 5,
    comment:
      "افضل متجر تعاملت معه والله افخم متجر و ما قد معي ثلث ايام الا و المنتج واصلني و جوده جدا جيده والسعر رخيص انصح بالتعامل معه",
  },
  {
    id: 3,
    name: "عمر عيسوي",
    location: " ",
    rating: 5,
    comment:
      "توصيل سريع وخدمة ممتازة وسعر منافس بإختصار من افضل المتاجر الي تعاملت معهم",
  },
  {
    id: 4,
    name: "بيان فيرازي",
    rating: 5,
    comment: "متجري الأول و المفضل",
  },
  {
    id: 5,
    name: "عبدالرحمن الرشود",
    rating: 5,
    comment:
      "للامانه موقع جميل ما توقعت اني يطلب منكم بدل زيرو و ما تحدث ما كملت 24 ساعه الا والطلبيه وطلبتي للامانه توصيل سريع و حاله ممتازه ما شكرا لكم",
  },
  {
    id: 6,
    name: "Nawaf ALshamrani",
    location: "",
    rating: 5,
    comment: "Nawaf ALshamrani",
  },
  {
    id: 7,
    name: "زيد الكثيري",
    rating: 5,
    comment: "ممتاز",
  },
  {
    id: 8,
    name: "Nuha A",
    location: "",
    rating: 5,
    comment: "ممتاز واتعامل معاهم من اربع سنين ثقة واغلب اجوني منهم",
  },
  {
    id: 9,
    name: "Faleh Q",
    rating: 5,
    comment: "متجر حواوين واسعاره بطططططله؟",
  },
  {
    id: 10,
    name: "Abdulrhman Alghamdi",
    location: "",
    rating: 5,
    comment: "مضمون وسريع في التسليم واسعاره جداً مناسبه",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerSlide = 3;
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  const getCurrentSlideTestimonials = () => {
    const startIndex = currentIndex * testimonialsPerSlide;
    return testimonials.slice(startIndex, startIndex + testimonialsPerSlide);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            آراء العملاء
          </h2>
        </div>
        <div className="relative">
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getCurrentSlideTestimonials().map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-lg p-6 text-right transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {testimonial.image ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xl">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    {testimonial.location && (
                      <p className="text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                </div>
                <p className="text-gray-600 text-right">
                  {testimonial.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
