"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import BannerCarousel from "@/components/BannerCarousel";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import { getAssetFeed, getCategoriesTree } from "@/services/api";
import { AssetFeedItem, AssetFilterParams, CategoryReadWithChildren } from "@/services/api-types";
import { useAuth } from "@/contexts/AuthContext";

function SearchResult() {
  const [products, setProducts] = useState<AssetFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryReadWithChildren[]>([]);
  const { user } = useAuth();
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memoize filters to prevent re-fetching on every render
  const filters: AssetFilterParams = useMemo(() => {
    const params: AssetFilterParams = { user_id: user?.id };
    const title = searchParams.get('title');
    const categoryId = searchParams.get('category_id');
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');

    if (title) params.title = title;
    if (categoryId) params.category_id = Number(categoryId);
    if (priceMin) params.price_min = Number(priceMin);
    if (priceMax) params.price_max = Number(priceMax);
    
    return params;
  }, [searchParams, user]);

  // Fetch categories for the filter bar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesTree = await getCategoriesTree();
        setCategories(categoriesTree);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getAssetFeed(filters);
        setProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<AssetFilterParams>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || String(value).trim() === '') {
            current.delete(key);
        } else {
            current.set(key, String(value));
        }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    if (searchParams.toString() !== current.toString()) {
      router.push(`${pathname}${query}`);
    }
  };
  
  const getCategoryNameById = (id: number): string | null => {
    for (const cat of categories) {
        if (cat.id === id) return cat.name;
        if (cat.children) {
            for (const subCat of cat.children) {
                if (subCat.id === id) return subCat.name;
            }
        }
    }
    return null;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)' }}>
          Carregando produtos...
        </div>
      );
    }
    
    if (products.length === 0) {
        let message = "Nenhum resultado encontrado";
        if(filters.title) {
            message += ` para "${filters.title}"`;
        }
        if(filters.category_id) {
            const categoryName = getCategoryNameById(filters.category_id);
            if(categoryName) {
                message += ` na categoria "${categoryName}"`;
            }
        }
        message += ".";

        return (
            <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                {message}
            </div>
        )
    }

    return <ProductGrid products={products} />;
  }

  return (
    <>
      <FilterBar 
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      {renderContent()}
    </>
  );
}


export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navigation */}
      <Navbar />

      <main>
        {/* Banner carousel */}
        <BannerCarousel />
        
        {/* Suspense boundary for client components that use searchParams */}
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px 20px' }}>Carregando filtros...</div>}>
            <SearchResult />
        </Suspense>
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
