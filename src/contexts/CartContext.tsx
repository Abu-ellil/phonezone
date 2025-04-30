"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Define the CartItem type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  original_price?: string;
  quantity: number;
  image_url: string;
  category: string;
  subcategory?: string;
  variant?: string | null;
  version?: string;
}

// Convert cart item to order item
export function convertCartItemToOrderItem(cartItem: CartItem) {
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

// Define the context type
interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  calculateSubtotal: () => number;
  clearCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Context provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on page load
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

  // Update localStorage when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }
    updateCartCount(cartItems);
  }, [cartItems]);

  // Update cart count
  const updateCartCount = (items: CartItem[]) => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  // Add product to cart
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.variant === product.variant &&
          item.version === product.version
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // Update product quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate cart subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const value: CartContextType = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateSubtotal,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
