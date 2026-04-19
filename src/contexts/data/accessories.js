// بيانات الملحقات والإكسسوارات
const accessoriesData = {
  batteries: [
    {
      id: "battery1",
      name: "بطارية متنقلة 20000mAh",
      price: 199,
      image_url: "https://res.cloudinary.com/masoft/image/upload/v1742111164/noon-store-products/gu9porh3qybbiumdlqay.jpg",
      category: "بطاريات متنقلة وكيابل",
      subcategory: "بطاريات متنقلة"
    },
    {
      id: "battery2",
      name: "بطارية متنقلة 10000mAh",
      price: 149,
      image_url: "https://res.cloudinary.com/masoft/image/upload/v1742111162/noon-store-products/sfuf5psvk9rqspy3uzgy.jpg",
      category: "بطاريات متنقلة وكيابل",
      subcategory: "بطاريات متنقلة"
    },
    {
      id: "cable1",
      name: "كيبل USB-C إلى Lightning",
      price: 99,
      image_url: "https://res.cloudinary.com/masoft/image/upload/v1742111156/noon-store-products/hguakenjkbk7es3bms8p.jpg",
      category: "بطاريات متنقلة وكيابل",
      subcategory: "كيابل"
    }
  ],
  gamingAccessories: [
    {
      id: "mouse1",
      name: "ماوس ألعاب Razer DeathAdder V3 Pro",
      price: 499,
      image_url: "https://res.cloudinary.com/masoft/image/upload/v1742111164/noon-store-products/gu9porh3qybbiumdlqay.jpg",
      category: "ماوسات وكيبوردات ألعاب",
      subcategory: "ماوسات ألعاب"
    },
    {
      id: "keyboard1",
      name: "كيبورد ألعاب Logitech G Pro X",
      price: 699,
      image_url: "https://res.cloudinary.com/masoft/image/upload/v1742111162/noon-store-products/sfuf5psvk9rqspy3uzgy.jpg",
      category: "ماوسات وكيبوردات ألعاب",
      subcategory: "كيبوردات ألعاب"
    },
    {
      id: "headset1",
      name: "سماعة ألعاب HyperX Cloud Alpha",
      price: 399,
      image_url: "https://res.cloudinary.com/masoft/image/upload/v1742111156/noon-store-products/hguakenjkbk7es3bms8p.jpg",
      category: "ماوسات وكيبوردات ألعاب",
      subcategory: "سماعات ألعاب"
    }
  ],
  phoneAccessories: [
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/302",
      "id": "302",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "base_price": "2107 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/303",
      "id": "303",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "base_price": "2107 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/304",
      "id": "304",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "base_price": "2107 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/305",
      "id": "305",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "price": "2107 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/306",
      "id": "306",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "price": "2107 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/312",
      "id": "312",
      "name": "أبل ايربودز",
      "original_price": "753.62 ",
      "price": "528.22 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/313",
      "id": "313",
      "name": "أبل سماعات",
      "original_price": "102.9 ",
      "price": "98 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/314",
      "id": "314",
      "name": "أبل ايربودز",
      "original_price": "834.96 ",
      "price": "781.06 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/315",
      "id": "315",
      "name": "أبل إيربودز برو ميج سيف",
      "original_price": "963.34 ",
      "price": "923.16 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/592",
      "id": "592",
      "name": "أبل ايربودز مع غطاء شحن، الجيل الثاني، أبيض",
      "original_price": "774.2 ",
      "price": "522.34 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/593",
      "id": "593",
      "name": "أبل ايربودز مع غطاء شحن لاسلكي، الجيل الثالث، أبيض",
      "original_price": "833 ",
      "price": "812.42 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/594",
      "id": "594",
      "name": "مايسترو سماعات أذن ستيريو لايتنينج، لأجهزة أبل, أسود/ أزرق",
      "original_price": "196 ",
      "price": "141.12 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/595",
      "id": "595",
      "name": "مايسترو سماعات أذن ستيريو لايتنينج، لأجهزة أبل, أسود",
      "original_price": "196 ",
      "price": "141.12 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/596",
      "id": "596",
      "name": "مايسترو سماعات أذن ستيريو لايتنينج، لأجهزة أبل, أبيض",
      "original_price": "196 ",
      "price": "141.12 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/598",
      "id": "598",
      "name": "أبل سويتش إيربود، وردي لامع",
      "original_price": "901.6 ",
      "price": "748.72 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/599",
      "id": "599",
      "name": "أبل سويتش إيربود، أصفر لامع",
      "original_price": "1273.02 ",
      "price": "1077.02 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/600",
      "id": "600",
      "name": "أبل سويتش إيربود، أصفر",
      "original_price": "882 ",
      "price": "751.66 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/601",
      "id": "601",
      "name": "أبل سويتش إيربود، رمادي فاتح",
      "original_price": "901.6 ",
      "price": "751.66 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/220",
      "id": "220",
      "name": "إس بي إس، مكبر صوت لاسلكي",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/221",
      "id": "221",
      "name": "أنكر ساوند كور فلير2، مكبر صوت بلوتوث",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/222",
      "id": "222",
      "name": "هواوي ساوند إكس، سماعة بلوتوث",
      "original_price": "1371.02 ",
      "price": "685.02 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/223",
      "id": "223",
      "name": "هواوي مكبر صوت محمول، بلوتوث",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/383",
      "id": "383",
      "name": "سماعة سبيكر أنكر ساوند كور فلاير ميني احمر",
      "original_price": "215.6 ",
      "price": "173.46 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/384",
      "id": "384",
      "name": "سماعة سبيكر أنكر ساوند كور فلاير أزرق 360",
      "original_price": "293.02 ",
      "price": "249.9 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/385",
      "id": "385",
      "name": "سماعة سبيكر أنكر ساوند كور فلاير أحمر 360",
      "original_price": "293.02 ",
      "price": "245 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/386",
      "id": "386",
      "name": "سماعة سبيكر جي بي ال بلس 4 اسود",
      "original_price": "1058.4 ",
      "price": "970.2 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/387",
      "id": "387",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء أحمر JBL",
      "original_price": "441.98 ",
      "price": "384.16 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/388",
      "id": "388",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء أصفر",
      "original_price": "518.42 ",
      "price": "401.8 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/389",
      "id": "389",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء رمادي",
      "original_price": "518.42 ",
      "price": "391.02 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/390",
      "id": "390",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء أسود",
      "original_price": "518.42 ",
      "price": "391.02 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/391",
      "id": "391",
      "name": "سماعة سبيكر جي بي ال شارج 4 مقاومة للماء أزرق",
      "original_price": "718.34 ",
      "price": "681.1 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/392",
      "id": "392",
      "name": "سماعة سبيكر جي بي ال كليب 2 مقاومة للماء أسود",
      "original_price": "230.3 ",
      "price": "178.36 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/393",
      "id": "393",
      "name": "سماعة سبيكر جي بي ال شارج 4 مقاومة للماء أخضر",
      "original_price": "714.42 ",
      "price": "678.16 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/394",
      "id": "394",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء أبيض",
      "original_price": "518.42 ",
      "price": "408.66 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/395",
      "id": "395",
      "name": "سماعة سبيكر جي بي أل اصدار GO 2  أصلية بضمان سنتين  صغيرة الحجم  تصميم أنيق وجميل  سبيكر مدمج  مدخل AUX  مقاوم للماء",
      "original_price": "206.78 ",
      "price": "162.68 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/396",
      "id": "396",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء جيشي",
      "original_price": "224.42 ",
      "price": "408.66 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/397",
      "id": "397",
      "name": "سماعة سبيكر تايم بوكس دايفوم أحمر",
      "original_price": "293.02 ",
      "price": "211.68 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/398",
      "id": "398",
      "name": "هوم تايم مكبر صوت بلوتوث و منبه وشاحن لاسلكي خشبي M9Qi",
      "original_price": "371.42 ",
      "price": "293.02 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/399",
      "id": "399",
      "name": "سماعة سبيكر جي بي ال جو 2 ازرق",
      "original_price": "195.02 ",
      "price": "134.26 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/400",
      "id": "400",
      "name": "هوم تايم مكبر صوت بلوتوث و منبه وشاحن لاسلكي أسود D2QI",
      "original_price": "312.62 ",
      "price": "240.1 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/401",
      "id": "401",
      "name": "سماعة سبيكر سول مقاومة للماء أحمر",
      "original_price": "212.66 ",
      "price": "157.78 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/402",
      "id": "402",
      "name": "سماعة سبيكر ترونسمارت T6 ايليمنت اسود",
      "original_price": "392 ",
      "price": "309.68 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/403",
      "id": "403",
      "name": "سماعة سبيكر ترونسمارت T2 ايليمنت اسود",
      "original_price": "182.28 ",
      "price": "134.26 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/404",
      "id": "404",
      "name": "سماعة سبيكر جي بي ال بلس 3",
      "original_price": "1028.02 ",
      "price": "856.52 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/405",
      "id": "405",
      "name": "سماعة سبيكر جي بي ال بلس 3",
      "original_price": "1028.02 ",
      "price": "856.52 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/406",
      "id": "406",
      "name": "سماعة سبيكر أنكر ساوند كور برو",
      "original_price": "395.92 ",
      "price": "372.4 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/407",
      "id": "407",
      "name": "شاحن لاسلكي موماكس وساعة رقمية ذكية مع مكبر صوت",
      "original_price": "294 ",
      "price": "232.26 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/408",
      "id": "408",
      "name": "هوم تايم مكبر صوت بلوتوث و منبه وشاحن لاسلكي أبيض D2QI",
      "original_price": "312.62 ",
      "price": "244.02 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/409",
      "id": "409",
      "name": "سماعة سبيكر أنكر ساوند كور فلاير 360",
      "original_price": "294 ",
      "price": "253.82 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/410",
      "id": "410",
      "name": "سماعة سبيكر جي بي ال شارج 4 مقاومة للماء وردي",
      "original_price": "754.6 ",
      "price": "685.02 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/411",
      "id": "411",
      "name": "سماعة سبيكر أنكر ساوند كور ايكون اسود",
      "original_price": "212.66 ",
      "price": "195.02 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/412",
      "id": "412",
      "name": "سماعة سبيكر تيفو دايفوم أسود",
      "original_price": "310.66 ",
      "price": "264.6 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/218",
      "id": "218",
      "name": "سماعة بلوتوث مانعة للضوضاء",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/300",
      "id": "300",
      "name": "جابرا موف ستايل إيديشن",
      "original_price": "490 ",
      "price": "434.14 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/301",
      "id": "301",
      "name": "جابرا موف ستايل إيديشن",
      "original_price": "490 ",
      "price": "437.08 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/307",
      "id": "307",
      "name": "جي بي إل",
      "original_price": "577.22 ",
      "price": "431.2 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/309",
      "id": "309",
      "name": "جي بي إل",
      "original_price": "577.22 ",
      "price": "431.2 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "/images/placeholder.svg",
      "route": "/store/product/310",
      "id": "310",
      "name": "جي بي إل",
      "original_price": "479.22 ",
      "price": "431.2 ",
      "image_url": "/images/placeholder.svg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    }
  ]
};

export default accessoriesData;
