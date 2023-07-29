import React from "react";

interface InputProps {
  style?: string;
  label?: string;
  input: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ style, label, input, error }, ref) => {
    return (
      <div className={style}>
        {label && <label htmlFor={input.id}>{label}</label>}
        <input ref={ref} {...input} />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }
);

export default Input;
