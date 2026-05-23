import type { ReviewRead } from "@/services/api-types";

const StarRating = ({ rating }: { rating: number }) => (
    <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
            >
                <path
                    d="M8 1.5l1.8 3.6 4 .58-2.9 2.82.69 3.98L8 10.35l-3.59 1.88.69-3.98L2.2 5.68l4-.58L8 1.5z"
                    fill={star <= rating ? "var(--color-star)" : "rgba(42,21,0,0.2)"}
                    stroke={star <= rating ? "#c8a000" : "rgba(42,21,0,0.15)"}
                    strokeWidth="0.5"
                />
            </svg>
        ))}
    </div>
);

const ReviewCard = ({ review }: { review: ReviewRead }) => (
    <div style={{ display: 'flex', gap: '16px', borderBottom: '3px solid var(--bg-navbar)', paddingBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-card)',
          border: '3px solid var(--bg-card-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0,
        }}>
            {'👤'}
        </div>
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    {`Usuário ${review.user_id}`}
                </h4>
                <StarRating rating={review.rate} />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.6, marginBottom: '8px' }}>
                {review.message || "Nenhum comentário."}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                {new Date(review.created_at).toLocaleDateString()}
            </p>
        </div>
    </div>
);

export default function RatingsList({ reviews }: { reviews: ReviewRead[] }) {
    return (
        <section style={{ marginTop: '32px' }}>
            <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "12px", color: "var(--color-text-primary)", marginBottom: "16px" }}>
                Avaliações ({reviews.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
            </div>
        </section>
    );
}
