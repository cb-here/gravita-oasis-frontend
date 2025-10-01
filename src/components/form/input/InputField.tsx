import type React from "react";
import type { FC } from "react";
import { useState } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  required?: boolean;
  hint?: string;
  value?: string | number;
  ref?: React.Ref<HTMLInputElement>;
  readOnly?: boolean;
  errorMessage?: string;
  [key: string]: any;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  defaultValue,
  onChange,
  className = "",
  min,
  max,
  maxLength,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  value,
  required,
  ref,
  readOnly = false,
  onKeyDown,
  errorMessage,
}) => {
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;
  const [touched, setTouched] = useState(false);

  const showRequiredError =
    required &&
    touched &&
    (value === "" || value === undefined || value === null);

  const isError = error || showRequiredError;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
  } else if (isError) {
    inputClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        required={required}
        ref={ref}
        maxLength={maxLength}
        readOnly={readOnly}
        onKeyDown={onKeyDown}
      />

      {showRequiredError && (
        <p className="mt-1.5 text-sm text-red-500">This field is required</p>
      )}

      {hint && (
        <p
          className={`mt-1.5 text-sm ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
      {error && errorMessage && (
        <span className="mt-1.5 text-sm text-red-500">{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
