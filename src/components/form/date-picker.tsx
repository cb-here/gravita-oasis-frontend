"use client";

import { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css"; // Always load the base stylesheet
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;
import { useTheme } from "@/context/ThemeContext";


type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  isClearable?: boolean;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  isClearable = true,
}: PropsType) {
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);
  const [hasValue, setHasValue] = useState(!!defaultDate);
  const { theme } = useTheme(); // Use the theme from the conuuuuu

  useEffect(() => {
    // Dynamic import for the theme CSS
    const loadTheme = async () => {
      const themeFile = theme === "dark" ? "dark.css" : "light.css"; // Assuming a light theme file exists, otherwise use a default
      // Note: `import()` returns a promise, which is handled here
      await import(`flatpickr/dist/themes/${themeFile}`);

      // Destroy any existing instance before creating a new one with the correct theme
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }

      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      const flatPickr = flatpickr(`#${id}`, {
        mode: mode || "single",
        static: !isMobile, // Use native picker on mobile for better UX unless explicitly disabled
        monthSelectorType: "static",
        dateFormat: "Y-m-d",
        defaultDate,
        onChange: (selectedDates, dateStr, instance) => {
          setHasValue(selectedDates.length > 0);
          if (onChange) {
            if (Array.isArray(onChange)) {
              onChange.forEach((fn) => fn(selectedDates, dateStr, instance));
            } else {
              onChange(selectedDates, dateStr, instance);
            }
          }
        },
      });

      // Ensure flatPickr is always a single instance
      flatpickrInstance.current = Array.isArray(flatPickr)
        ? flatPickr[0]
        : flatPickr;
    };

    loadTheme();

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, theme]); // Add `theme` to the dependency array

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (flatpickrInstance.current) {
      flatpickrInstance.current.clear();
      setHasValue(false);
    }
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 pr-20 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-white text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
        />

        <div className="absolute -translate-y-1/2 right-3 top-1/2 flex items-center gap-1">
          {isClearable && hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear date">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <span className="text-gray-500 dark:text-gray-400 pointer-events-none">
            <CalenderIcon />
          </span>
        </div>
      </div>
    </div>
  );
}
