"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BannerCarousel from "@/components/BannerCarousel";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import { getAssetFeed } from "@/services/api";
import { AssetFeedItem } from "@/services/api-types";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const [products, setProducts] = useState<AssetFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getAssetFeed(userId);
        setProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Optionally, set an error state to show a message to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [userId]); // Refetch when user logs in/out

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navigation */}
      <Navbar />

      <main>
        {/* Banner carousel */}
        <BannerCarousel />

        {/* Filter bar */}
        <FilterBar />

        {/* Product grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
            Carregando produtos...
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "3px solid var(--bg-card-border)",
          backgroundColor: "var(--bg-navbar)",
          padding: "24px 20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--color-text-secondary)",
            letterSpacing: "0.5px",
          }}
        >
          © 2026 Pixel Vault · Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
