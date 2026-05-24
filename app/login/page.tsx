"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser } from "@/services/api";
import type { LoginRequest } from "@/services/api-types";
import Navbar from "@/components/Navbar";
import FormInput from "@/components/FormInput";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const credentials: LoginRequest = { email, password };

    try {
      const userData = await loginUser(credentials);
      login(userData);
      router.push('/');
    } catch (err) {
      setError("Falha no login. Verifique seu e-mail e senha.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormInput 
              name="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormInput 
              name="password"
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p style={{ color: 'var(--color-red)', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: "var(--color-text-primary)",
                color: "var(--color-white)",
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: 800,
                padding: "14px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: isSubmitting ? 'wait' : 'pointer',
                boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                marginTop: '12px',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              Não tem uma conta?{' '}
              <Link href="/cadastro" style={{ color: 'var(--color-text-primary)', fontWeight: 800, textDecoration: 'underline' }}>
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
