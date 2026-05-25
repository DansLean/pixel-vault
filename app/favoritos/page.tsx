"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAssetFeed } from "@/services/api";
import type { AssetFeedItem } from "@/services/api-types";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";

export default function FavoritesPage() {
    const { user, isLoggedIn, isAuthLoading } = useAuth();
  const userId = user?.id;
  const [favoriteProducts, setFavoriteProducts] = useState<AssetFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Don't do anything until the auth state is confirmed from the client
    if (isAuthLoading) {
      return;
    }

    if (!isLoggedIn || !userId) {
      // If not logged in after auth check, there are no favorites.
      setIsLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      // No need to set isLoading(true) here as it's the default
      try {
        const response = await getAssetFeed({ only_favorites: true, user_id: userId, page_size: 100 });
        setFavoriteProducts(response.items); // Trust the API to return only favorites
      } catch (error) {
        console.error("Failed to fetch favorite products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [userId, isLoggedIn, isAuthLoading]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
          Carregando seus favoritos...
        </p>
      );
    }

    if (favoriteProducts.length > 0) {
      return <ProductGrid products={favoriteProducts} />;
    }

    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'var(--bg-navbar)',
        border: '3px solid var(--bg-card-border)',
        borderRadius: 'var(--radius-card)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          color: 'var(--color-text-secondary)',
          fontWeight: 600
        }}>
          Você ainda não adicionou nenhum item aos seus favoritos.
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          marginTop: '8px',
        }}>
          Clique no coração dos produtos para guardá-los aqui!
        </p>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px 60px" }}>
        <h1 style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "24px",
          color: "var(--color-text-primary)",
          marginBottom: "32px",
          textAlign: "center",
        }}>
          Meus Favoritos
        </h1>
        {renderContent()}
      </main>
    </div>
  );
}
