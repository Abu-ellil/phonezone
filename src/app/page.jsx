"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import CarouselWrapper from "@/components/CarouselWrapper";
import Image from "next/image";
import img1 from "../../public/images/00 (1).jpg";
import img2 from "../../public/images/00 (2).jpg";
import img3 from "../../public/images/00 (3).jpg";
import img4 from "../../public/images/00 (4).jpg";
import HeroBanner from "@/components/HeroBanner";
import Testimonials from "@/components/Testimonials";
import { useProducts } from "@/contexts/ProductsContext";
import { useState, useEffect } from "react";
import { Loading } from "@/components/Loading";

export default function Home() {
  const {
    products,
    featuredProducts,
    newestProducts,
    bestSellingProducts,
    loading,
    error,
  } = useProducts();

  const [categoryProducts, setCategoryProducts] = useState({
    iPhone16ProMaxProducts: [],
    samsungS25UltraProducts: [],
    iPhone16ProProducts: [],
    iPhone16PlusProducts: [],
    iPhone16Products: [],
    iPhone15ProMaxProducts: [],
    samsungS24UltraProducts: [],
    iPhone14ProMaxProducts: [],
    iPhone14ProProducts: [],
    iPhone14PlusProducts: [],
    iPhone14Products: [],
    appleWatchProducts: [],
    playstationProducts: [],
    videoGamesProducts: [],
    headphonesProducts: [],
    laptopsProducts: [],
    tabletsProducts: [],
    powerBanksProducts: [],
    gamingAccessoriesProducts: [],
    tvProducts: [],
  });

  useEffect(() => {
    if (products.length > 0) {
      // تصفية المنتجات حسب الفئات
      const filterByNameOrCategory = (searchTerms) => {
        return products
          .filter((product) => {
            const productName = product.name?.toLowerCase() || "";
            const productCategory = Array.isArray(product.category)
              ? product.category.map((c) => c.toLowerCase())
              : [product.category?.toLowerCase() || ""];

            return searchTerms.some(
              (term) =>
                productName.includes(term) ||
                productCategory.some((cat) => cat.includes(term))
            );
          })
          .slice(0, 8);
      };

      setCategoryProducts({
        iPhone16ProMaxProducts: filterByNameOrCategory([
          "iphone 16 pro max",
          "ايفون 16 برو ماكس",
        ]),
        samsungS25UltraProducts: filterByNameOrCategory([
          "samsung s25 ultra",
          "سامسونج s25 ultra",
        ]),
        iPhone16ProProducts: filterByNameOrCategory([
          "iphone 16 pro",
          "ايفون 16 برو",
        ]),
        iPhone16PlusProducts: filterByNameOrCategory([
          "iphone 16 plus",
          "ايفون 16 بلس",
        ]),
        iPhone16Products: filterByNameOrCategory([
          "iphone 16",
          "ايفون 16",
        ]).filter(
          (p) =>
            !p.name.toLowerCase().includes("pro") &&
            !p.name.toLowerCase().includes("برو") &&
            !p.name.toLowerCase().includes("plus") &&
            !p.name.toLowerCase().includes("بلس")
        ),
        iPhone15ProMaxProducts: filterByNameOrCategory([
          "iphone 15 pro max",
          "ايفون 15 برو ماكس",
        ]),
        samsungS24UltraProducts: filterByNameOrCategory([
          "samsung s24 ultra",
          "سامسونج s24 ultra",
        ]),
        iPhone14ProMaxProducts: filterByNameOrCategory([
          "iphone 14 pro max",
          "ايفون 14 برو ماكس",
        ]),
        iPhone14ProProducts: filterByNameOrCategory([
          "iphone 14 pro",
          "ايفون 14 برو",
        ]),
        iPhone14PlusProducts: filterByNameOrCategory([
          "iphone 14 plus",
          "ايفون 14 بلس",
        ]),
        iPhone14Products: filterByNameOrCategory([
          "iphone 14",
          "ايفون 14",
        ]).filter(
          (p) =>
            !p.name.toLowerCase().includes("pro") &&
            !p.name.toLowerCase().includes("برو") &&
            !p.name.toLowerCase().includes("plus") &&
            !p.name.toLowerCase().includes("بلس")
        ),
        appleWatchProducts: filterByNameOrCategory([
          "apple watch",
          "ساعات ابل",
          "ساعة ابل",
          "ساعات آبل",
        ]),
        playstationProducts: filterByNameOrCategory([
          "playstation",
          "بلايستيشن",
          "بلاي ستيشن",
        ]),
        videoGamesProducts: filterByNameOrCategory([
          "ألعاب الفيديو",
          "video games",
          "games",
        ]),
        headphonesProducts: filterByNameOrCategory([
          "سماعات",
          "headphones",
          "earbuds",
          "أجهزة صوت",
        ]),
        laptopsProducts: filterByNameOrCategory([
          "لابتوب",
          "laptop",
          "شاشات",
          "لابتوبات",
        ]),
        tabletsProducts: filterByNameOrCategory([
          "ايباد",
          "ipad",
          "tablet",
          "تابلت",
          "الاجهزة اللوحية",
        ]),
        powerBanksProducts: filterByNameOrCategory([
          "بطاريات متنقلة",
          "power bank",
          "كيابل",
          "شواحن",
        ]),
        gamingAccessoriesProducts: filterByNameOrCategory([
          "ماوسات",
          "كيبوردات",
          "gaming",
          "ألعاب",
          "mouse",
          "keyboard",
        ]),
        tvProducts: filterByNameOrCategory(["تلفزيون", "tv", "شاشة", "تلفاز"]),
      });
    }
  }, [products]);

  if (loading) {
    return <Loading size="large" text="جاري تحميل المنتجات..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-xl">
          حدث خطأ أثناء تحميل المنتجات: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const {
    iPhone16ProMaxProducts,
    samsungS25UltraProducts,
    iPhone16ProProducts,
    iPhone16PlusProducts,
    iPhone16Products,
    iPhone15ProMaxProducts,
    samsungS24UltraProducts,
    iPhone14ProMaxProducts,
    iPhone14ProProducts,
    iPhone14PlusProducts,
    iPhone14Products,
    appleWatchProducts,
    playstationProducts,
    videoGamesProducts,
    headphonesProducts,
    laptopsProducts,
    tabletsProducts,
    powerBanksProducts,
    gamingAccessoriesProducts,
    tvProducts,
  } = categoryProducts;

  return (
    <div className="min-h-screen flex flex-col transition-theme">
      <Header />
      <main className="flex-1 space-y-6 animate-fade-in">
        <HeroBanner />

        <div className="container mx-auto px-4 space-y-6">
          <BannerImage src={img1} alt="Banner 1" />

          <Section
            title="هواتف آيفون 16 برو ماكس"
            products={iPhone16ProMaxProducts}
            link="/category/ابل/iPhone 16 Pro Max"
          />

          <BannerImage src={img2} alt="Banner 2" />

          <Section
            title="هواتف سامسونج S25 Ultra"
            products={samsungS25UltraProducts}
            link="/category/سامسونج/S25 Ultra"
          />

          <Section
            title="هواتف آيفون 16 برو"
            products={iPhone16ProProducts}
            link="/category/ابل/ايفون 16 برو"
          />

          <Section
            title="هواتف آيفون 16 بلس"
            products={iPhone16PlusProducts}
            link="/category/ابل/ايفون 16 بلس"
          />

          <Section
            title="هواتف آيفون 16"
            products={iPhone16Products}
            link="/category/ابل/ايفون 16"
          />

          <BannerImage src={img3} alt="Banner 3" />

          <Section
            title="هواتف آيفون 15 برو ماكس"
            products={iPhone15ProMaxProducts}
            link="/category/ابل/ايفون 15 برو ماكس"
          />

          <Section
            title="هواتف سامسونج S24 Ultra"
            products={samsungS24UltraProducts}
            link="/category/سامسونج/S24 Ultra"
          />

          <Section
            title="هواتف آيفون 14 برو ماكس"
            products={iPhone14ProMaxProducts}
            link="/category/ابل/ايفون 14 برو ماكس"
          />

          <Section
            title="هواتف آيفون 14 برو"
            products={iPhone14ProProducts}
            link="/category/ابل/ايفون 14 برو"
          />

          <Section
            title="هواتف آيفون 14 بلس"
            products={iPhone14PlusProducts}
            link="/category/ابل/ايفون 14 بلس"
          />

          <Section
            title="هواتف آيفون 14"
            products={iPhone14Products}
            link="/category/ابل/ايفون 14"
          />

          <BannerImage src={img4} alt="Banner 4" />

          <Section
            title="ساعات آبل"
            products={appleWatchProducts}
            link="/category/ساعات ابل"
          />

          <Section
            title="بلايستيشن"
            products={playstationProducts}
            link="/category/بلاي ستيشن"
          />

          <Section
            title="ألعاب الفيديو"
            products={videoGamesProducts}
            link="/category/ألعاب الفيديو"
          />

          <Section
            title="سماعات وأجهزة صوت"
            products={headphonesProducts}
            link="/category/سماعات"
          />

          <Section
            title="لابتوبات وشاشات"
            products={laptopsProducts}
            link="/category/لابتوبات وشاشات"
          />

          <Section
            title="الأجهزة اللوحية وايبادات"
            products={tabletsProducts}
            link="/category/الاجهزة اللوحية ايبادات"
          />

          <Section
            title="بطاريات متنقلة وكيابل"
            products={powerBanksProducts}
            link="/category/بطاريات متنقلة وكيابل"
          />

          <Section
            title="ماوسات وكيبوردات ألعاب"
            products={gamingAccessoriesProducts}
            link="/category/ماوسات وكيبوردات ألعاب"
          />

          <Section
            title="تلفزيونات"
            products={tvProducts}
            link="/category/تلفزيون"
          />

          <Section
            title="أحدث المنتجات"
            products={newestProducts}
            link="/category/احدث المنتجات"
          />

          <Section
            title="الأفضل مبيعاً"
            products={bestSellingProducts}
            link="/category/الافضل مبيعا"
          />
          <Testimonials />
        </div>
      </main>

      <FloatingWhatsAppButton />
      <Footer />
    </div>
  );
}

const BannerImage = ({ src, alt }) => (
  <div className="w-full overflow-hidden rounded-xl shadow-medium hover:shadow-large transition-all duration-300">
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={400}
      className="w-full h-auto object-cover"
      placeholder="blur"
    />
  </div>
);

const Section = ({ title, products, link }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className=" p-4">
      <CarouselWrapper title={title}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </CarouselWrapper>

      <div className="flex items-center mt-4 space-x-2 rtl:space-x-reverse">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        <Link
          href={link}
          className=" text-primary-500 dark:text-primary-300 border border-primary-500 dark:border-primary-300 px-4 py-2 hover:opacity-90 transition-colors"
        >
          عرض الكل
        </Link>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      </div>
    </div>
  );
};
