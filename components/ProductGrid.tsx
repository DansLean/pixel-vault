"use client";

import { AssetFeedItem } from "@/services/api-types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: AssetFeedItem[] }) {
  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px 20px 40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load more */}
      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <button
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            padding: "14px 32px",
            borderRadius: "var(--radius-sm)",
            border: "3px solid var(--bg-card-border)",
            cursor: "pointer",
            boxShadow: "var(--shadow-card)",
            transition: "all 0.15s ease",
            letterSpacing: "0.5px",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = "var(--bg-card-hover)";
            el.style.transform = "translateY(-2px)";
            el.style.boxShadow = "var(--shadow-card-hover)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.backgroundColor = "var(--bg-card)";
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "var(--shadow-card)";
          }}
        >
          Carregar Mais
        </button>
      </div>
    </section>
  );
}
