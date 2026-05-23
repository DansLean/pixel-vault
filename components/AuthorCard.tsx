import type { UserRead } from "@/services/api-types";

export default function AuthorCard({ author }: { author: UserRead }) {
  const memberSince = new Date(author.created_at).getFullYear();

  return (
    <section style={{
      backgroundColor: 'var(--bg-navbar)',
      border: '3px solid var(--bg-card-border)',
      borderRadius: 'var(--radius-card)',
      padding: '20px',
    }}>
      <h2
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "12px",
          color: "var(--color-text-primary)",
          marginBottom: "16px",
          letterSpacing: "-0.3px",
        }}
      >
        Sobre o autor
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-card)',
          border: '3px solid var(--bg-card-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          flexShrink: 0,
        }}>
          {'👤'}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {author.username}
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            Membro desde {memberSince}
          </p>
        </div>
        <button style={{
          backgroundColor: 'var(--color-text-primary)',
          color: 'var(--color-white)',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 700,
          padding: '10px 16px',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 3px 0 rgba(0,0,0,0.3)',
        }}>
          Seguir
        </button>
      </div>
    </section>
  );
}
