"use client";

import { useState, useRef, useEffect } from "react";
import { SORT_OPTIONS, PRICE_RANGES, GENRES } from "@/lib/mock-data";

type FilterBarProps = {
  onSortChange?: (value: string) => void;
  onPriceChange?: (value: string) => void;
  onGenreChange?: (value: string) => void;
};

export default function FilterBar({
  onSortChange,
  onPriceChange,
  onGenreChange,
}: FilterBarProps) {
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0]);
  const [activePrice, setActivePrice] = useState(PRICE_RANGES[0]);
  const [activeGenre, setActiveGenre] = useState(GENRES[0]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px 20px 0",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <FilterDropdown
        value={activeSort}
        options={SORT_OPTIONS}
        onChange={(v) => {
          setActiveSort(v);
          onSortChange?.(v);
        }}
      />
      <FilterDropdown
        value={activePrice}
        options={PRICE_RANGES}
        onChange={(v) => {
          setActivePrice(v);
          onPriceChange?.(v);
        }}
      />
      <FilterDropdown
        value={activeGenre}
        options={GENRES}
        onChange={(v) => {
          setActiveGenre(v);
          onGenreChange?.(v);
        }}
      />
    </div>
  );
}

function FilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 14px",
          backgroundColor: "var(--bg-filter)",
          /* Pixel-art border: solid 3px, no radius */
          border: "3px solid #2a1500",
          borderRadius: 0,
          cursor: "pointer",
          fontFamily: "var(--font-pixel)",
          fontSize: "9px",
          color: "var(--color-text-primary)",
          whiteSpace: "nowrap",
          lineHeight: 1,
          /* Pressed state */
          boxShadow: open
            ? "inset 1px 1px 0 rgba(0,0,0,0.2)"
            : "none",
          outline: "none",
        }}
      >
        <span>{value}</span>
        {/* Pixel chevron */}
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            lineHeight: 1,
            display: "inline-block",
            transform: open ? "scaleY(-1)" : "none",
            transition: "transform 0.15s",
          }}
        >
          ∨
        </span>
      </button>

      {/* Dropdown panel — sits directly below the button, same left edge */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            minWidth: "100%",
            backgroundColor: "var(--bg-filter)",
            border: "3px solid #2a1500",
            borderTop: "none",           /* merges visually with button */
            borderRadius: 0,
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {options.map((opt) => {
            const isActive = opt === value;
            return (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
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
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(136,200,232,0.5)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

