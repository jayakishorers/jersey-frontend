import { useState, useCallback } from 'react';
import { CartItem, Jersey } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

 const addToCart = useCallback((jersey: Jersey, size: string, quantity: number = 1, isFullSleeve: boolean = false) => {
  setCartItems(prev => {
    const existingItem = prev.find(item => item.jersey.id === jersey.id && item.size === size);
    
    if (existingItem) {
      return prev.map(item =>
        item.jersey.id === jersey.id && item.size === size
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      return [...prev, {
        id: `${jersey.id}-${size}`,
        jersey: { ...jersey, isFullSleeve }, // ✅ store it here
        size,
        quantity,
        addedAt: new Date()
      }];
    }
  });
}, []);


  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.jersey.price * item.quantity), 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };
};