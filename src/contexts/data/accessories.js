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
      "url": "https://rawnaqstoore.com/store/product/302",
      "route": "/store/product/302",
      "id": "302",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "base_price": "2107 ",
      "image_url": "https://rawnaqstoore.com/images/Original/ecd7dc1a-619b-4d79-8e3b-f29d0107fb18.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/303",
      "route": "/store/product/303",
      "id": "303",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "base_price": "2107 ",
      "image_url": "https://rawnaqstoore.com/images/Original/b9641ab6-8fc7-47ef-98c0-835e75490765.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/304",
      "route": "/store/product/304",
      "id": "304",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "base_price": "2107 ",
      "image_url": "https://rawnaqstoore.com/images/Original/a2f0e0c0-fcc6-441a-8e7c-edec988e4bc0.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/305",
      "route": "/store/product/305",
      "id": "305",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "price": "2107 ",
      "image_url": "https://rawnaqstoore.com/images/Original/7ca8c016-0059-4950-bcbe-fb3f0b634ca3.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/306",
      "route": "/store/product/306",
      "id": "306",
      "name": "أبل إيربودز ماكس",
      "original_price": "2596.02 ",
      "price": "2107 ",
      "image_url": "https://rawnaqstoore.com/images/Original/d3b3dc67-f137-4634-b82b-467963cbda92.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/312",
      "route": "/store/product/312",
      "id": "312",
      "name": "أبل ايربودز",
      "original_price": "753.62 ",
      "price": "528.22 ",
      "image_url": "https://rawnaqstoore.com/images/Original/b4af4355-c133-4abe-9dbc-7e29198ba079.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/313",
      "route": "/store/product/313",
      "id": "313",
      "name": "أبل سماعات",
      "original_price": "102.9 ",
      "price": "98 ",
      "image_url": "https://rawnaqstoore.com/images/Original/2550ef82-9683-4a10-bcc7-db8f0f9fbe5f.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/314",
      "route": "/store/product/314",
      "id": "314",
      "name": "أبل ايربودز",
      "original_price": "834.96 ",
      "price": "781.06 ",
      "image_url": "https://rawnaqstoore.com/images/Original/8a67fb04-3b7b-4f95-ac27-19156d1dc2d2.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/315",
      "route": "/store/product/315",
      "id": "315",
      "name": "أبل إيربودز برو ميج سيف",
      "original_price": "963.34 ",
      "price": "923.16 ",
      "image_url": "https://rawnaqstoore.com/images/Original/5b80e64e-1dd6-4f6a-98a1-33438f1ff7af.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/592",
      "route": "/store/product/592",
      "id": "592",
      "name": "أبل ايربودز مع غطاء شحن، الجيل الثاني، أبيض",
      "original_price": "774.2 ",
      "price": "522.34 ",
      "image_url": "https://rawnaqstoore.com/images/Original/99b24d69-f684-41bd-bc71-a80e4587dfc9.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/593",
      "route": "/store/product/593",
      "id": "593",
      "name": "أبل ايربودز مع غطاء شحن لاسلكي، الجيل الثالث، أبيض",
      "original_price": "833 ",
      "price": "812.42 ",
      "image_url": "https://rawnaqstoore.com/images/Original/5492f5df-c75e-4676-93dc-44789e8e37cf.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/594",
      "route": "/store/product/594",
      "id": "594",
      "name": "مايسترو سماعات أذن ستيريو لايتنينج، لأجهزة أبل, أسود/ أزرق",
      "original_price": "196 ",
      "price": "141.12 ",
      "image_url": "https://rawnaqstoore.com/images/Original/67dee05e-411b-4953-a970-2e1f0491844c.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/595",
      "route": "/store/product/595",
      "id": "595",
      "name": "مايسترو سماعات أذن ستيريو لايتنينج، لأجهزة أبل, أسود",
      "original_price": "196 ",
      "price": "141.12 ",
      "image_url": "https://rawnaqstoore.com/images/Original/cbfa675c-0e70-45c3-a2d3-9380c6cf86a9.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/596",
      "route": "/store/product/596",
      "id": "596",
      "name": "مايسترو سماعات أذن ستيريو لايتنينج، لأجهزة أبل, أبيض",
      "original_price": "196 ",
      "price": "141.12 ",
      "image_url": "https://rawnaqstoore.com/images/Original/c7d78466-a933-4b50-b564-2436e2079376.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/598",
      "route": "/store/product/598",
      "id": "598",
      "name": "أبل سويتش إيربود، وردي لامع",
      "original_price": "901.6 ",
      "price": "748.72 ",
      "image_url": "https://rawnaqstoore.com/images/Original/5ac31b89-73a2-4b30-94a0-19570691c132.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/599",
      "route": "/store/product/599",
      "id": "599",
      "name": "أبل سويتش إيربود، أصفر لامع",
      "original_price": "1273.02 ",
      "price": "1077.02 ",
      "image_url": "https://rawnaqstoore.com/images/Original/d3d67883-db75-4b3d-81b4-f15c29ed369f.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/600",
      "route": "/store/product/600",
      "id": "600",
      "name": "أبل سويتش إيربود، أصفر",
      "original_price": "882 ",
      "price": "751.66 ",
      "image_url": "https://rawnaqstoore.com/images/Original/14111d9a-dbc8-4664-8d66-68ae1d9207a8.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/601",
      "route": "/store/product/601",
      "id": "601",
      "name": "أبل سويتش إيربود، رمادي فاتح",
      "original_price": "901.6 ",
      "price": "751.66 ",
      "image_url": "https://rawnaqstoore.com/images/Original/53873bd3-8195-4d41-829d-be5e3a800eb1.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات أبل"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/220",
      "route": "/store/product/220",
      "id": "220",
      "name": "إس بي إس، مكبر صوت لاسلكي",
      "image_url": "https://rawnaqstoore.com/images/Original/b6ecfd58-5d58-49f4-9a48-7706e72c3cee.jpg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/221",
      "route": "/store/product/221",
      "id": "221",
      "name": "أنكر ساوند كور فلير2، مكبر صوت بلوتوث",
      "image_url": "https://rawnaqstoore.com/images/Original/77bd1ec6-c6fb-4eb1-b81a-bf55412994a2.jpg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/222",
      "route": "/store/product/222",
      "id": "222",
      "name": "هواوي ساوند إكس، سماعة بلوتوث",
      "original_price": "1371.02 ",
      "price": "685.02 ",
      "image_url": "https://rawnaqstoore.com/images/Original/b4db98ba-c380-47e1-8fbb-ca48f3aa6251.jpg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/223",
      "route": "/store/product/223",
      "id": "223",
      "name": "هواوي مكبر صوت محمول، بلوتوث",
      "image_url": "https://rawnaqstoore.com/images/Original/56899213-f48e-44da-be0c-ae01c7af420c.jpg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/383",
      "route": "/store/product/383",
      "id": "383",
      "name": "سماعة سبيكر أنكر ساوند كور فلاير ميني احمر",
      "original_price": "215.6 ",
      "price": "173.46 ",
      "image_url": "https://rawnaqstoore.com/images/Original/93963b26-655b-4153-9202-c9b3657cf593.png",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/384",
      "route": "/store/product/384",
      "id": "384",
      "name": "سماعة سبيكر أنكر ساوند كور فلاير أزرق 360",
      "original_price": "293.02 ",
      "price": "249.9 ",
      "image_url": "https://rawnaqstoore.com/images/Original/4a3aec43-aed9-4557-b083-3670d5da114c.png",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/385",
      "route": "/store/product/385",
      "id": "385",
      "name": "سماعة سبيكر أنكر ساوند كور فلاير أحمر 360",
      "original_price": "293.02 ",
      "price": "245 ",
      "image_url": "https://rawnaqstoore.com/images/Original/73569620-f4df-4144-8a67-5f441aae7884.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/386",
      "route": "/store/product/386",
      "id": "386",
      "name": "سماعة سبيكر جي بي ال بلس 4 اسود",
      "original_price": "1058.4 ",
      "price": "970.2 ",
      "image_url": "https://rawnaqstoore.com/images/Original/e3039277-0ed6-470b-b751-a9fee7b68659.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/387",
      "route": "/store/product/387",
      "id": "387",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء أحمر JBL",
      "original_price": "441.98 ",
      "price": "384.16 ",
      "image_url": "https://rawnaqstoore.com/images/Original/a47f24ec-8601-4fbf-a8dd-663c1fa31daf.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/388",
      "route": "/store/product/388",
      "id": "388",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء أصفر",
      "original_price": "518.42 ",
      "price": "401.8 ",
      "image_url": "https://rawnaqstoore.com/images/Original/d753f8ab-d75f-4f6b-a503-cd291c30864f.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/389",
      "route": "/store/product/389",
      "id": "389",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء رمادي",
      "original_price": "518.42 ",
      "price": "391.02 ",
      "image_url": "https://rawnaqstoore.com/images/Original/048e8f89-3e85-4b99-8443-fef7fc9c8913.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/390",
      "route": "/store/product/390",
      "id": "390",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء أسود",
      "original_price": "518.42 ",
      "price": "391.02 ",
      "image_url": "https://rawnaqstoore.com/images/Original/f46c2ebe-0d42-4260-8c92-75be4e863c12.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/391",
      "route": "/store/product/391",
      "id": "391",
      "name": "سماعة سبيكر جي بي ال شارج 4 مقاومة للماء أزرق",
      "original_price": "718.34 ",
      "price": "681.1 ",
      "image_url": "https://rawnaqstoore.com/images/Original/7f2f261a-af25-48ff-95e9-686880fc073a.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/392",
      "route": "/store/product/392",
      "id": "392",
      "name": "سماعة سبيكر جي بي ال كليب 2 مقاومة للماء أسود",
      "original_price": "230.3 ",
      "price": "178.36 ",
      "image_url": "https://rawnaqstoore.com/images/Original/e360eaeb-374d-4b2d-bdbd-20d49dbd208b.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/393",
      "route": "/store/product/393",
      "id": "393",
      "name": "سماعة سبيكر جي بي ال شارج 4 مقاومة للماء أخضر",
      "original_price": "714.42 ",
      "price": "678.16 ",
      "image_url": "https://rawnaqstoore.com/images/Original/a34c1c99-da89-4e5f-9a43-494a320640b3.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/394",
      "route": "/store/product/394",
      "id": "394",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء أبيض",
      "original_price": "518.42 ",
      "price": "408.66 ",
      "image_url": "https://rawnaqstoore.com/images/Original/46b38f8d-d197-4ab5-9049-4660f985a65a.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/395",
      "route": "/store/product/395",
      "id": "395",
      "name": "سماعة سبيكر جي بي أل اصدار GO 2  أصلية بضمان سنتين  صغيرة الحجم  تصميم أنيق وجميل  سبيكر مدمج  مدخل AUX  مقاوم للماء",
      "original_price": "206.78 ",
      "price": "162.68 ",
      "image_url": "https://rawnaqstoore.com/images/Original/b108ccdf-18c3-4b10-8cf0-82baf4135d39.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/396",
      "route": "/store/product/396",
      "id": "396",
      "name": "سماعة سبيكر جي بي ال فليب 5 مقاومة للماء جيشي",
      "original_price": "224.42 ",
      "price": "408.66 ",
      "image_url": "https://rawnaqstoore.com/images/Original/87e66507-a159-4048-bea0-fb9f0502aa7c.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/397",
      "route": "/store/product/397",
      "id": "397",
      "name": "سماعة سبيكر تايم بوكس دايفوم أحمر",
      "original_price": "293.02 ",
      "price": "211.68 ",
      "image_url": "https://rawnaqstoore.com/images/Original/23bd666b-1a4f-48ad-b335-d117f544cb59.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/398",
      "route": "/store/product/398",
      "id": "398",
      "name": "هوم تايم مكبر صوت بلوتوث و منبه وشاحن لاسلكي خشبي M9Qi",
      "original_price": "371.42 ",
      "price": "293.02 ",
      "image_url": "https://rawnaqstoore.com/images/Original/903946c4-50fe-4f22-8fa7-f342efa5cb56.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/399",
      "route": "/store/product/399",
      "id": "399",
      "name": "سماعة سبيكر جي بي ال جو 2 ازرق",
      "original_price": "195.02 ",
      "price": "134.26 ",
      "image_url": "https://rawnaqstoore.com/images/Original/dcc3d483-4f57-405c-b4ac-1209520e6a66.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/400",
      "route": "/store/product/400",
      "id": "400",
      "name": "هوم تايم مكبر صوت بلوتوث و منبه وشاحن لاسلكي أسود D2QI",
      "original_price": "312.62 ",
      "price": "240.1 ",
      "image_url": "https://rawnaqstoore.com/images/Original/ce325258-0b37-4882-9488-1645f2c9a416.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/401",
      "route": "/store/product/401",
      "id": "401",
      "name": "سماعة سبيكر سول مقاومة للماء أحمر",
      "original_price": "212.66 ",
      "price": "157.78 ",
      "image_url": "https://rawnaqstoore.com/images/Original/db2083bf-d4a0-4150-adfb-7ce92560713c.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/402",
      "route": "/store/product/402",
      "id": "402",
      "name": "سماعة سبيكر ترونسمارت T6 ايليمنت اسود",
      "original_price": "392 ",
      "price": "309.68 ",
      "image_url": "https://rawnaqstoore.com/images/Original/26c585b1-c7b2-4fcf-b361-8e5f9c28a14e.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/403",
      "route": "/store/product/403",
      "id": "403",
      "name": "سماعة سبيكر ترونسمارت T2 ايليمنت اسود",
      "original_price": "182.28 ",
      "price": "134.26 ",
      "image_url": "https://rawnaqstoore.com/images/Original/22e16402-66f5-4c94-ba05-f99a5b432ad9.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/404",
      "route": "/store/product/404",
      "id": "404",
      "name": "سماعة سبيكر جي بي ال بلس 3",
      "original_price": "1028.02 ",
      "price": "856.52 ",
      "image_url": "https://rawnaqstoore.com/images/Original/f6e3304f-5b75-4bba-ab61-c0768d3f4186.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/405",
      "route": "/store/product/405",
      "id": "405",
      "name": "سماعة سبيكر جي بي ال بلس 3",
      "original_price": "1028.02 ",
      "price": "856.52 ",
      "image_url": "https://rawnaqstoore.com/images/Original/e74646e6-0077-4bfa-bff1-75b62ac5c8ad.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/406",
      "route": "/store/product/406",
      "id": "406",
      "name": "سماعة سبيكر أنكر ساوند كور برو",
      "original_price": "395.92 ",
      "price": "372.4 ",
      "image_url": "https://rawnaqstoore.com/images/Original/d5a808cc-f3b8-4b4c-bde3-6884a716b624.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/407",
      "route": "/store/product/407",
      "id": "407",
      "name": "شاحن لاسلكي موماكس وساعة رقمية ذكية مع مكبر صوت",
      "original_price": "294 ",
      "price": "232.26 ",
      "image_url": "https://rawnaqstoore.com/images/Original/e0e4d28d-f3e7-4384-8527-1f4496bf9f50.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/408",
      "route": "/store/product/408",
      "id": "408",
      "name": "هوم تايم مكبر صوت بلوتوث و منبه وشاحن لاسلكي أبيض D2QI",
      "original_price": "312.62 ",
      "price": "244.02 ",
      "image_url": "https://rawnaqstoore.com/images/Original/6e0c0bd4-56c6-43f6-8ef2-6c12d2c82933.png",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/409",
      "route": "/store/product/409",
      "id": "409",
      "name": "سماعة سبيكر أنكر ساوند كور فلاير 360",
      "original_price": "294 ",
      "price": "253.82 ",
      "image_url": "https://rawnaqstoore.com/images/Original/5324cbbb-3ab7-4194-be52-e95f1725124a.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/410",
      "route": "/store/product/410",
      "id": "410",
      "name": "سماعة سبيكر جي بي ال شارج 4 مقاومة للماء وردي",
      "original_price": "754.6 ",
      "price": "685.02 ",
      "image_url": "https://rawnaqstoore.com/images/Original/ff979d3c-f28d-4506-9980-9982602f7cb0.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/411",
      "route": "/store/product/411",
      "id": "411",
      "name": "سماعة سبيكر أنكر ساوند كور ايكون اسود",
      "original_price": "212.66 ",
      "price": "195.02 ",
      "image_url": "https://rawnaqstoore.com/images/Original/dce0f909-d253-486b-9caa-68351c50a22a.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/412",
      "route": "/store/product/412",
      "id": "412",
      "name": "سماعة سبيكر تيفو دايفوم أسود",
      "original_price": "310.66 ",
      "price": "264.6 ",
      "image_url": "https://rawnaqstoore.com/images/Original/350a92c7-a93b-434f-93c3-c61b0926e1d4.png",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات سبيكر"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/218",
      "route": "/store/product/218",
      "id": "218",
      "name": "سماعة بلوتوث مانعة للضوضاء",
      "image_url": "https://rawnaqstoore.com/images/Original/d6055d6a-dda6-48e7-95db-61d1dc1433dd.jpg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/300",
      "route": "/store/product/300",
      "id": "300",
      "name": "جابرا موف ستايل إيديشن",
      "original_price": "490 ",
      "price": "434.14 ",
      "image_url": "https://rawnaqstoore.com/images/Original/21ddc83b-1991-4662-9124-7d9ce3586ffc.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/301",
      "route": "/store/product/301",
      "id": "301",
      "name": "جابرا موف ستايل إيديشن",
      "original_price": "490 ",
      "price": "437.08 ",
      "image_url": "https://rawnaqstoore.com/images/Original/2e2a9447-85ad-494c-a22c-d2646cdd1a38.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/307",
      "route": "/store/product/307",
      "id": "307",
      "name": "جي بي إل",
      "original_price": "577.22 ",
      "price": "431.2 ",
      "image_url": "https://rawnaqstoore.com/images/Original/902b1980-2015-44fd-a899-4c86e0f4d287.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/309",
      "route": "/store/product/309",
      "id": "309",
      "name": "جي بي إل",
      "original_price": "577.22 ",
      "price": "431.2 ",
      "image_url": "https://rawnaqstoore.com/images/Original/f40d94b8-ade9-4bf3-b6c7-a13574585f52.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    },
    {
      "url": "https://rawnaqstoore.com/store/product/310",
      "route": "/store/product/310",
      "id": "310",
      "name": "جي بي إل",
      "original_price": "479.22 ",
      "price": "431.2 ",
      "image_url": "https://rawnaqstoore.com/images/Original/5d4676d6-c9ab-4de0-8254-a32d541afe7a.jpeg",
      "category": "أجهزة صوت و سماعات",
      "subcategory": "سماعات متنوعه"
    }
  ]
};

export default accessoriesData;
