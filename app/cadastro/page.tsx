'use client';
import Navbar from "@/components/Navbar";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUser, getUserTypes } from "@/services/api";
import type { UserCreate, UserTypeResponse } from "@/services/api-types";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type_id: '',
  });
  const [userTypes, setUserTypes] = useState<UserTypeResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const types = await getUserTypes();
        setUserTypes(types);
        if (types.length > 0) {
          // Set a default user type if not already set
          setFormData(prev => ({ ...prev, user_type_id: String(types[0].id) }));
        }
      } catch (err) {
        console.error("Failed to fetch user types:", err);
        setError("Não foi possível carregar os tipos de usuário.");
      }
    };
    fetchUserTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setError('');
    setIsSubmitting(true);

    const now = new Date().toISOString();
    const payload: UserCreate = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      user_type_id: Number(formData.user_type_id),
      active: true,
      created_at: now,
      updated_at: now,
    };

    try {
      await createUser(payload);
      alert("Usuário criado com sucesso! Você será redirecionado para a página de login.");
      router.push('/login');
    } catch (err) {
      console.error(err);
      setError("Falha ao criar usuário. O email ou nome de usuário pode já estar em uso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <Navbar />
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'var(--bg-navbar)',
            border: '3px solid var(--bg-card-border)',
            borderRadius: 'var(--radius-card)',
            padding: '32px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h1 style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "20px",
            color: "var(--color-text-primary)",
            marginBottom: "24px",
            textAlign: "center",
          }}>
            Criar Conta
          </h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormInput name="first_name" label="Primeiro Nome" type="text" value={formData.first_name} onChange={handleInputChange} required />
              <FormInput name="last_name" label="Último Nome" type="text" value={formData.last_name} onChange={handleInputChange} required />
            </div>
            <FormInput name="username" label="Nome de usuário" type="text" value={formData.username} onChange={handleInputChange} required />
            <FormInput name="email" label="Email" type="email" value={formData.email} onChange={handleInputChange} required />
            <FormSelect
              name="user_type_id"
              label="Tipo de Usuário"
              options={userTypes.map(type => ({ value: String(type.id), label: type.type }))}
              value={formData.user_type_id}
              onChange={handleInputChange}
            />
            <FormInput name="password" label="Senha" type="password" value={formData.password} onChange={handleInputChange} required />
            <FormInput name="confirmPassword" label="Confirmar Senha" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />

            {error && <p style={{ color: 'var(--color-red)', textAlign: 'center', fontSize: '14px' }}>{error}</p>}
            
            <button type="submit" disabled={isSubmitting} style={{
              backgroundColor: "var(--color-text-primary)",
              color: "var(--color-white)",
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 800,
              padding: "14px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
              marginTop: '12px',
              opacity: isSubmitting ? 0.6 : 1,
            }}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              Já tem uma conta?{' '}
              <Link href="/login" style={{ color: 'var(--color-text-primary)', fontWeight: 800, textDecoration: 'underline' }}>
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
