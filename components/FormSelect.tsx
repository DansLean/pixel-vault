import React from "react";

const FormSelect = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  options: {value: string | number, label: string}[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}) => (
  <div>
    <label
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "14px",
        fontWeight: 700,
        color: "var(--color-text-primary)",
        marginBottom: "8px",
        display: "block",
      }}
    >
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          height: "45px",
          padding: "0 14px",
          backgroundColor: "var(--bg-card)",
          border: "3px solid var(--bg-card-border)",
          borderRadius: "var(--radius-card)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--color-text-primary)",
          appearance: "none",
          cursor: "pointer",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div
        style={{
          position: "absolute",
          right: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          fontFamily: "var(--font-pixel)",
        }}
      >
        V
      </div>
    </div>
  </div>
);

export default FormSelect;
