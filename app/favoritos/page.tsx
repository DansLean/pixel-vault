"use client";

import { useAuth } from "@/contexts/AuthContext";
import { PRODUCTS } from "@/lib/mock-data";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/lib/mock-data";

export default function FavoritesPage() {
  const { favorites } = useAuth();
  
  // Filter the main product list to get only the favorited products.
  const favoriteProducts: Product[] = PRODUCTS.filter(product => favorites.includes(product.id));

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
        
        {favoriteProducts.length > 0 ? (
          <ProductGrid products={favoriteProducts} />
        ) : (
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
        )}
      </main>
    </div>
  );
}
