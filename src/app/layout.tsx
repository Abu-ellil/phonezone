import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { CartProvider } from "@/contexts/CartContext";
import { ProductsProvider } from "@/contexts/ProductsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
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
