// ملف اختبار لجلب البيانات من السيرفر
const axios = require("axios");

async function testAPI() {
  try {
    console.log("جاري الاتصال بالسيرفر...");
    const response = await axios.get("http://localhost:9000/products");

    console.log("تم الاتصال بالسيرفر بنجاح!");
    console.log("نوع البيانات المستلمة:", typeof response.data);

    if (Array.isArray(response.data)) {
      console.log(
        "البيانات عبارة عن مصفوفة تحتوي على",
        response.data.length,
        "عنصر"
      );

      if (response.data.length > 0) {
        console.log("نموذج للعنصر الأول:");
        console.log(JSON.stringify(response.data[0], null, 2));
      }
    } else if (typeof response.data === "object") {
      console.log("البيانات عبارة عن كائن يحتوي على الخصائص التالية:");
      console.log(Object.keys(response.data));

      // البحث عن أي مصفوفات في الكائن
      for (const key in response.data) {
        if (Array.isArray(response.data[key])) {
          console.log(
            `الخاصية "${key}" تحتوي على مصفوفة من ${response.data[key].length} عنصر`
          );

          if (response.data[key].length > 0) {
            console.log("نموذج للعنصر الأول:");
            console.log(JSON.stringify(response.data[key][0], null, 2));
          }
        } else if (typeof response.data[key] === "object") {
          console.log(
            `الخاصية "${key}" عبارة عن كائن، خصائصه: ${Object.keys(
              response.data[key]
            )}`
          );

          // التحقق من الخصائص الداخلية
          for (const subKey in response.data[key]) {
            console.log(
              `  - الخاصية "${subKey}" نوعها: ${typeof response.data[key][
                subKey
              ]}`
            );

            if (Array.isArray(response.data[key][subKey])) {
              console.log(
                `    تحتوي على مصفوفة من ${response.data[key][subKey].length} عنصر`
              );

              if (response.data[key][subKey].length > 0) {
                console.log("    نموذج للعنصر الأول:");
                console.log(
                  "    " +
                    JSON.stringify(
                      response.data[key][subKey][0],
                      null,
                      2
                    ).replace(/\n/g, "\n    ")
                );
              }
            }
          }
        } else {
          console.log(
            `الخاصية "${key}" ليست مصفوفة أو كائن، نوعها: ${typeof response
              .data[key]}`
          );
        }
      }

      // تحويل الكائن إلى مصفوفة من المنتجات
      let allProducts = [];

      // البحث عن المنتجات في المستوى الأول
      for (const key in response.data) {
        if (Array.isArray(response.data[key])) {
          allProducts = allProducts.concat(response.data[key]);
        } else if (typeof response.data[key] === "object") {
          // البحث في المستوى الثاني
          for (const subKey in response.data[key]) {
            if (Array.isArray(response.data[key][subKey])) {
              allProducts = allProducts.concat(response.data[key][subKey]);
              console.log(
                `تم إضافة ${response.data[key][subKey].length} منتج من ${key}.${subKey}`
              );
            } else if (
              typeof response.data[key][subKey] === "object" &&
              response.data[key][subKey] !== null
            ) {
              // البحث في المستوى الثالث
              for (const subSubKey in response.data[key][subKey]) {
                if (Array.isArray(response.data[key][subKey][subSubKey])) {
                  allProducts = allProducts.concat(
                    response.data[key][subKey][subSubKey]
                  );
                  console.log(
                    `تم إضافة ${response.data[key][subKey][subSubKey].length} منتج من ${key}.${subKey}.${subSubKey}`
                  );
                }
              }
            }
          }
        }
      }

      console.log(`إجمالي عدد المنتجات بعد التحويل: ${allProducts.length}`);
      if (allProducts.length > 0) {
        console.log("خصائص المنتجات:");
        console.log(Object.keys(allProducts[0]));
      }
    } else {
      console.log("البيانات من نوع غير متوقع:", response.data);
    }
  } catch (error) {
    console.error("حدث خطأ أثناء الاتصال بالسيرفر:", error.message);
    if (error.response) {
      console.error(
        "استجابة السيرفر:",
        error.response.status,
        error.response.statusText
      );
    } else if (error.request) {
      console.error("لم يتم استلام استجابة من السيرفر");
    }
  }
}

// تنفيذ الاختبار
testAPI();
