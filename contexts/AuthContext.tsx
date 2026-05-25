"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { addFavorite, removeFavorite, getUserTypes, getAssetFeed } from '../services/api';
import type { UserRead, UserTypeResponse } from '../services/api-types';

interface AuthContextType {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  user: UserRead | null;
  canSell: boolean;
  cart: number[];
  favoriteIds: Set<number>;
  pendingFavoriteIds: Set<number>;
  isFavorite: (productId: number) => boolean;
  login: (userData: UserRead) => void;
  logout: () => void;
  toggleFavorite: (productId: number) => Promise<void>;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    // Check if window is defined to avoid errors during server-side rendering
    const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading "${key}" from localStorage`, error);
    return defaultValue;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserRead | null>(null);
  const [userTypes, setUserTypes] = useState<UserTypeResponse[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [pendingFavoriteIds, setPendingFavoriteIds] = useState<Set<number>>(new Set());
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredItem('user', null));
    setCart(getStoredItem('cart', []));
    setIsAuthLoading(false);
  }, []);

  const isLoggedIn = !!user;
  
  const canSell = user && userTypes.some(ut => 
    ut.id === user.user_type_id && (ut.type === 'VENDOR' || ut.type === 'BUYER/VENDOR')
  );

  useEffect(() => {
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

  useEffect(() => {
    if (user) {
      setIsFavoritesLoading(true);
      // Assuming a user won't have more than 100 favorites. Adjust if needed.
      getAssetFeed({ only_favorites: true, user_id: user.id, page_size: 100 })
        .then(response => {
          const ids = new Set(response.items.filter(item => item.is_favorite).map(item => item.id));
          setFavoriteIds(ids);
        })
        .catch(error => {
          console.error("Failed to fetch user favorites", error);
        })
        .finally(() => {
          setIsFavoritesLoading(false);
        });
    } else {
      setFavoriteIds(new Set()); // Clear favorites on logout
    }
  }, [user]);

  const login = (userData: UserRead) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    localStorage.removeItem('cart');
  };
  
  const isFavorite = useCallback((productId: number) => {
    return favoriteIds.has(productId);
  }, [favoriteIds]);

  const toggleFavorite = async (productId: number) => {
    if (!user || pendingFavoriteIds.has(productId)) return;

    const currentlyFavorite = favoriteIds.has(productId);
    
    setPendingFavoriteIds(prev => new Set(prev).add(productId));

    const originalFavoriteIds = new Set(favoriteIds);
    const newFavoriteIds = new Set(originalFavoriteIds);
    if (currentlyFavorite) {
      newFavoriteIds.delete(productId);
    } else {
      newFavoriteIds.add(productId);
    }
    setFavoriteIds(newFavoriteIds);

    try {
      if (currentlyFavorite) {
        await removeFavorite(user.id, productId);
      } else {
        await addFavorite(user.id, productId);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setFavoriteIds(originalFavoriteIds);
    } finally {
      setPendingFavoriteIds(prev => {
        const newPending = new Set(prev);
        newPending.delete(productId);
        return newPending;
      });
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
      isAuthLoading,
      user,
      canSell,
      login, 
      logout,
      cart, 
      addToCart, 
      removeFromCart,
      clearCart,
      favoriteIds,
      pendingFavoriteIds,
      isFavorite,
      toggleFavorite
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
