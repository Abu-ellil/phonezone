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

  // Utility functions for string normalization
  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .replace("برو ماكس", "promax")
      .replace("بروماكس", "promax")
      .replace("برو", "pro")
      .replace("ماكس", "max")
      .replace("بلس", "plus");
  };

  // Helper function to check if product belongs to a category
  const isInCategory = (productCategory, categoryNames) => {
    return productCategory.some((cat) => categoryNames.includes(cat));
  };

  // Helper function to check if product name includes any of the terms
  const includesAnyTerm = (productName, terms) => {
    return terms.some((term) => productName.includes(term.toLowerCase()));
  };

  // Filter functions for different product types
  const filterAppleProducts = (product, name) => {
    const productCategory = Array.isArray(product.category)
      ? product.category
      : [];
    const productNameLower = (product.name || "").toLowerCase();
    const productSubcategory = (product.subcategory || "").toLowerCase();

    const iPhoneTerms = ["ايفون", "آيفون", "iphone", "أيفون"];
    const isAppleCategory = isInCategory(productCategory, [
      "ابل",
      "آبل",
      "الهواتف الذكية",
    ]);
    const hasIPhoneInName = includesAnyTerm(productNameLower, iPhoneTerms);

    if (!name) return isAppleCategory || hasIPhoneInName;

    const normalizedName = normalizeString(name);
    const normalizedProductName = normalizeString(productNameLower);
    const normalizedSubcategory = normalizeString(productSubcategory);
    const modelTerms = normalizedName.split(" ");

    const isProMax = name.includes("برو ماكس");
    const isProOnly = name.includes("برو") && !name.includes("ماكس");
    const isRegular = !name.includes("برو") && !name.includes("بلس");

    // Exclude Pro Max and Plus models from regular iPhone
    if (
      isRegular &&
      (normalizedProductName.includes("promax") ||
        normalizedProductName.includes("pro") ||
        normalizedProductName.includes("plus"))
    ) {
      return false;
    }

    if (
      isProOnly &&
      (normalizedProductName.includes("max") ||
        normalizedProductName.includes("promax") ||
        !normalizedProductName.includes("pro"))
    ) {
      return false;
    }

    if (isProMax && !normalizedProductName.includes("promax")) {
      return false;
    }

    const matchesModel = modelTerms.every(
      (term) =>
        normalizedProductName.includes(term) ||
        normalizedSubcategory.includes(term)
    );

    return (isAppleCategory || hasIPhoneInName) && matchesModel;
  };

  const filterSamsungProducts = (product, name) => {
    const productCategory = Array.isArray(product.category)
      ? product.category
      : [];
    const productNameLower = (product.name || "").toLowerCase();
    const productSubcategory = (product.subcategory || "").toLowerCase();

    const isSamsungCategory = isInCategory(productCategory, [
      "سامسونج",
      "الهواتف الذكية",
    ]);
    const hasSamsungInName =
      productNameLower.includes("سامسونج") ||
      productNameLower.includes("samsung");

    if (!name) return isSamsungCategory || hasSamsungInName;

    const searchTerms =
      name === "S25 Ultra"
        ? [
            "s25 الترا",
            "s25 ultra",
            "s25ultra",
            "اس 25 الترا",
            "اس25 الترا",
            "s25الترا",
            "S25الترا",
          ]
        : name === "S24 Ultra"
        ? ["s24 الترا", "s24 ultra", "s24ultra", "اس 24 الترا", "اس24 الترا"]
        : [name.toLowerCase()];

    const matchesModel =
      includesAnyTerm(productNameLower, searchTerms) ||
      includesAnyTerm(productSubcategory, searchTerms);

    return (isSamsungCategory || hasSamsungInName) && matchesModel;
  };

  const filterAppleWatchProducts = (product) => {
    const productCategory = Array.isArray(product.category)
      ? product.category
      : [];
    const productNameLower = (product.name || "").toLowerCase();
    const productSubcategory = (product.subcategory || "").toLowerCase();

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
      isInCategory(productCategory, ["ساعات ابل", "ساعات آبل"]) ||
      includesAnyTerm(productNameLower, watchTerms) ||
      includesAnyTerm(productSubcategory, watchTerms)
    );
  };

  // Main filter function
  const filterProductsByCategory = (products, category, name, limit = 8) => {
    const filterFunction =
      category === "ابل" || category === "آبل"
        ? (p) => filterAppleProducts(p, name)
        : category === "سامسونج"
        ? (p) => filterSamsungProducts(p, name)
        : category === "ساعات ابل"
        ? filterAppleWatchProducts
        : (p) =>
            isInCategory(Array.isArray(p.category) ? p.category : [], [
              category,
            ]);

    return products.filter(filterFunction).slice(0, limit);
  };

  // Filter Apple iPhone products
  const iPhone16ProMaxProducts = filterProductsByCategory(
    allProducts,
    "ابل",
    "ايفون 16 برو ماكس"
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
    "بلاي ستيشن"
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
