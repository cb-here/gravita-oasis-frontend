"use client";
import Loading from "@/components/Loading";
import React from "react";

interface SwitchProps {
  label?: any;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray";
  readOnly?: boolean;
  loading?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  disabled = false,
  onChange,
  color = "blue",
  readOnly = false,
  loading = false,
}) => {
  const handleToggle = () => {
    if (disabled || readOnly) return;
    if (onChange) {
      onChange(!checked); // Use current prop value
    }
  };

  const switchColors =
    color === "blue"
      ? {
          background: checked
            ? "bg-brand-500 "
            : "bg-gray-200 dark:bg-white/10",
          knob: checked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        }
      : {
          background: checked
            ? "bg-gray-800 dark:bg-white/10"
            : "bg-gray-200 dark:bg-white/10",
          knob: checked
            ? "translate-x-full bg-white"
            : "translate-x-0 bg-white",
        };

  return (
    <label
      className={`flex select-none items-center gap-3 text-sm font-medium ${
        disabled || readOnly
          ? "text-blue-400"
          : "text-blue-700 dark:text-blue-400 cursor-pointer"
      }`}
      onClick={handleToggle}
    >
      <div className="relative">
        <div
          className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
            disabled
              ? "bg-gray-100 pointer-events-none dark:bg-gray-800"
              : switchColors.background
          }`}
        ></div>
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
        >
          {loading ? <Loading size={1} /> : ""}
        </div>
      </div>
      {label}
    </label>
  );
};

export default Switch;
