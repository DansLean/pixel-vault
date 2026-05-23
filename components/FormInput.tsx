import React from "react";

const FormInput = ({
  label,
  type = "text",
  multiline = false,
  ...props
}: {
  label: string;
  type?: string;
  multiline?: boolean;
  [key: string]: any;
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
    {multiline ? (
      <textarea
        style={{
          width: "100%",
          padding: "12px 14px",
          backgroundColor: "var(--bg-card)",
          border: "3px solid var(--bg-card-border)",
          borderRadius: "var(--radius-card)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--color-text-primary)",
          minHeight: "120px",
          resize: "vertical",
        }}
        {...props}
      />
    ) : (
      <input
        type={type}
        style={{
          width: "100%",
          height: "45px",
          padding: "12px 14px",
          backgroundColor: "var(--bg-card)",
          border: "3px solid var(--bg-card-border)",
          borderRadius: "var(--radius-card)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "var(--color-text-primary)",
        }}
        {...props}
      />
    )}
  </div>
);

export default FormInput;
