"use client";

import React, { useState, useEffect } from 'react';
import { SORT_OPTIONS, PRICE_RANGES } from '@/lib/mock-data';
import type { CategoryReadWithChildren, AssetFilterParams } from '@/services/api-types';

// This is the styled, custom dropdown from the previous version of the file.
// I'm keeping it as a sub-component.
function FilterDropdown({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || label;

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 14px",
          backgroundColor: "var(--bg-filter)",
          border: "3px solid #2a1500",
          borderRadius: 0,
          cursor: "pointer",
          fontFamily: "var(--font-pixel)",
          fontSize: "9px",
          color: "var(--color-text-primary)",
          whiteSpace: "nowrap",
          lineHeight: 1,
          boxShadow: open ? "inset 1px 1px 0 rgba(0,0,0,0.2)" : "none",
          outline: "none",
        }}
      >
        <span>{selectedLabel}</span>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", lineHeight: 1, display: "inline-block", transform: open ? "scaleY(-1)" : "none", transition: "transform 0.15s" }}>
          ∨
        </span>
      </button>

      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, minWidth: "100%", backgroundColor: "var(--bg-filter)", border: "3px solid #2a1500", borderTop: "none", zIndex: 50, overflow: "hidden" }}>
          {options.map((opt) => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  backgroundColor: isActive ? "#88c8e8" : "transparent",
                  border: "none",
                  borderTop: "2px solid rgba(42,21,0,0.15)",
                  cursor: "pointer",
                  fontFamily: "var(--font-pixel)",
                  fontSize: "9px",
                  color: "var(--color-text-primary)",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  transition: "background-color 0.1s",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(136,200,232,0.5)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}



interface FilterBarProps {
  categories: CategoryReadWithChildren[];
  filters: AssetFilterParams;
  onFilterChange: (filters: Partial<AssetFilterParams>) => void;
}

export default function FilterBar({ categories, filters, onFilterChange }: FilterBarProps) {
  // Populate category options from props
  const categoryOptions = [{ value: '', label: 'Todas as Categorias' }];
  categories.forEach(cat => {
    categoryOptions.push({ value: String(cat.id), label: cat.name });
    if (cat.children) {
      cat.children.forEach(subCat => {
        categoryOptions.push({ value: String(subCat.id), label: `  ↳ ${subCat.name}` });
      });
    }
  });

  const priceOptions = PRICE_RANGES.map((range, index) => ({ value: String(index), label: range }));
  const sortOptions = SORT_OPTIONS.map(opt => ({ value: opt, label: opt }));
  
  // Handlers for dropdowns
  const handleCategoryChange = (value: string) => {
    onFilterChange({ category_id: value ? Number(value) : undefined });
  };

  const handlePriceChange = (value: string) => {
    let price_min: number | undefined;
    let price_max: number | undefined;
    
    if (value === '1') { price_min = 0; price_max = 20; }
    else if (value === '2') { price_min = 20; price_max = 50; }
    else if (value === '3') { price_min = 50; price_max = 100; }
    else if (value === '4') { price_min = 100; price_max = undefined; }
    
    onFilterChange({ price_min, price_max });
  };

  // Determine the selected price range index based on filters prop
  const getPriceIndex = () => {
    if (filters.price_min === 0 && filters.price_max === 20) return '1';
    if (filters.price_min === 20 && filters.price_max === 50) return '2';
    if (filters.price_min === 50 && filters.price_max === 100) return '3';
    if (filters.price_min === 100 && filters.price_max === undefined) return '4';
    return '0'; // Default to "Todos os Preços"
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "32px auto 0", // Added top margin
        padding: "20px",
        backgroundColor: "var(--bg-navbar)",
        border: "3px solid var(--bg-card-border)",
        borderRadius: "var(--radius-card)",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Filter Dropdowns */}
      <FilterDropdown
        label="Todas as Categorias"
        value={String(filters.category_id || '')}
        options={categoryOptions}
        onChange={handleCategoryChange}
      />
      <FilterDropdown
        label="Ordenar por"
        value={sortOptions[0].value}
        options={sortOptions}
        onChange={() => { /* Dummy, sorting is fixed on backend */ }}
      />
      <FilterDropdown
        label="Todos os Preços"
        value={getPriceIndex()}
        options={priceOptions}
        onChange={handlePriceChange}
      />
    </div>
  );
}
