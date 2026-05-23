type Props = {
  tags: string[];
};

export default function ProductTags({ tags }: Props) {
  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "11px",
          color: "var(--color-text-primary)",
          marginBottom: "14px",
          letterSpacing: "-0.3px",
        }}
      >
        Tags
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {tags.map((tag) => (
          <div
            key={tag}
            style={{
              padding: "9px 20px",
              backgroundColor: "var(--bg-card)",
              border: "3px solid var(--bg-card-border)",
              borderRadius: "999px",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--color-white)",
              boxShadow: "0 3px 0 var(--bg-card-border)",
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}
