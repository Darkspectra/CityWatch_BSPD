import { useState } from "react";

export default function PasswordField({
  label = "Password",
  value,
  onChange,
  placeholder = "Enter your password",
  autoComplete = "current-password",
  required = true,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div className="password-field-wrap">
        <input
          className="field"
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
