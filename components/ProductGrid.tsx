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

    </section>
  );
}
