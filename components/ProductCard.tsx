"use client";

import { useState } from "react";
import type { AssetFeedItem } from "@/services/api-types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type ProductCardProps = {
  product: AssetFeedItem;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { isLoggedIn, toggleFavorite, cart, addToCart } = useAuth();
  const [isFavorite, setIsFavorite] = useState(product.is_favorite);
  const isInCart = cart.includes(product.id);
  const router = useRouter();

  const [hovered, setHovered] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    // Optimistic update
    setIsFavorite(!isFavorite);
    try {
      await toggleFavorite(product.id, isFavorite);
    } catch (error) {
        // Revert on error
        setIsFavorite(isFavorite);
        console.error("Failed to toggle favorite", error);
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart) {
      addToCart(product.id);
    }
  };

  return (
    <Link
      href={`/produto/${product.id}`}
      passHref
      style={{ textDecoration: 'none', display: 'flex' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article
        className="product-card-anim"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "3px solid var(--bg-card-border)",
          borderRadius: "var(--radius-card)",
          overflow: "hidden",
          boxShadow: hovered
            ? "var(--shadow-card-hover)"
            : "var(--shadow-card)",
          transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          display: "flex",
          flexDirection: "column",
          width: "100%", 
        }}
      >
        {/* Product image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "65%",
            backgroundColor: "#d4d0cc",
            overflow: "hidden",
            borderBottom: "3px solid var(--bg-card-border)",
          }}
        >
          {/* If there's a cover picture, show it */}
          {product.cover_picture ? (
            <img 
              src={product.cover_picture} 
              alt={product.name} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #b8b4b0, #d4d0cc)",
              }}
            >
              <span style={{ fontSize: "52px", filter: "grayscale(0.2)" }}>🚂</span>
            </div>
          )}

          {/* Category badge */}
          {product.category_name && (
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                right: "8px",
                backgroundColor: "var(--color-text-primary)",
                color: "var(--color-white)",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: "6px",
                letterSpacing: "0.3px",
              }}
            >
              {product.category_name}
            </div>
          )}

          {/* Hover overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(200,131,42,0.15)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          />
        </div>

        {/* Info */}
        <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {/* Product name */}
          <h3
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "10px",
              color: "var(--color-text-primary)",
              lineHeight: 1.5,
              letterSpacing: "-0.3px",
              marginBottom: "2px",
            }}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "11px",
              color: "var(--color-text-primary)",
              letterSpacing: "-0.3px",
            }}
          >
            {parseFloat(product.price).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          {/* Stars */}
          <StarRating rating={product.average_rating} count={product.review_count} />

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "auto", // Push actions to the bottom
              paddingTop: "8px",
            }}
          >
            {/* Heart button */}
            <button
              onClick={handleFavoriteClick}
              title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.15s ease",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-9-6-9-12a6 6 0 0 1 9-5.2A6 6 0 0 1 21 9c0 6-9 12-9 12z"
                  fill={isFavorite ? "var(--color-heart)" : "none"}
                  stroke={isFavorite ? "var(--color-heart)" : "var(--color-text-primary)"}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Add to cart */}
            <button
              onClick={handleCartClick}
              style={{
                flex: 1,
                backgroundColor: isInCart ? "var(--color-green)" : "var(--color-text-primary)",
                color: "var(--color-white)",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 800,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                cursor: isInCart ? 'default' : 'pointer',
                transition: "background-color 0.3s ease",
                boxShadow: "0 2px 0 rgba(0,0,0,0.3)",
                letterSpacing: "0.3px",
              }}
              disabled={isInCart}
            >
              {isInCart ? "✓ Adicionado!" : "Comprar"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

function StarRating({ rating, count }: { rating: number | null; count: number }) {
  const effectiveRating = rating ?? 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M8 1.5l1.8 3.6 4 .58-2.9 2.82.69 3.98L8 10.35l-3.59 1.88.69-3.98L2.2 5.68l4-.58L8 1.5z"
              fill={star <= effectiveRating ? "var(--color-star)" : "rgba(42,21,0,0.2)"}
              stroke={star <= effectiveRating ? "#c8a000" : "rgba(42,21,0,0.15)"}
              strokeWidth="0.5"
            />
          </svg>
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--color-text-secondary)",
        }}
      >
        ({count})
      </span>
    </div>
  );
}