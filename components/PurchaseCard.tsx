"use client";

import { useAuth } from "@/contexts/AuthContext";

type Props = {
  productId: number;
  category: string;
  creator: string;
  price: number;
  rating: number;
  ratingCount: number;
};

export default function PurchaseCard({
  productId,
  category,
  creator,
  price,
  rating,
  ratingCount,
}: Props) {
  const { cart, addToCart, isLoggedIn, isFavorite, toggleFavorite, pendingFavoriteIds } = useAuth();
  const isInCart = cart.includes(productId);
  const isProductFavorite = isFavorite(productId);
  const isFavoritePending = pendingFavoriteIds.has(productId);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-navbar)",
        border: "3px solid var(--bg-card-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-card)",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* Category + creator */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "11px",
            color: "var(--color-text-primary)",
            letterSpacing: "-0.3px",
            marginBottom: "6px",
          }}
        >
          {category}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          por{" "}
          <span
            style={{
              color: "#2a6aaa",
              fontWeight: 800,
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationColor: "transparent",
              transition: "text-decoration-color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.textDecorationColor = "#2a6aaa")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.textDecorationColor = "transparent")
            }
          >
            {creator}
          </span>
        </p>
      </div>

      {/* Star rating */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5l1.8 3.6 4 .58-2.9 2.82.69 3.98L8 10.35l-3.59 1.88.69-3.98L2.2 5.68l4-.58L8 1.5z"
              fill={s <= rating ? "var(--color-star)" : "rgba(42,21,0,0.15)"}
              stroke={s <= rating ? "#c8a000" : "rgba(42,21,0,0.1)"}
              strokeWidth="0.5"
            />
          </svg>
        ))}
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          ({ratingCount} avaliações)
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: "2px", backgroundColor: "rgba(122,79,16,0.15)" }} />

      {/* Price */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "40px",
            fontWeight: 900,
            color: "var(--color-text-primary)",
            letterSpacing: "-1px",
            lineHeight: 1,
          }}
        >
          {price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
        {isLoggedIn && (
            <button
                onClick={() => toggleFavorite(productId)}
                title={isProductFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                disabled={isFavoritePending}
                style={{
                    width: '51px',
                    height: '51px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-card)',
                    border: '3px solid var(--bg-card-border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: isFavoritePending ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: "0 4px 0 rgba(0,0,0,0.15)",
                    opacity: isFavoritePending ? 0.5 : 1,
                    transition: 'opacity 0.2s'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.29998 4.8 2.49998 8.2 2.49998C9.89 2.49998 11.45 3.29998 12 4.48998C12.55 3.29998 14.11 2.49998 15.8 2.49998C19.2 2.49998 22 5.29998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                        stroke="var(--color-red)"
                        strokeWidth="1.5"
                        fill={isProductFavorite ? 'var(--color-red)' : 'none'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        )}
        <button
            onClick={() => addToCart(productId)}
            disabled={isInCart}
            style={{
                flex: 1,
                height: '51px',
                padding: "14px",
                backgroundColor: isInCart ? "var(--color-green)" : "var(--color-text-primary)",
                color: "var(--color-white)",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 800,
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: isInCart ? 'default' : 'pointer',
                boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                transition: "all 0.2s ease",
                letterSpacing: "0.3px",
            }}
        >
            {isInCart ? "✓ Adicionado" : "Adicionar ao carrinho"}
        </button>
      </div>
    </div>
  );
}
