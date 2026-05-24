"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createReview } from '@/services/api';
import type { ReviewCreate } from '@/services/api-types';

const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 16 16"
    fill={filled ? "var(--color-star)" : "rgba(42,21,0,0.2)"}
    stroke={filled ? "#c8a000" : "rgba(42,21,0,0.15)"}
    strokeWidth="0.5"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
  >
    <path d="M8 1.5l1.8 3.6 4 .58-2.9 2.82.69 3.98L8 10.35l-3.59 1.88.69-3.98L2.2 5.68l4-.58L8 1.5z" />
  </svg>
);

export default function ReviewForm({ assetId }: { assetId: number }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isLoggedIn, userId } = useAuth();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!isLoggedIn || !userId) {
            alert("Você precisa estar logado para publicar uma avaliação.");
            router.push('/login');
            return;
        }

        if (rating === 0) {
            alert("Por favor, selecione uma nota (de 1 a 5 estrelas).");
            return;
        }

        setIsSubmitting(true);

        const payload: ReviewCreate = {
            asset_id: assetId,
            user_id: userId,
            rate: rating,
            message: message || null,
        };

        try {
            await createReview(payload);
            alert("Avaliação publicada com sucesso!");
            setRating(0);
            setMessage('');
            // Refresh the page server-side to show the new review
            router.refresh();
        } catch (error) {
            console.error("Failed to submit review:", error);
            // The API might throw an error if the user already reviewed this asset.
            // A more specific error message from the backend would be ideal.
            alert("Falha ao enviar avaliação. Você já pode ter avaliado este item.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoggedIn) {
      return (
        <section style={{ marginTop: '32px', textAlign: 'center', background: 'var(--bg-navbar)', padding: '30px', borderRadius: 'var(--radius-card)', border: '3px solid var(--bg-card-border)' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            <a href="/login" style={{color: 'var(--color-accent)'}}>Faça login</a> para deixar sua avaliação.
          </p>
        </section>
      )
    }

    return (
        <section style={{ marginTop: '32px' }}>
            <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "12px", color: "var(--color-text-primary)", marginBottom: "16px" }}>
                Deixe sua avaliação
            </h2>
            <div style={{
              backgroundColor: 'var(--bg-navbar)',
              border: '3px solid var(--bg-card-border)',
              borderRadius: 'var(--radius-card)',
              padding: '20px',
            }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                    {[1, 2, 3, 4, 5].map(index => (
                        <Star
                            key={index}
                            filled={index <= (hoverRating || rating)}
                            onClick={() => setRating(index)}
                            onMouseEnter={() => setHoverRating(index)}
                            onMouseLeave={() => setHoverRating(0)}
                        />
                    ))}
                </div>
                <textarea
                    placeholder="Escreva seu comentário (opcional)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px 14px',
                      backgroundColor: 'var(--bg-main)',
                      border: '3px solid var(--bg-card-border)',
                      borderRadius: 'var(--radius-card)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: 'var(--color-text-primary)',
                      resize: 'vertical',
                      marginBottom: '16px'
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{
                          backgroundColor: 'var(--color-text-primary)',
                          color: 'var(--color-white)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '14px',
                          fontWeight: 700,
                          padding: '12px 24px',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          cursor: isSubmitting ? 'wait' : 'pointer',
                          boxShadow: '0 3px 0 rgba(0,0,0,0.3)',
                          opacity: isSubmitting ? 0.7 : 1,
                        }}
                    >
                        {isSubmitting ? 'Publicando...' : 'Publicar Avaliação'}
                    </button>
                </div>
            </div>
        </section>
    );
}