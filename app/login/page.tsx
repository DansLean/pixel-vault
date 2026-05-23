"use client";

import Navbar from "@/components/Navbar";
import FormInput from "@/components/FormInput";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login();
    router.push('/');
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <Navbar />
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--bg-navbar)',
          border: '3px solid var(--bg-card-border)',
          borderRadius: 'var(--radius-card)',
          padding: '32px',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h1 style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "20px",
            color: "var(--color-text-primary)",
            marginBottom: "24px",
            textAlign: "center",
          }}>
            Login
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormInput label="Email ou nome de usuário" type="text" />
            <FormInput label="Senha" type="password" />
            <button
              onClick={handleLogin}
              style={{
                backgroundColor: "var(--color-text-primary)",
                color: "var(--color-white)",
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: 800,
                padding: "14px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                marginTop: '12px',
              }}
            >
              Entrar
            </button>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              Não tem uma conta?{' '}
              <Link href="/cadastro" style={{ color: 'var(--color-text-primary)', fontWeight: 800, textDecoration: 'underline' }}>
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
