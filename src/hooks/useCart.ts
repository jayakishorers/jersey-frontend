import { useState, useCallback, useEffect } from 'react';
import { CartItem, Jersey } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

 const addToCart = useCallback((jersey: Jersey, size: string, quantity: number = 1, isFullSleeve: boolean = false) => {
  setCartItems(prev => {
    const existingItem = prev.find(item => item.jersey.id === jersey.id && item.size === size);
    const availableStock = jersey.stockBySize?.[size] ?? 0;
    
    if (existingItem) {
      // Check if adding more would exceed stock
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > availableStock) {
        // Only add up to available stock
        const maxAddable = availableStock - existingItem.quantity;
        if (maxAddable <= 0) {
          return prev; // Can't add any more
        }
        return prev.map(item =>
          item.jersey.id === jersey.id && item.size === size
            ? { ...item, quantity: availableStock }
            : item
        );
      }
      return prev.map(item =>
        item.jersey.id === jersey.id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      );
    } else {
      // Check if initial quantity exceeds stock
      const finalQuantity = Math.min(quantity, availableStock);
      if (finalQuantity <= 0) {
        return prev; // Can't add if no stock
      }
      return [...prev, {
        id: `${jersey.id}-${size}`,
        jersey: { ...jersey, isFullSleeve },
        size,
        quantity: finalQuantity,
        addedAt: new Date()
      }];
    }
  });
}, []);


  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number, maxStock?: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    // Validate against stock if provided
    const finalQuantity = maxStock ? Math.min(quantity, maxStock) : quantity;
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: finalQuantity } : item
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