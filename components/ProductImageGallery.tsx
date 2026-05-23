"use client";

import { useState } from "react";
import type { AssetPictureRead } from "@/services/api-types";

type Props = {
  images: AssetPictureRead[];
  productName: string;
};

export default function ProductImageGallery({ images, productName }: Props) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
        <div style={{
            position: "relative",
            width: "100%",
            paddingTop: "66%",
            borderRadius: "var(--radius-card)",
            border: "3px solid var(--bg-card-border)",
            boxShadow: "var(--shadow-card)",
            overflow: "hidden",
            background: 'var(--bg-card)',
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img 
                    src="/file.svg" 
                    alt="Sem imagem" 
                    style={{
                        width: '80px',
                        height: '80px',
                        opacity: 0.15,
                    }}
                />
            </div>
        </div>
    );
  }

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  const img = images[current];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Main image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "66%",
          borderRadius: "var(--radius-card)",
          border: "3px solid var(--bg-card-border)",
          boxShadow: "var(--shadow-card)",
          overflow: "hidden",
          background: 'var(--bg-card-hover)',
        }}
      >
        <img
          src={img.data}
          alt={`${productName} — imagem ${current + 1} de ${images.length}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />

        {/* Pixel left arrow */}
        <GalleryArrow direction="left" onClick={prev} />
        {/* Pixel right arrow */}
        <GalleryArrow direction="right" onClick={next} />

        {/* Counter badge */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "14px",
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "rgba(42,21,0,0.7)",
            background: "rgba(255,248,238,0.75)",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid rgba(122,79,16,0.2)",
          }}
        >
          {current + 1}/{images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div style={{ display: "flex", gap: "10px" }}>
        {images.map((thumb, i) => (
          <button
            key={thumb.id}
            onClick={() => setCurrent(i)}
            aria-label={`Ver imagem ${i + 1}`}
            style={{
              flex: 1,
              paddingTop: "20%",
              position: "relative",
              borderRadius: "10px",
              border: i === current
                ? "3px solid var(--bg-card-border)"
                : "3px solid transparent",
              background: 'var(--bg-card-hover)',
              cursor: "pointer",
              overflow: "hidden",
              outline: "none",
              boxShadow: i === current ? "var(--shadow-card)" : "none",
              opacity: i === current ? 1 : 0.55,
              transition: "opacity 0.15s, border-color 0.15s, box-shadow 0.15s",
            }}
          >
            <img
              src={thumb.data}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* Pixel art SVG arrow — same visual style as the home carousel */
function GalleryArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Imagem anterior" : "Próxima imagem"}
      style={{
        position: "absolute",
        top: "50%",
        [direction]: "14px",
        transform: "translateY(-50%)",
        zIndex: 10,
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        lineHeight: 1,
      }}
    >
      <svg
        width="40"
        height="48"
        viewBox="0 0 40 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: "pixelated" }}
      >
        {direction === "left" ? (
          <>
            <rect x="20" y="4"  width="8" height="8" fill="#2a1500" />
            <rect x="12" y="12" width="8" height="8" fill="#2a1500" />
            <rect x="4"  y="20" width="8" height="8" fill="#2a1500" />
            <rect x="12" y="28" width="8" height="8" fill="#2a1500" />
            <rect x="20" y="36" width="8" height="8" fill="#2a1500" />
          </>
        ) : (
          <>
            <rect x="12" y="4"  width="8" height="8" fill="#2a1500" />
            <rect x="20" y="12" width="8" height="8" fill="#2a1500" />
            <rect x="28" y="20" width="8" height="8" fill="#2a1500" />
            <rect x="20" y="28" width="8" height="8" fill="#2a1500" />
            <rect x="12" y="36" width="8" height="8" fill="#2a1500" />
          </>
        )}
      </svg>
    </button>
  );
}