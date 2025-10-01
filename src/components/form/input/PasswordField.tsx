import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "@/icons";

interface PasswordFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: any;
  errorMessage?: any;
}

export default function PasswordField({
  value,
  onChange,
  placeholder = "Enter your password",
  error,
  errorMessage
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={!!error}
        errorMessage={errorMessage}
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute z-30 top-2.5 right-4 cursor-pointer"
      >
        {showPassword ? (
          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
        ) : (
          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
        )}
      </span>
      
    </div>
  );
}
