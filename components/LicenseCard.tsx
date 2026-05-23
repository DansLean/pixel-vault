type LicenseProps = {
  canDo: string[];
  cannotDo: string[];
};

export default function LicenseCard({ canDo, cannotDo }: LicenseProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-navbar)",
        border: "3px solid var(--bg-card-border)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-card)",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "11px",
          color: "var(--color-text-primary)",
          letterSpacing: "-0.3px",
        }}
      >
        Licença
      </h3>

      {/* Can do */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 800,
            color: "#1a7a1a",
            marginBottom: "10px",
          }}
        >
          Pode fazer:
        </p>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
          {canDo.map((item) => (
            <li
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: "#1a7a1a", fontWeight: 800, flexShrink: 0, marginTop: "1px" }}>•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div style={{ height: "2px", backgroundColor: "rgba(122,79,16,0.15)", borderRadius: "2px" }} />

      {/* Cannot do */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 800,
            color: "#b81a1a",
            marginBottom: "10px",
          }}
        >
          NÃO Pode fazer:
        </p>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
          {cannotDo.map((item) => (
            <li
              key={item}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: "#b81a1a", fontWeight: 800, flexShrink: 0, marginTop: "1px" }}>•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
