"use client";

import { AssetFeedItem, CategoryReadWithChildren } from "@/services/api-types";
import ProductCard from "./ProductCard";
import { useMemo } from "react";

type Props = {
  products: AssetFeedItem[];
  categoryTree: CategoryReadWithChildren[];
}

function findCategoryPath(nodes: CategoryReadWithChildren[], targetId: number, path: string[] = []): string[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node.name];
    if (node.id === targetId) {
      return currentPath;
    }
    if (node.children) {
      const foundPath = findCategoryPath(node.children, targetId, currentPath);
      if (foundPath) {
        return foundPath;
      }
    }
  }
  return null;
}

export default function ProductGrid({ products, categoryTree }: Props) {
  
  const categoryPathMap = useMemo(() => {
    const map = new Map<number, string>();
    if (!categoryTree) return map;

    for (const product of products) {
      if (product.category_id && !map.has(product.category_id)) {
        const pathArray = findCategoryPath(categoryTree, product.category_id);
        map.set(product.category_id, pathArray ? pathArray.join(' > ') : (product.category_name || ''));
      }
    }
    return map;
  }, [products, categoryTree]);

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
          <ProductCard 
            key={product.id} 
            product={product} 
            categoryPath={product.category_id ? categoryPathMap.get(product.category_id) || '' : ''}
          />
        ))}
      </div>

    </section>
  );
}
