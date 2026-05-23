"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addFavorite, removeFavorite } from '../services/api';

interface AuthContextType {
  isLoggedIn: boolean;
  userId: number | null;
  cart: number[];
  login: () => void;
  logout: () => void;
  toggleFavorite: (productId: number, isFavorite: boolean) => Promise<void>;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [cart, setCart] = useState<number[]>([]);

  useEffect(() => {
    const storedAuthState = localStorage.getItem('isLoggedIn');
    if (storedAuthState === 'true') {
      setIsLoggedIn(true);
    }
    
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(JSON.parse(storedUserId));
    }
    
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const login = () => {
    const mockUserId = 2; // Simulate login with user ID 2
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', JSON.stringify(mockUserId));
    setIsLoggedIn(true);
    setUserId(mockUserId);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
  };

  const toggleFavorite = async (productId: number, isFavorite: boolean) => {
    if (!userId) {
      // Should not happen if UI is correct, but as a safeguard
      console.error("User is not logged in. Cannot toggle favorite.");
      // In a real app, you might want to redirect to login
      // window.location.href = '/login';
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(userId, productId);
      } else {
        await addFavorite(userId, productId);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Optionally, show a toast or notification to the user
    }
  };

  const addToCart = (productId: number) => {
    setCart(prevCart => {
      if (prevCart.includes(productId)) {
        return prevCart;
      }
      const newCart = [...prevCart, productId];
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(id => id !== productId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, login, logout, 
      userId,
      toggleFavorite,
      cart, addToCart, removeFromCart
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
