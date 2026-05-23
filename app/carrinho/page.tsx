"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PRODUCTS, Product } from "@/lib/mock-data";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

const CartItem = ({ product, removeFromCart }: { product: Product, removeFromCart: (id: number) => void }) => {
  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', backgroundColor: 'var(--bg-navbar)', borderRadius: 'var(--radius-card)', border: '3px solid var(--bg-card-border)' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', backgroundColor: '#d4d0cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', flexShrink: 0 }}>
        🚂
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '16px', color: 'var(--color-text-primary)' }}>{product.fullName}</h3>
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
      </div>
      <button onClick={() => removeFromCart(product.id)} title="Remover do carrinho" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: 'var(--color-text-secondary)', padding: '8px' }}>
        🗑️
      </button>
    </div>
  );
};

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const cartProducts: Product[] = PRODUCTS.filter(product => cart.includes(product.id));
  
  const subtotal = cartProducts.reduce((sum, product) => sum + product.price, 0);

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearCart();
    router.push('/');
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px 60px" }}>
        <h1 style={{ fontFamily: "var(--font-pixel)", fontSize: "24px", color: "var(--color-text-primary)", marginBottom: "32px", textAlign: "center" }}>
          Meu Carrinho
        </h1>
        
        {cartProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartProducts.map(product => <CartItem key={product.id} product={product} removeFromCart={removeFromCart} />)}
            </div>

            {/* Order Summary */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div style={{ backgroundColor: 'var(--bg-navbar)', border: '3px solid var(--bg-card-border)', borderRadius: 'var(--radius-card)', padding: '24px' }}>
                <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "16px", color: "var(--color-text-primary)", marginBottom: "24px" }}>
                  Resumo do Pedido
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</span>
                  <span>{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '18px', color: 'var(--color-text-primary)', borderTop: '3px dashed var(--bg-card-border)', paddingTop: '16px', marginTop: '16px' }}>
                  <span>Total</span>
                  <span>{subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <button 
                  type="button"
                  onClick={handleCheckout}
                  style={{
                    width: '100%',
                    backgroundColor: "var(--color-green)",
                    color: "var(--color-white)",
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontWeight: 800,
                    padding: "14px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 0 #1a5a1a",
                    marginTop: '24px',
                  }}
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-navbar)', border: '3px solid var(--bg-card-border)', borderRadius: 'var(--radius-card)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--color-text-secondary)', fontWeight: 800 }}>
              Seu carrinho está vazio.
            </p>
            <Link href="/" style={{
              display: 'inline-block',
              marginTop: '24px',
              backgroundColor: "var(--color-text-primary)",
              color: "var(--color-white)",
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 800,
              padding: "14px 24px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
              textDecoration: 'none'
            }}>
              Continuar Comprando
            </Link>
          </div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '48px',
            boxShadow: '0 4px 0 #1a5a1a',
          }}>
            ✓
          </div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '18px', color: 'var(--color-text-primary)'}}>
            Compra Finalizada!
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: 600, lineHeight: 1.5 }}>
            Seu pedido foi processado com sucesso. Como este é um ambiente de simulação, nenhum valor foi cobrado.
          </p>
          <button 
            onClick={handleCloseModal}
            style={{
              backgroundColor: "var(--color-text-primary)",
              color: "var(--color-white)",
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 800,
              padding: "12px 24px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
              marginTop: '16px',
            }}
          >
            Voltar para a Loja
          </button>
        </div>
      </Modal>
    </div>
  );
}
