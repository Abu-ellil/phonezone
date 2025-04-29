"use client";
import { createContext, useContext, useState, useEffect } from "react";

// إنشاء السياق
const CartContext = createContext();

// تعريف نوع عنصر السلة
export function convertCartItemToOrderItem(cartItem) {
  return {
    id: cartItem.id,
    name: cartItem.name,
    price: cartItem.price,
    quantity: cartItem.quantity,
    image_url: cartItem.image_url,
    variant: cartItem.variant,
    version: cartItem.version,
  };
}

// مزود السياق
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // استرجاع السلة من التخزين المحلي عند تحميل الصفحة
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        updateCartCount(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // تحديث التخزين المحلي عند تغيير السلة
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }
    updateCartCount(cartItems);
  }, [cartItems]);

  // تحديث عدد العناصر في السلة
  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  // إضافة منتج إلى السلة
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
      const existingItemIndex = prevItems.findIndex(
        (item) => 
          item.id === product.id && 
          item.variant === product.variant &&
          item.version === product.version
      );

      if (existingItemIndex !== -1) {
        // إذا كان المنتج موجودًا، قم بزيادة الكمية
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // إذا لم يكن المنتج موجودًا، أضفه إلى السلة
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // إزالة منتج من السلة
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // تحديث كمية منتج في السلة
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // حساب المجموع الفرعي للسلة
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  // مسح السلة
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // القيمة التي سيتم توفيرها للمكونات
  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateSubtotal,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// هوك مخصص لاستخدام سياق السلة
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useCart داخل CartProvider");
  }
  return context;
}
