import Link from "next/link";
import {
  getFeaturedProductsFromFirebase,
  getProductsFromFirebase,
  getNewestProductsFromFirebase,
} from "@/utils/firebaseData";
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
import img5 from "../../public/images/00 (5).jpg";
import HeroBanner from "@/components/HeroBanner";
import Testimonials from "@/components/Testimonials";

export default async function Home() {
  const featuredProducts = await getFeaturedProductsFromFirebase(8);
  const newestProducts = await getNewestProductsFromFirebase(8);
  const allProducts = await getProductsFromFirebase();

  const iPhoneProMaxProducts = allProducts
    .filter(
      (p) =>
        p.subcategory === "ابل ايفون 16 برو ماكس" ||
        p.name.toLowerCase().includes("ايفون 16 برو ماكس") ||
        p.name.toLowerCase().includes("iphone 16 pro max")
    )
    .slice(0, 8);

  const iPhoneProProducts = allProducts
    .filter(
      (p) =>
        p.subcategory === "ابل ايفون 16 برو" ||
        (p.name.toLowerCase().includes("ايفون 16 برو") &&
          !p.name.toLowerCase().includes("ماكس")) ||
        (p.name.toLowerCase().includes("iphone 16 pro") &&
          !p.name.toLowerCase().includes("max"))
    )
    .slice(0, 8);

  const iPhonePlusProducts = allProducts
    .filter(
      (p) =>
        p.subcategory === "ابل ايفون 16 بلس" ||
        p.name.toLowerCase().includes("ايفون 16 بلس") ||
        p.name.toLowerCase().includes("iphone 16 plus")
    )
    .slice(0, 8);

  const samsungProductsFromFirebase = allProducts
    .filter((p) => p.subcategory === "Samsung S25 Ultra")
    .sort((a, b) => {
      const priceA =
        typeof b.price === "string" ? parseFloat(b.price) : b.price;
      const priceB =
        typeof a.price === "string" ? parseFloat(a.price) : a.price;
      return priceA - priceB;
    })
    .slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col transition-theme">
      <Header />
      <main className="flex-1 space-y-6 animate-fade-in">
        <HeroBanner />

        <div className="container mx-auto px-4 space-y-6">
          <BannerImage src={img1} alt="Banner 1" />

          <Section
            title=" هواتف آيفون 16 برو ماكس"
            products={iPhoneProMaxProducts}
            link="/category/الهواتف%20الذكية/ابل%20ايفون%2016%20برو%20ماكس"
          />
          <BannerImage src={img2} alt="Banner 2" />

          <Section
            title="هواتف سامسونج"
            products={samsungProductsFromFirebase}
            link="/category/samsung"
          />

          <BannerImage src={img4} alt="Banner 4" />

          <Section
            title="  هواتف آيفون 16 برو"
            products={iPhoneProProducts}
            link="/category/الهواتف%20الذكية/ابل%20ايفون%2016%20برو"
          />

          <Section
            title="  هواتف آيفون 16 بلس"
            products={iPhonePlusProducts}
            link="/category/الهواتف%20الذكية/ابل%20ايفون%2016%20بلس"
          />

          <BannerImage src={img3} alt="Banner 3" />

          <Section
            title="منتجات مميزة"
            products={featuredProducts}
            link="/category/featured"
          />

          <BannerImage src={img5} alt="Banner 5" />
          <Section
            title="أحدث المنتجات"
            products={newestProducts}
            link="/category/new"
          />
          <Testimonials/>
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
