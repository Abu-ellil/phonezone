// Helper functions for product filtering

// Utility functions for string normalization
export const normalizeString = (str) => {
  return str
    .toLowerCase()
    .replace("برو ماكس", "promax")
    .replace("بروماكس", "promax")
    .replace("برو", "pro")
    .replace("ماكس", "max")
    .replace("بلس", "plus");
};

// Helper function to check if product belongs to a category
export const isInCategory = (productCategory, categoryNames) => {
  return productCategory.some((cat) => categoryNames.includes(cat));
};

// Helper function to check if product name includes any of the terms
export const includesAnyTerm = (productName, terms) => {
  return terms.some((term) => productName.includes(term.toLowerCase()));
};

// Filter functions for different product types
export const filterAppleProducts = (product, name) => {
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

export const filterSamsungProducts = (product, name) => {
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

export const filterAppleWatchProducts = (product) => {
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

// Function to organize products by category
export const organizeProductsByCategory = (products) => {
  return {
    iphone: {
      16: {
        proMax: filterAppleProducts(products, "ايفون 16 برو ماكس"),
        pro: filterAppleProducts(products, "ايفون 16 برو"),
        plus: filterAppleProducts(products, "ايفون 16 بلس"),
        regular: filterAppleProducts(products, "ايفون 16"),
      },
      15: {
        proMax: filterAppleProducts(products, "ايفون 15 برو ماكس"),
        pro: filterAppleProducts(products, "ايفون 15 برو"),
        plus: filterAppleProducts(products, "ايفون 15 بلس"),
        regular: filterAppleProducts(products, "ايفون 15"),
      },
      14: {
        proMax: filterAppleProducts(products, "ايفون 14 برو ماكس"),
        pro: filterAppleProducts(products, "ايفون 14 برو"),
        plus: filterAppleProducts(products, "ايفون 14 بلس"),
        regular: filterAppleProducts(products, "ايفون 14"),
      },
    },
    samsung: {
      s25Ultra: filterSamsungProducts(products, "S25 Ultra"),
      s24Ultra: filterSamsungProducts(products, "S24 Ultra"),
    },
    appleWatch: filterAppleWatchProducts(products),
    playstation: products.filter((p) =>
      isInCategory(Array.isArray(p.category) ? p.category : [], ["بلاي ستيشن"])
    ),
    bestSelling: products
      .filter((p) => p.bestSelling === true)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8),
  };
};

// Main filter function (kept for backward compatibility)
export const filterProductsByCategory = (
  products,
  category,
  name,
  limit = 8
) => {
  const filterFunction =
    category === "ابل" || category === "آبل"
      ? (p) => filterAppleProducts(p, name)
      : category === "سامسونج"
      ? (p) => filterSamsungProducts(p, name)
      : category === "ساعات ابل"
      ? filterAppleWatchProducts
      : (p) =>
          isInCategory(Array.isArray(p.category) ? p.category : [], [category]);

  return products.filter(filterFunction).slice(0, limit);
};
