import React, { createContext, useContext, useState } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedColor: string, selectedSize: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedColor: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedColor: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, selectedColor: string, selectedSize: string, quantity: number) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prevCart, { product, selectedColor, selectedSize, quantity }];
    });
  };

  const removeFromCart = (productId: string, selectedColor: string, selectedSize: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize)));
  };

  const updateQuantity = (productId: string, selectedColor: string, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId && item.selectedColor === selectedColor && item.selectedSize === selectedSize
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe ser usado dentro de un CartProvider');
  return context;
};
