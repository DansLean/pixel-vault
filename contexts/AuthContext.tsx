"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addFavorite, removeFavorite, getUserTypes } from '../services/api';
import type { UserRead, UserTypeResponse } from '../services/api-types';

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserRead | null;
  canSell: boolean;
  cart: number[];
  login: (userData: UserRead) => void;
  logout: () => void;
  toggleFavorite: (productId: number, isFavorite: boolean) => Promise<void>;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to safely parse JSON from localStorage
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading "${key}" from localStorage`, error);
    return defaultValue;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserRead | null>(() => getStoredItem('user', null));
  const [userTypes, setUserTypes] = useState<UserTypeResponse[]>([]);
  const [cart, setCart] = useState<number[]>(() => getStoredItem('cart', []));

  const isLoggedIn = !!user;
  
  // Determine if the user has selling privileges
  const canSell = user && userTypes.some(ut => 
    ut.id === user.user_type_id && (ut.type === 'VENDOR' || ut.type === 'BUYER/VENDOR')
  );

  useEffect(() => {
    // Fetch all user types on initial load to map IDs to names
    const fetchUserTypes = async () => {
      try {
        const types = await getUserTypes();
        setUserTypes(types);
      } catch (error) {
        console.error("Failed to fetch user types", error);
      }
    };
    fetchUserTypes();
  }, []);

  const login = (userData: UserRead) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Optionally clear cart on logout as well
    // localStorage.removeItem('cart');
    // setCart([]);
  };

  const toggleFavorite = async (productId: number, isFavorite: boolean) => {
    if (!user) return;
    try {
      if (isFavorite) {
        await removeFavorite(user.id, productId);
      } else {
        await addFavorite(user.id, productId);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const addToCart = (productId: number) => {
    setCart(prevCart => {
      if (prevCart.includes(productId)) return prevCart;
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

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn,
      user,
      canSell,
      login, 
      logout,
      toggleFavorite,
      cart, 
      addToCart, 
      removeFromCart,
      clearCart
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
