"use client";

import { useState, useEffect, useCallback } from "react";
import { BANNERS, type Banner } from "@/lib/mock-data";

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = useCallback(
    (index: number, dir: "left" | "right" = "right") => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsAnimating(false);
      }, 300);
    },
    [isAnimating]
  );

  const prev = () => {
    const idx = (activeIndex - 1 + BANNERS.length) % BANNERS.length;
    goTo(idx, "left");
  };

  const next = useCallback(() => {
    const idx = (activeIndex + 1) % BANNERS.length;
    goTo(idx, "right");
  }, [activeIndex, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const banner = BANNERS[activeIndex];

  return (
    <div style={{ padding: "24px 20px 0", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          border: "3px solid var(--bg-card-border)",
          boxShadow: "0 6px 0 var(--bg-card-border), 0 8px 24px rgba(0,0,0,0.25)",
          height: "320px",
        }}
      >
        {/* Banner content */}
        <BannerSlide banner={banner} isAnimating={isAnimating} direction={direction} />

        {/* Left arrow */}
        <PixelArrowButton direction="left" onClick={prev} />
        {/* Right arrow */}
        <PixelArrowButton direction="right" onClick={next} />

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
            zIndex: 10,
          }}
        >
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > activeIndex ? "right" : "left")}
              style={{
                width: i === activeIndex ? "24px" : "10px",
                height: "10px",
                borderRadius: "5px",
                backgroundColor:
                  i === activeIndex ? banner.accent : "rgba(255,255,255,0.4)",
                border: "2px solid rgba(255,255,255,0.6)",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.3s ease, background-color 0.3s ease",
                boxShadow: i === activeIndex ? `0 0 8px ${banner.accent}` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BannerSlide({
  banner,
  isAnimating,
  direction,
}: {
  banner: Banner;
  isAnimating: boolean;
  direction: "left" | "right";
}) {
  const slideOut = isAnimating
    ? direction === "right"
      ? "translateX(-40px)"
      : "translateX(40px)"
    : "translateX(0)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${banner.bgFrom} 0%, ${banner.bgMid} 50%, ${banner.bgTo} 100%)`,
        display: "flex",
        alignItems: "stretch",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: isAnimating ? 0 : 1,
        transform: slideOut,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric background shapes */}
      <BannerBackground theme={banner.theme} accent={banner.accent} />

      {/* Left content panel */}
      <div
        style={{
          flex: "0 0 55%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "32px 40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Badge */}
        {banner.badge && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: banner.badgeColor,
              color: "#000",
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              padding: "5px 10px",
              borderRadius: "4px",
              marginBottom: "16px",
              width: "fit-content",
              boxShadow: `0 2px 0 rgba(0,0,0,0.4)`,
              letterSpacing: "0.5px",
            }}
          >
            ★ {banner.badge}
          </div>
        )}

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "22px",
            color: banner.textColor,
            lineHeight: 1.4,
            marginBottom: "12px",
            textShadow: `0 2px 12px rgba(0,0,0,0.8), 0 0 40px ${banner.accent}40`,
            letterSpacing: "-0.5px",
          }}
        >
          {banner.title}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            color: "rgba(255,255,255,0.8)",
            fontWeight: 600,
            marginBottom: "20px",
            lineHeight: 1.5,
            maxWidth: "340px",
          }}
        >
          {banner.subtitle}
        </p>

        {/* Discount + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {banner.discount && (
            <div
              style={{
                backgroundColor: banner.accent,
                color: "#000",
                fontFamily: "var(--font-pixel)",
                fontSize: "10px",
                padding: "8px 14px",
                borderRadius: "6px",
                boxShadow: `0 3px 0 rgba(0,0,0,0.4)`,
                letterSpacing: "0.5px",
              }}
            >
              {banner.discount}
            </div>
          )}
          <button
            style={{
              backgroundColor: "transparent",
              color: banner.accent,
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 800,
              padding: "10px 22px",
              borderRadius: "8px",
              border: `2px solid ${banner.accent}`,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = banner.accent;
              el.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.backgroundColor = "transparent";
              el.style.color = banner.accent;
            }}
          >
            {banner.cta} →
          </button>
        </div>
      </div>

      {/* Right: featured product card */}
      <div
        style={{
          flex: "0 0 45%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <FeaturedProductCard banner={banner} />
      </div>
    </div>
  );
}

function BannerBackground({ theme, accent }: { theme: string; accent: string }) {
  const [stars, setStars] = useState<{ top: string; left: string }[]>([]);

  useEffect(() => {
    // Only generate stars on the client side for the halloween theme
    if (theme === "halloween") {
      const newStars = Array.from({ length: 12 }, () => ({
        top: `${Math.random() * 60}%`,
        left: `${Math.random() * 100}%`,
      }));
      setStars(newStars);
    } else {
      setStars([]); // Clear stars for other themes
    }
  }, [theme]);

  if (theme === "halloween") {
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1 }}>
        {/* Moon */}
        <div style={{ position: "absolute", top: "20px", right: "30%", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#ff9a3c", boxShadow: "0 0 30px #ff6a00, 0 0 60px #ff6a0040", opacity: 0.9 }} />
        {/* Bats */}
        {["15%", "25%", "40%"].map((left, i) => (
          <div key={i} style={{ position: "absolute", top: `${15 + i * 12}%`, left, fontSize: "18px", opacity: 0.6, transform: `rotate(${i * 15}deg)` }}>🦇</div>
        ))}
        {/* Stars */}
        {stars.map((star, i) => (
          <div key={i} style={{ position: "absolute", top: star.top, left: star.left, width: "2px", height: "2px", borderRadius: "50%", backgroundColor: "#fff", opacity: 0.5 }} />
        ))}
        {/* Fog overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(transparent, rgba(80,0,30,0.4))" }} />
      </div>
    );
  }

  if (theme === "summer") {
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1 }}>
        {/* Sun rays */}
        <div style={{ position: "absolute", top: "-60px", right: "30%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,215,0,0.3), transparent 70%)" }} />
        {/* Waves */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(transparent, rgba(0,80,160,0.3))" }} />
        {/* Sparkles */}
        {["★", "✦", "◆"].map((s, i) => (
          <div key={i} style={{ position: "absolute", top: `${20 + i * 25}%`, left: `${10 + i * 15}%`, color: accent, fontSize: "20px", opacity: 0.4 }}>{s}</div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1 }}>
      {/* Grid lines */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${accent}15 1px, transparent 1px), linear-gradient(90deg, ${accent}15 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
      {/* Glowing orb */}
      <div style={{ position: "absolute", top: "-80px", left: "30%", width: "300px", height: "300px", borderRadius: "50%", background: `radial-gradient(circle, ${accent}20, transparent 70%)` }} />
    </div>
  );
}

function FeaturedProductCard({ banner }: { banner: Banner }) {
  return (
    <div
      style={{
        width: "220px",
        borderRadius: "12px",
        overflow: "hidden",
        border: `2px solid ${banner.accent}50`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${banner.accent}30`,
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Product image placeholder */}
      <div
        style={{
          height: "130px",
          background: `linear-gradient(135deg, ${banner.bgMid}, ${banner.bgFrom})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "52px",
          borderBottom: `1px solid ${banner.accent}30`,
        }}
      >
        {banner.theme === "halloween" ? "💀" : banner.theme === "summer" ? "🌊" : "🚀"}
      </div>
      {/* Product info */}
      <div style={{ padding: "14px" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "4px", fontWeight: 600 }}>
          Em destaque
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#fff", fontWeight: 800, marginBottom: "10px", lineHeight: 1.3 }}>
          {banner.featuredItem}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "11px", color: banner.accent }}>
            {banner.featuredPrice}
          </span>
          <button
            style={{
              backgroundColor: banner.accent,
              color: "#000",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 800,
              padding: "5px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

function PixelArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        [direction]: "12px",
        transform: "translateY(-50%)",
        zIndex: 10,
        width: "40px",
        height: "40px",
        backgroundColor: "rgba(0,0,0,0.5)",
        border: "2px solid rgba(255,255,255,0.3)",
        borderRadius: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "var(--font-pixel)",
        fontSize: "16px",
        transition: "background-color 0.2s, border-color 0.2s",
        imageRendering: "pixelated",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "rgba(0,0,0,0.75)";
        el.style.borderColor = "rgba(255,255,255,0.7)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "rgba(0,0,0,0.5)";
        el.style.borderColor = "rgba(255,255,255,0.3)";
      }}
    >
      {direction === "left" ? "❮" : "❯"}
    </button>
  );
}