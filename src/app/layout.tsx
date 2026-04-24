import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { CartProvider } from "@/contexts/CartContext";
import { ProductsProvider } from "@/contexts/ProductsContext";

const cairo = localFont({
  src: "../../public/fonts/Cairo/Cairo-VariableFont_slnt,wght.ttf",
  display: "swap",
});

const tajawal = localFont({
  src: [
    {
      path: "../../public/fonts/Tajawal/Tajawal-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Tajawal/Tajawal-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AliiExpress UAE - متجر الهواتف الذكية والإلكترونيات",
  description: "متجر إلكتروني متخصص في بيع الهواتف الذكية والإلكترونيات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.className} ${tajawal.variable} antialiased`}
      >
        <CartProvider>
          <ProductsProvider>
            <div className="flex flex-col min-h-screen">{children}</div>
            <FloatingWhatsAppButton />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={true}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ProductsProvider>
        </CartProvider>
      </body>
    </html>
  );
}
