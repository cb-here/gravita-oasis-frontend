import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

// Props interfaces for Card, CardTitle, and CardDescription
interface CardProps {
  children?: ReactNode;
  title?: string;
  value?: string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "accent" | "warning";
  trend?: number;
}

interface CardTitleProps {
  children: ReactNode;
}

interface CardDescriptionProps {
  children: ReactNode;
}

const variantColors = {
  primary: {
    icon: "text-brand-500 dark:text-brand-400",
    subtitle: "text-brand-600 dark:text-brand-400",
    bg: "bg-brand-50 dark:bg-brand-500/10",
  },
  secondary: {
    icon: "text-purple-500 dark:text-purple-400",
    subtitle: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
  },
  accent: {
    icon: "text-cyan-500 dark:text-cyan-400",
    subtitle: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-500/10",
  },
  warning: {
    icon: "text-amber-500 dark:text-amber-400",
    subtitle: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
};

// Card Component
const Card: React.FC<CardProps> = ({
  children,
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "primary",
}) => {
  // If used as stats card
  if (title && value) {
    const colors = variantColors[variant];
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {value}
            </p>
            {subtitle && (
              <p className={`text-sm font-medium ${colors.subtitle}`}>
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-lg ${colors.bg}`}>
              <Icon className={`w-6 h-6 ${colors.icon}`} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default card
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {children}
    </div>
  );
};

// CardTitle Component
const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return (
    <h4 className="mb-1 font-medium text-gray-800 text-theme-xl dark:text-white/90">
      {children}
    </h4>
  );
};

// CardDescription Component
const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => {
  return <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>;
};

// Named exports for better flexibility
export { Card, CardTitle, CardDescription };
