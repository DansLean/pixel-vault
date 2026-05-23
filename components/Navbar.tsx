"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

function UserAuth() {
  const { isLoggedIn, logout } = useAuth();

  if (isLoggedIn) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            backgroundColor: "rgba(200,131,42,0.25)",
            borderRadius: "var(--radius-sm)",
            border: "2px solid var(--bg-card-border)",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c8832a, #8b5a1a)",
              border: "2px solid var(--bg-card-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            👤
          </div>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            Olá, Fulano!
          </span>
        </div>
        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            textDecoration: 'underline',
          }}
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        backgroundColor: "rgba(200,131,42,0.25)",
        borderRadius: "var(--radius-sm)",
        border: "2px solid var(--bg-card-border)",
        cursor: "pointer",
        transition: "background-color 0.2s",
        textDecoration: 'none'
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor =
          "rgba(200,131,42,0.4)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor =
          "rgba(200,131,42,0.25)")
      }
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #c8832a, #8b5a1a)",
          border: "2px solid var(--bg-card-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        👤
      </div>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 700,
          color: "var(--color-text-primary)",
        }}
      >
        Login
      </span>
    </Link>
  );
}


export default function Navbar() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header
      style={{
        backgroundColor: "var(--bg-navbar)",
        borderBottom: "3px solid var(--bg-card-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 3px 0 rgba(122,79,16,0.3)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <VaultIcon />
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "11px",
              color: "var(--color-text-primary)",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            Pixel
            <br />
            Vault
          </span>
        </Link>

        {/* Search bar */}
        <div style={{ flex: 1, maxWidth: "480px", position: "relative" }}>
          <input
            type="text"
            placeholder="🔍 Buscar"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 16px",
              backgroundColor: "var(--bg-search)",
              border: "3px solid #6aace8",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxShadow: "0 3px 0 #4a8cb8",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3a8cd0";
              e.target.style.boxShadow = "0 3px 0 #2a6ca0, 0 0 0 3px rgba(58,140,208,0.2)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#6aace8";
              e.target.style.boxShadow = "0 3px 0 #4a8cb8";
            }}
          />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Action icons */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Add / Sell */}
          <Link href="/vender" style={{ textDecoration: "none" }}>
            <NavIconButton label="Vender" title="Publicar produto">
              <PlusIcon />
            </NavIconButton>
          </Link>

          {/* Wishlist */}
          <Link href="/favoritos" style={{ textDecoration: 'none' }}>
            <NavIconButton label="" title="Lista de Desejos">
              <HeartIcon />
            </NavIconButton>
          </Link>

          {/* Cart */}
          <Link href="/carrinho" style={{ textDecoration: 'none' }}>
            <NavIconButton label="" title="Carrinho">
              <CartIcon />
            </NavIconButton>
          </Link>

          {/* User */}
          <UserAuth />
        </nav>
      </div>
    </header>
  );
}

function NavIconButton({
  children,
  label,
  title,
}: {
  children: React.ReactNode;
  label: string;
  title: string;
}) {
  return (
    <button
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 10px",
        backgroundColor: "transparent",
        border: "2px solid transparent",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        color: "var(--color-text-primary)",
        fontSize: "13px",
        fontWeight: 700,
        fontFamily: "var(--font-body)",
        transition: "background-color 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "rgba(200,131,42,0.25)";
        el.style.borderColor = "var(--bg-card-border)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.backgroundColor = "transparent";
        el.style.borderColor = "transparent";
      }}
    >
      {children}
      {label && <span>{label}</span>}
    </button>
  );
}

/* ── SVG Icons ── */

function VaultIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <rect x="4" y="8" width="28" height="22" rx="4" fill="#c8832a" stroke="#7a4f10" strokeWidth="2" />
      {/* Vault door circle */}
      <circle cx="18" cy="19" r="8" fill="#7a4f10" stroke="#5a3010" strokeWidth="2" />
      <circle cx="18" cy="19" r="5" fill="#c8832a" stroke="#7a4f10" strokeWidth="1.5" />
      {/* Lock dial */}
      <circle cx="18" cy="19" r="2" fill="#5a3010" />
      <line x1="18" y1="17" x2="18" y2="14" stroke="#7a4f10" strokeWidth="1.5" strokeLinecap="round" />
      {/* Hinges */}
      <rect x="4" y="11" width="4" height="3" rx="1" fill="#5a3010" />
      <rect x="4" y="25" width="4" height="3" rx="1" fill="#5a3010" />
      {/* Robot eyes on top */}
      <rect x="13" y="4" width="3" height="3" rx="1" fill="#88c8e8" stroke="#5a90b8" strokeWidth="1" />
      <rect x="20" y="4" width="3" height="3" rx="1" fill="#88c8e8" stroke="#5a90b8" strokeWidth="1" />
      {/* Antenna */}
      <line x1="18" y1="8" x2="18" y2="4" stroke="#7a4f10" strokeWidth="1.5" />
      <circle cx="18" cy="3" r="1.5" fill="#ff6b00" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" fill="rgba(200,131,42,0.3)" stroke="#7a4f10" strokeWidth="1.5" />
      <line x1="11" y1="6" x2="11" y2="16" stroke="#2a1500" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="11" x2="16" y2="11" stroke="#2a1500" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 18.5s-8-5.5-8-10.5A5 5 0 0 1 11 5a5 5 0 0 1 8 3c0 5-8 10.5-8 10.5z"
        fill="none"
        stroke="#2a1500"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M2 3h2l2.5 10h9l2-7H6"
        stroke="#2a1500"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="9" cy="18" r="1.5" fill="#2a1500" />
      <circle cx="16" cy="18" r="1.5" fill="#2a1500" />
    </svg>
  );
}
