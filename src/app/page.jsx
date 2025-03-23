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
  let featuredProducts = [];
  let newestProducts = [];
  let allProducts = [];

  try {
    [featuredProducts, newestProducts, allProducts] = await Promise.all([
      getFeaturedProductsFromFirebase(8),
      getNewestProductsFromFirebase(8),
      getProductsFromFirebase(),
    ]);

    // Sort products by name
    allProducts.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error loading products:", error);
  }

  // Helper function to filter products by category and subcategory
  const filterProductsByCategory = (
    products,
    category,
    subcategory = null,
    limit = 8
  ) => {
    return products
      .filter((p) => {
        if (category === "سامسونج") {
          const searchTerms =
            subcategory === "S25 Ultra"
              ? [
                  "s25 الترا",
                  "s25 ultra",
                  "S25 Ultra",
                  "S25 الترا",
                  "اس 25 الترا",
                  "S25الترا",
                  "s25 الترا",
                ]
              : subcategory === "S24 Ultra"
              ? [
                  "s24 الترا",
                  "s24 ultra",
                  "S24 Ultra",
                  "S24 الترا",
                  "اس 24 الترا",
                ]
              : [subcategory];
          return (
            (p.category === "سامسونج" ||
              p.name.toLowerCase().includes("سامسونج") ||
              p.name.toLowerCase().includes("samsung")) &&
            (subcategory
              ? searchTerms.some((term) =>
                  p.name.toLowerCase().includes(term.toLowerCase())
                )
              : true)
          );
        }
        if (subcategory) {
          return p.category.includes(category) && p.name.includes(subcategory);
        }
        return p.category.includes(category);
      })
      .slice(0, limit);
  };

  // Filter Apple iPhone products
  const iPhone16ProMaxProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 16 بروماكس"
  );
  const iPhone16ProProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 16 برو"
  );
  const iPhone16PlusProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 16 بلس"
  );
  const iPhone16Products = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 16"
  );

  const iPhone15ProMaxProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 15 برو ماكس"
  );
  const iPhone15ProProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 15 برو"
  );
  const iPhone15PlusProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 15 بلس"
  );
  const iPhone15Products = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 15"
  );

  const iPhone14ProMaxProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 14 برو ماكس"
  );
  const iPhone14ProProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 14 برو"
  );
  const iPhone14PlusProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 14 بلس"
  );
  const iPhone14Products = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 14"
  );

  // Filter Samsung products
  const samsungS25UltraProducts = filterProductsByCategory(
    allProducts,
    "سامسونج",
    "S25 Ultra"
  );
  const samsungS24UltraProducts = filterProductsByCategory(
    allProducts,
    "سامسونج",
    "S24 Ultra"
  );

  // Filter other categories
  const appleWatchProducts = filterProductsByCategory(allProducts, "ساعات ابل");
  const playstationProducts = filterProductsByCategory(
    allProducts,
    "بلايستيشن"
  );

  // Filter best selling products
  const bestSellingProducts = allProducts
    .filter((p) => p.bestSelling === true)
    .slice(0, 8);

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
            link="/category/الهواتف%20الذكية/ابل%20ايفون%2016%20برو%20ماكس"
          />

          <BannerImage src={img1} alt="Banner 1" />

          <Section
            title="هواتف سامسونج S25 Ultra"
            products={samsungS25UltraProducts}
            link="/category/samsung/s25-ultra"
          />

          <Section
            title="هواتف آيفون 16 برو"
            products={iPhone16ProProducts}
            link="/category/الهواتف%20الذكية/ابل%20ايفون%2016%20برو"
          />

          <Section
            title="هواتف آيفون 16 بلس"
            products={iPhone16PlusProducts}
            link="/category/الهواتف%20الذكية/ابل%20ايفون%2016%20بلس"
          />

          <Section
            title="هواتف آيفون 16"
            products={iPhone16Products}
            link="/category/الهواتف%20الذكية/ابل%20ايفون%2016"
          />

          <BannerImage src={img2} alt="Banner 2" />

          <Section
            title="هواتف آيفون 15 برو ماكس"
            products={iPhone15ProMaxProducts}
            link="/category/الهواتف%20الذكية/ابل%20ايفون%2015%20برو%20ماكس"
          />

          <Section
            title="هواتف سامسونج S24 Ultra"
            products={samsungS24UltraProducts}
            link="/category/samsung/s24-ultra"
          />

          <BannerImage src={img3} alt="Banner 3" />

          <Section
            title="ساعات ابل"
            products={appleWatchProducts}
            link="/category/ساعات-ابل"
          />

          <Section
            title="بلايستيشن"
            products={playstationProducts}
            link="/category/بلايستيشن"
          />

          <BannerImage src={img4} alt="Banner 4" />

          <Section
            title="أحدث المنتجات"
            products={newestProducts}
            link="/category/new"
          />

          {/* <BannerImage src={img5} alt="Banner 5" /> */}

          <Section
            title="الأفضل مبيعاً"
            products={bestSellingProducts}
            link="/category/best-selling"
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
