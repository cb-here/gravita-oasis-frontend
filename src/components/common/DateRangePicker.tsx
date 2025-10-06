"use client";

import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { showToast } from "@/lib/toast";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export default function ReactDatePicker({
  formData,
  setFormData,
  isFilter,
  max = null,
}: {
  formData: any;
  setFormData: any;
  isFilter: boolean;
  max?: number | null;
}) {
  const [showCalender, setShowCalender] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const formatToDate = (date: Date | null) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const onChange = (dates: [Date | null, Date | null] | Date | null) => {
    const [start, end] = dates as [Date | null, Date | null];

    const startDay = new Date(start || "");
    const endDay = new Date(end || "");

    startDay.setHours(0, 0, 0, 0);
    endDay.setHours(0, 0, 0, 0);

    const differenceInDays =
      (endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24);

    if (max && differenceInDays >= max) {
      // showToast("error", "", `Please select a maximum range of ${max} days.`);
      clearDate();
      return;
    }

    if (differenceInDays < 1) {
      // showToast("error", "", "Please select at least 2 days.");
      clearDate();
      return;
    }

    if (isFilter && (startDay > new Date() || endDay > new Date())) {
      // showToast("error", "", "You cannot select dates beyond today.");
      clearDate();
      return;
    }

    setFormData((prev: any) => {
      const startDate = formatToDate(start);
      const endDate = formatToDate(end);

      return isFilter
        ? {
            ...prev,
            dateStart: startDate,
            dateEnd: endDate,
          }
        : {
            ...prev,
            date: { start: startDate, end: endDate },
          };
    });
    // }
  };

  const formateDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  const clearDate = () => {
    setFormData((prev: any) =>
      isFilter
        ? {
            ...prev,
            dateStart: null,
            dateEnd: null,
          }
        : {
            ...prev,
            date: { start: null, end: null },
          }
    );
  };

  const [placement, setPlacement] = useState<"top" | "bottom" | "auto">("auto");

  const [calendarPosition, setCalendarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const [inputWidth, setInputWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateCalendarPosition = () => {
      const rect = selectRef.current?.getBoundingClientRect();
      if (rect) {
        setInputWidth(rect.width);
        setCalendarPosition({
          top:
            placement === "top"
              ? rect.top + window.scrollY - 340
              : rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
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
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", updateCalendarPosition);
      window.addEventListener("scroll", updateCalendarPosition, true);

      updateCalendarPosition(); // Initial call
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updateCalendarPosition);
      window.removeEventListener("scroll", updateCalendarPosition, true);
    };
  }, [showCalender, placement]);

  useEffect(() => {
    const adjustPlacement = () => {
      if (!selectRef.current) return;

      const rect = selectRef.current.getBoundingClientRect();
      const modalHeight = window.innerHeight;
      const spaceBelow = modalHeight - rect.bottom;
      const spaceAbove = rect.top;

      const dropdownHeight = 300; // max menuList height you defined

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    };

    adjustPlacement();
    window.addEventListener("resize", adjustPlacement);
    return () => window.removeEventListener("resize", adjustPlacement);
  }, []);

  return (
    <div className="relative w-full" ref={selectRef}>
      <input
        onClick={() => {
          if (!showCalender && selectRef.current) {
            const rect = selectRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const calendarHeight = 320;

            setPlacement(
              spaceBelow < calendarHeight && spaceAbove > calendarHeight
                ? "top"
                : "bottom"
            );
          }

          setShowCalender((prev) => !prev);
        }}
        placeholder="Select time range"
        value={
          isFilter && formData?.dateStart
            ? formData?.dateEnd
              ? `${formateDate(formData.dateStart)} - ${formateDate(
                  formData.dateEnd
                )}`
              : `${formateDate(formData.dateStart)}`
            : formData?.date?.start
            ? formData?.date?.end
              ? `${formateDate(formData.date.start)} - ${formateDate(
                  formData.date.end
                )}`
              : `${formateDate(formData.date.start)}`
            : ""
        }
        readOnly
        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-700 dark:placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800"
      />

      {formData?.dateStart && (
        <button
          type="button"
          onClick={clearDate}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5 font-bold" />
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
            className=""
            onClick={(e) => e.stopPropagation()}
          >
            <DatePicker
              onChange={onChange}
              selected={
                isFilter && formData?.dateStart
                  ? new Date(formData?.dateStart)
                  : formData?.date?.start
                  ? new Date(formData.date.start)
                  : null
              }
              startDate={
                isFilter && formData?.dateStart
                  ? new Date(formData.dateStart)
                  : formData?.date?.start
                  ? new Date(formData.date.start)
                  : null
              }
              endDate={
                isFilter && formData?.dateEnd
                  ? new Date(formData.dateEnd)
                  : formData?.date?.end
                  ? new Date(formData.date.end)
                  : null
              }
              selectsRange
              inline
              minDate={!isFilter ? new Date() : undefined}
              maxDate={isFilter ? new Date() : undefined}
              calendarClassName="bg-white dark:bg-black"
            />
          </div>,
          document.body
        )}
    </div>
  );
}
