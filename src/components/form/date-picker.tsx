"use client";

import { useEffect, useRef, useState } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import { useTheme } from "@/context/ThemeContext";
import { showToast } from "@/lib/toast";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: any;
  label?: string;
  placeholder?: string;
  isClearable?: boolean;
  maxSelectableDates?: number;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  isClearable = true,
  maxSelectableDates
}: PropsType) {
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);
  const [hasValue, setHasValue] = useState(!!defaultDate);
  const { theme } = useTheme();

  // Helper function to calculate days between two dates
  const getDaysDifference = (startDate: Date, endDate: Date): number => {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return dayDiff + 1; // +1 to include both start and end dates
  };

  useEffect(() => {
    const loadTheme = async () => {
      const themeFile = theme === "dark" ? "dark.css" : "light.css";
      await import(`flatpickr/dist/themes/${themeFile}`);

      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }

      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      const config: flatpickr.Options.Options = {
        mode: mode || "single",
        static: !isMobile,
        monthSelectorType: "static",
        dateFormat: "Y-m-d",
        defaultDate,
      };

      // Handle maxSelectableDates for different modes
      if (maxSelectableDates) {
        if (mode === "range") {
          // For RANGE mode - limit the number of days in the range
          config.onChange = (selectedDates, dateStr, instance) => {
            console.log("Range mode - Selected dates:", selectedDates);
            
            if (selectedDates.length === 2) {
              const [startDate, endDate] = selectedDates;
              const daysInRange = getDaysDifference(startDate, endDate);
              console.log("Days in range:", daysInRange);
              
              if (daysInRange > maxSelectableDates) {
                showToast(
                  "error", 
                  `Maximum ${maxSelectableDates} days allowed`, 
                  `Your selection spans ${daysInRange} days. Please select a smaller range.`
                );
                
                // Calculate valid end date
                const validEndDate = new Date(startDate);
                validEndDate.setDate(startDate.getDate() + (maxSelectableDates - 1));
                
                // Set the valid date range
                instance.setDate([startDate, validEndDate], false);
                
                setHasValue(true);
                
                
                if (onChange) {
                  const correctedDates = [startDate, validEndDate];
                  const correctedDateStr = instance.formatDate(correctedDates as any, "Y-m-d");
                  if (Array.isArray(onChange)) {
                    onChange.forEach((fn) => fn(correctedDates, correctedDateStr, instance));
                  } else {
                    onChange(correctedDates, correctedDateStr, instance);
                  }
                }
                return;
              }
            }
            
            // If within limits or not a complete range yet
            setHasValue(selectedDates.length > 0);
            if (onChange) {
              if (Array.isArray(onChange)) {
                onChange.forEach((fn) => fn(selectedDates, dateStr, instance));
              } else {
                onChange(selectedDates, dateStr, instance);
              }
            }
          };

          // Visual feedback for disabled days in range mode
          config.onDayCreate = (dObj, dStr, fp, dayElem) => {
            const selectedDates = fp.selectedDates;
            
            if (selectedDates.length === 1) {
              const startDate = selectedDates[0];
              const currentDate = dayElem.dateObj;
              const daysDifference = getDaysDifference(startDate, currentDate);
              
              // Disable days that would exceed the maximum range
              if (daysDifference > maxSelectableDates) {
                dayElem.classList.add("flatpickr-disabled");
                dayElem.style.opacity = "0.5";
                dayElem.style.cursor = "not-allowed";
              }
            }
          };

        } else if (mode === "multiple") {
          // For MULTIPLE mode - limit the number of individual dates selected
          config.onChange = (selectedDates, dateStr, instance) => {
            if (selectedDates.length > maxSelectableDates) {
              showToast("error", `Maximum ${maxSelectableDates} dates allowed`, "Please select fewer dates");
              
              const trimmedDates = selectedDates.slice(0, maxSelectableDates);
              instance.setDate(trimmedDates, true);
              setHasValue(trimmedDates.length > 0);
              
              if (onChange) {
                if (Array.isArray(onChange)) {
                  onChange.forEach((fn) => fn(trimmedDates, dateStr, instance));
                } else {
                  onChange(trimmedDates, dateStr, instance);
                }
              }
            } else {
              setHasValue(selectedDates.length > 0);
              if (onChange) {
                if (Array.isArray(onChange)) {
                  onChange.forEach((fn) => fn(selectedDates, dateStr, instance));
                } else {
                  onChange(selectedDates, dateStr, instance);
                }
              }
            }
          };
        } else {
          // For SINGLE mode - use the original onChange
          config.onChange = (selectedDates, dateStr, instance) => {
            setHasValue(selectedDates.length > 0);
            if (onChange) {
              if (Array.isArray(onChange)) {
                onChange.forEach((fn) => fn(selectedDates, dateStr, instance));
              } else {
                onChange(selectedDates, dateStr, instance);
              }
            }
          };
        }
      } else {
        // No maxSelectableDates - use original onChange
        config.onChange = (selectedDates, dateStr, instance) => {
          setHasValue(selectedDates.length > 0);
          if (onChange) {
            if (Array.isArray(onChange)) {
              onChange.forEach((fn) => fn(selectedDates, dateStr, instance));
            } else {
              onChange(selectedDates, dateStr, instance);
            }
          }
        };
      }

      const flatPickr = flatpickr(`#${id}`, config);

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
  }, [mode, onChange, id, defaultDate, theme, maxSelectableDates]);

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