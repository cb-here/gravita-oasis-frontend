import React from "react";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
export type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "neutral"
  | "cyan"
  | "pink"
  | "purple"
  | "teal"
  | "yellow"
  | "rose"
  | "lime"
  | "slate"
  | "mint"
  | "lavender"
  | "peach"
  | "blush"
  | "midnight"
  | "sunset"
  | "oasis"
  | "velvet"
  | "storm"
  | "copper"
  | "arctic"
  | "mocha"
  | "celestial"
  | "fog"
  | "jade"
  | "dusk"
  | "platinum"
  | "citrus"
  | "aether";

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
  className,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium";

  // Define size styles
  const sizeStyles = {
    sm: "text-theme-xs", // Smaller padding and font size
    md: "text-sm", // Default padding and font size
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        "bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400",
      success:
        "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
      error:
        "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
      warning:
        "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400",
      info: "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500",
      light: "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
      dark: "bg-gray-400 text-gray-800 dark:bg-white/8 dark:text-white",
      teal: "bg-teal-100 text-teal-700 dark:bg-teal-600/15 dark:text-teal-300",
      neutral: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-600/15 dark:text-cyan-300",
      pink: "bg-pink-100 text-pink-700 dark:bg-pink-600/15 dark:text-pink-300",
      purple:
        "bg-purple-100 text-purple-700 dark:bg-purple-600/15 dark:text-purple-300",
      lime: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
      rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
      yellow:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
      slate:
        "bg-slate-100 text-blue-700 dark:bg-slate-500/15 dark:text-blue-300",
      mint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-600/15 dark:text-emerald-300",

      lavender:
        "bg-[#EDE9FE] text-[#6B21A8] dark:bg-[#7C3AED]/15 dark:text-[#C4B5FD]",
      peach:
        "bg-[#FFE2D1] text-[#EA580C] dark:bg-[#EA580C]/15 dark:text-[#FDBA74]",
      blush:
        "bg-[#FCE7F3] text-[#BE185D] dark:bg-[#BE185D]/15 dark:text-[#F9A8D4]",
      midnight:
        "bg-[#E0E7FF] text-[#312E81] dark:bg-[#312E81]/15 dark:text-[#A5B4FC]",
      sunset:
        "bg-[#FFE4E6] text-[#C2410C] dark:bg-[#C2410C]/15 dark:text-[#FDBA74]",
      oasis:
        "bg-[#E0F2F1] text-[#00695C] dark:bg-[#00695C]/15 dark:text-[#80CBC4]",
      velvet:
        "bg-[#F3E8FF] text-[#6B21A8] dark:bg-[#6B21A8]/15 dark:text-[#D8B4FE]",
      storm:
        "bg-[#E2E8F0] text-[#1E293B] dark:bg-[#1E293B]/15 dark:text-[#CBD5E1]",
      copper:
        "bg-[#FDE68A] text-[#B45309] dark:bg-[#B45309]/15 dark:text-[#FCD34D]",
      arctic:
        "bg-[#ECFEFF] text-[#164E63] dark:bg-[#164E63]/15 dark:text-[#67E8F9]",
      mocha:
        "bg-[#EDE9E3] text-[#7C3F1D] dark:bg-[#7C3F1D]/15 dark:text-[#D6BAA2]",
      celestial:
        "bg-[#E0F2FE] text-[#1D4ED8] dark:bg-[#1D4ED8]/15 dark:text-[#93C5FD]",
      fog: "bg-[#F1F5F9] text-[#64748B] dark:bg-[#475569]/15 dark:text-[#CBD5E1]",
      jade: "bg-[#D1FAF5] text-[#0F766E] dark:bg-[#0F766E]/15 dark:text-[#5EEAD4]",
      dusk: "bg-[#E0E7FF] text-[#3730A3] dark:bg-[#3730A3]/15 dark:text-[#C7D2FE]",
      platinum:
        "bg-[#F8FAFC] text-[#475569] dark:bg-[#94A3B8]/10 dark:text-[#E2E8F0]",
      citrus:
        "bg-[#FEF9C3] text-[#CA8A04] dark:bg-[#CA8A04]/15 dark:text-[#FDE047]",
      aether:
        "bg-[#E0F2FE] text-[#0C4A6E] dark:bg-[#0C4A6E]/15 dark:text-[#7DD3FC]",
    },
    solid: {
      primary: "bg-brand-500 text-white dark:text-white",
      success: "bg-success-500 text-white dark:text-white",
      error: "bg-error-500 text-white dark:text-white",
      warning: "bg-warning-500 text-white dark:text-white",
      info: "bg-blue-light-500 text-white dark:text-white",
      light: "bg-gray-400 dark:bg-white/5 text-white dark:text-white/80",
      dark: "bg-gray-700 text-white dark:text-white",
      teal: "bg-teal-500 text-white dark:text-white",
      neutral: "bg-gray-600 text-white dark:text-white",
      cyan: "bg-cyan-500 text-white dark:text-white",
      pink: "bg-pink-500 text-white dark:text-white",
      purple: "bg-purple-500 text-white dark:text-white",
      lime: "bg-lime-500 text-white dark:text-white",
      rose: "bg-rose-500 text-white dark:text-white",
      yellow: "bg-yellow-500 text-white dark:text-white",
      slate: "bg-slate-500 text-white dark:text-white",
      mint: "bg-emerald-500 text-white dark:text-white",
      lavender: "bg-[#A78BFA] text-white dark:text-white",
      peach: "bg-[#EA580C] text-white dark:text-white",
      blush: "bg-[#BE185D] text-white dark:text-white",
      midnight: "bg-[#312E81] text-white dark:text-white",
      sunset: "bg-[#C2410C] text-white dark:text-white",
      oasis: "bg-[#00695C] text-white dark:text-white",
      velvet: "bg-[#6B21A8] text-white dark:text-white",
      storm: "bg-[#1E293B] text-white dark:text-white",
      copper: "bg-[#B45309] text-white dark:text-white",
      arctic: "bg-[#164E63] text-white dark:text-white",
      mocha: "bg-[#7C3F1D] text-white dark:text-white",
      celestial: "bg-[#1D4ED8] text-white dark:text-white",
      fog: "bg-[#64748B] text-white dark:text-white",
      jade: "bg-[#0F766E] text-white dark:text-white",
      dusk: "bg-[#3730A3] text-white dark:text-white",
      platinum: "bg-[#475569] text-white dark:text-white",
      citrus: "bg-[#CA8A04] text-white dark:text-white",
      aether: "bg-[#0C4A6E] text-white dark:text-white",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span
      className={`${baseStyles} ${sizeClass} ${colorStyles} ${className} ${
        variant === "light" ? "border border-current/50" : ""
      } rounded-sm`}
    >
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
