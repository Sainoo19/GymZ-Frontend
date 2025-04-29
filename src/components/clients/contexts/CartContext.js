import React, { createContext, useState, useRef } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cartIconRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  
  const addToCart = (quantity) => {
    setCartCount(prev => prev + quantity);
  };

  return (
    <CartContext.Provider value={{ cartIconRef, cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
