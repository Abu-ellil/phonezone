import Link from "next/link";
import {
  getFeaturedProducts,
  getProducts,
  getNewestProducts,
} from "@/utils/data";
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

export default async function Home() {
  let featuredProducts = [];
  let newestProducts = [];
  let allProducts = [];

  try {
    [featuredProducts, newestProducts, allProducts] = await Promise.all([
      getFeaturedProducts(8),
      getNewestProducts(8),
      getProducts(),
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
    name,
    subcategory = null,
    limit = 8
  ) => {
    return products
      .filter((p) => {
        // Ensure category exists and convert to string if it's an array
        const productCategory = Array.isArray(p.category)
          ? p.category[0]
          : p.category;
        const productCategoryLower =
          typeof productCategory === "string"
            ? productCategory.toLowerCase()
            : "";
        const productNameLower =
          typeof p.name === "string" ? p.name.toLowerCase() : "";
        const productSubcategory = p.subcategory;

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
            (productCategory === "سامسونج" ||
              productNameLower.includes("سامسونج") ||
              productNameLower.includes("samsung")) &&
            (subcategory
              ? searchTerms.some((term) =>
                  productNameLower.includes(term.toLowerCase())
                )
              : true)
          );
        }
        if (category === "ساعات ابل") {
          const watchTerms = [
            "ساعات ابل",
            "ساعة ابل",
            "apple watch",
            "ساعة آبل",
            "ساعات آبل",
            "ابل ووتش",
            "watch",
          ];
          return (
            productCategory === "ساعات ابل" ||
            productSubcategory === "ساعات ابل" ||
            watchTerms.some(
              (term) =>
                productNameLower.includes(term.toLowerCase()) ||
                productCategoryLower.includes(term.toLowerCase())
            )
          );
          return watchTerms.some(
            (term) =>
              productNameLower.includes(term.toLowerCase()) ||
              productCategoryLower.includes(term.toLowerCase())
          );
        }
        if (category === "ابل") {
          const iPhoneTerms = ["ايفون", "آيفون", "iphone", "أيفون"];
          return (
            (productCategory === "ابل" ||
              productCategory === "الهواتف الذكية" ||
              iPhoneTerms.some((term) =>
                productNameLower.includes(term.toLowerCase())
              )) &&
            (subcategory
              ? productNameLower.includes(subcategory.toLowerCase())
              : true)
          );
        }
        if (subcategory) {
          return (
            productCategory?.includes(category) &&
            (p.name?.toLowerCase().includes(subcategory.toLowerCase()) ||
              p.subcategory?.toLowerCase().includes(subcategory.toLowerCase()))
          );
        }
        return productCategory?.includes(category);
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

  // Filter Apple Watch products under Watches category
  const appleWatchProducts = filterProductsByCategory(
    allProducts,
    "ساعات ابل",
    null
  );
  const playstationProducts = filterProductsByCategory(
    allProducts,
    "بلاي ستيشن "
  );

  // Filter best selling products with random selection
  const bestSellingProducts = allProducts
    .filter((p) => p.bestSelling === true)
    .sort(() => Math.random() - 0.5)
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
            link="/category/ابل/ايفون-16-برو-ماكس"
          />

          <BannerImage src={img2} alt="Banner 2" />

          <Section
            title="هواتف سامسونج S25 Ultra"
            products={samsungS25UltraProducts}
            link="/category/سامسونج/s25-ultra"
          />

          <Section
            title="هواتف آيفون 16 برو"
            products={iPhone16ProProducts}
            link="/category/ابل/ايفون-16-برو"
          />

          <Section
            title="هواتف آيفون 16 بلس"
            products={iPhone16PlusProducts}
            link="/category/ابل/ايفون-16-بلس"
          />

          <Section
            title="هواتف آيفون 16"
            products={iPhone16Products}
            link="/category/ابل/ايفون-16"
          />

          <BannerImage src={img3} alt="Banner 3" />

          <Section
            title="هواتف آيفون 15 برو ماكس"
            products={iPhone15ProMaxProducts}
            link="/category/ابل/ايفون-15-برو-ماكس"
          />

          <Section
            title="هواتف سامسونج S24 Ultra"
            products={samsungS24UltraProducts}
            link="/category/سامسونج/s24-ultra"
          />

          <Section
            title="هواتف آيفون 14 برو ماكس"
            products={iPhone14ProMaxProducts}
            link="/category/ابل/ايفون-14-برو-ماكس"
          />

          <Section
            title="هواتف آيفون 14 برو"
            products={iPhone14ProProducts}
            link="/category/ابل/ايفون-14-برو"
          />

          <Section
            title="هواتف آيفون 14 بلس"
            products={iPhone14PlusProducts}
            link="/category/ابل/ايفون-14-بلس"
          />

          <Section
            title="هواتف آيفون 14"
            products={iPhone14Products}
            link="/category/ابل/ايفون-14"
          />

          <BannerImage src={img4} alt="Banner 4" />

          <Section
            title="ساعات آبل"
            products={appleWatchProducts}
            link="/category/ساعات-ابل"
          />

          <Section
            title="بلايستيشن"
            products={playstationProducts}
            link="/category/بلايستيشن"
          />

          <Section
            title="أحدث المنتجات"
            products={newestProducts}
            link="/category/احدث-المنتجات"
          />

          <Section
            title="الأفضل مبيعاً"
            products={bestSellingProducts}
            link="/category/الافضل-مبيعا"
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
