"use client";

import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

type DateTimePickerProps = {
  value: any;
  onChange: (val: any) => void;
  mode?: "single" | "range";
  allowTime?: boolean;
  onlyFuture?: boolean;
  onlyPast?: boolean;
  maxRangeDays?: number | null;
  error?: boolean;
  className?: string;
};

export default function DateTimePicker({
  value,
  onChange,
  mode = "single",
  allowTime = false,
  onlyFuture = false,
  onlyPast = false,
  maxRangeDays = null,
  error,
  className,
}: DateTimePickerProps) {
  const [showCalender, setShowCalender] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const [calendarPosition, setCalendarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [inputWidth, setInputWidth] = useState<number | null>(null);

  // 👉 format function
  const formatDateTime = (date: Date | string | null) => {
    if (!date) return "";

    const parsedDate = date instanceof Date ? date : new Date(date);

    // Check if date is valid
    if (isNaN(parsedDate.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      ...(allowTime && { hour: "2-digit", minute: "2-digit" }),
    }).format(parsedDate);
  };

  // 👉 handle change
  const handleChange = (dates: any) => {
    if (mode === "range") {
      const [start, end] = dates as [Date | null, Date | null];
      if (start && end && maxRangeDays) {
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        if (diff > maxRangeDays) {
          alert(`Maximum range is ${maxRangeDays} days`);
          return;
        }
      }
      onChange([start, end]);
    } else {
      onChange(dates);
    }
  };

  // 👉 Update position & handle outside click
  useEffect(() => {
    const updateCalendarPosition = () => {
      if (!selectRef.current) return;
      const rect = selectRef.current.getBoundingClientRect();
      setInputWidth(rect.width);
      setCalendarPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !selectRef.current?.contains(event.target as Node)
      ) {
        setShowCalender(false);
      }
    };

    if (showCalender) {
      updateCalendarPosition();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", updateCalendarPosition);
      window.addEventListener("scroll", updateCalendarPosition, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateCalendarPosition);
      window.removeEventListener("scroll", updateCalendarPosition, true);
    };
  }, [showCalender]);

  return (
    <div className="relative w-full" ref={selectRef}>
      <input
        onClick={() => setShowCalender((prev) => !prev)}
        placeholder="Select date"
        value={
          mode === "range"
            ? value?.[0]
              ? `${formatDateTime(value[0])}${
                  value?.[1] ? " - " + formatDateTime(value[1]) : ""
                }`
              : ""
            : value
            ? formatDateTime(value)
            : ""
        }
        readOnly
        className={`text-sm h-10 w-full rounded-lg border appearance-none px-4 py-2.5 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 focus:border-brand-300 focus:ring-brand-500/20 dark:text-white/90  dark:focus:border-brand-800 ${
          error
            ? "border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800"
            : "border-gray-300 dark:border-gray-700"
        } ${className}`}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange(mode === "range" ? [null, null] : null)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      )}

      {showCalender &&
        typeof document !== "undefined" &&
        calendarPosition &&
        createPortal(
          <div
            ref={calendarRef}
            style={{
              position: "absolute",
              top: calendarPosition.top,
              left: calendarPosition.left,
              zIndex: 99999,
              width: inputWidth ?? "auto",
            }}
            onClick={(e) => e.stopPropagation()}>
            {mode === "range" ? (
              <DatePicker
                onChange={handleChange}
                selected={value?.[0]}
                startDate={value?.[0]}
                endDate={value?.[1]}
                inline
                selectsRange
                showTimeInput={allowTime}
                timeInputLabel="Time:"
                dateFormat={allowTime ? "MM/dd/yyyy h:mm aa" : "MM/dd/yyyy"}
                minDate={onlyFuture ? new Date() : undefined}
                maxDate={onlyPast ? new Date() : undefined}
              />
            ) : (
              <DatePicker
                onChange={handleChange}
                selected={value}
                inline
                showTimeInput={allowTime}
                timeInputLabel="Time:"
                dateFormat={allowTime ? "MM/dd/yyyy h:mm aa" : "MM/dd/yyyy"}
                minDate={onlyFuture ? new Date() : undefined}
                maxDate={onlyPast ? new Date() : undefined}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
