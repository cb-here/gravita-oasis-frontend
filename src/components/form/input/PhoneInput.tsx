"use client";
import { forwardRef } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { Country } from "react-phone-number-input";
import Label from "../Label";

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (props, ref) => (
    <input
      {...props}
      ref={ref}
      id="phone"
      type="tel"
      className={`w-full border-0 rounded-r-lg px-3 py-2 text-sm dark:text-white/90 bg-transparent text-gray-800 focus:outline-none ${
        props.disabled &&
        "text-gray-500 border-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40"
      }`}
      placeholder={props?.placeholder}
      name="phone"
      disabled={props.disabled}
      title="Please enter the phone number."
      required
    />
  )
);

CustomInput.displayName = "CustomInput";

type MyPhoneInputProps = {
  value: string;
  countryCode?: Country;
  onChange: (phone: string) => void;
  onCountryChange?: (country: Country) => void;
  label: string;
  disabled?: boolean;
  placeholder?: string;
  error?: any;
  required?: boolean;
};

const MyPhoneInput: React.FC<MyPhoneInputProps> = ({
  value,
  countryCode,
  onChange,
  onCountryChange,
  label,
  disabled,
  placeholder,
  error,
  required
}) => {
  return (
    <div className="w-full ">
      <Label required={required} htmlFor="phone">
        {label}
      </Label>
      <div
        className={`
    w-full h-11 rounded-lg pl-3 
    border appearance-none flex items-center 
    shadow-theme-xs 
    bg-transparent text-gray-800 
    placeholder:text-gray-400 
    focus-within:outline-none
    dark:bg-black
    ${
      error
        ? "border-error-500 focus-within:border-error-300 focus-within:ring-3 focus-within:ring-error-500/20 dark:border-error-500 dark:focus-within:border-error-800  focus:border-error-300 focus:ring-error-500/20 dark:text-error-400  dark:focus:border-error-800"
        : "border-gray-300 focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/20 dark:border-gray-700 dark:focus-within:border-brand-800"
    }
    ${
      disabled &&
      "text-gray-500 bg-gray-100 cursor-not-allowed opacity-40 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
    }
  `}
      >
        <PhoneInput
          className="w-full"
          placeholder={placeholder}
          value={value}
          onChange={(phone) => {
            onChange(phone ?? "");
          }}
          defaultCountry="US"
          country={countryCode}
          onCountryChange={(country) => {
            onCountryChange?.(country ?? "US");
          }}
          inputComponent={CustomInput}
          international
          disabled={disabled}
          countrySelectProps={{ disabled }}
        />
      </div>
    </div>
  );
};

export default MyPhoneInput;
