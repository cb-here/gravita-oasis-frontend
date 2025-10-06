"use client";
import React, { useState } from "react";
import {
  startOfDay,
  endOfDay,
  subDays,
  format,
  getDaysInMonth,
  getDay,
  startOfMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import SearchableSelect from "../form/SearchableSelect";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"; 

type DateRange = {
  startDate: Date;
  endDate: Date;
};

const getDateRange = (selected: string): DateRange => {
  const baseDate = new Date();
  switch (selected) {
    case "today":
      return { startDate: startOfDay(baseDate), endDate: endOfDay(baseDate) };
    case "this_week":
      return {
        startDate: startOfDay(subDays(baseDate, 6)),
        endDate: endOfDay(baseDate),
      };
    case "this_month":
      return {
        startDate: startOfDay(subDays(baseDate, 29)),
        endDate: endOfDay(baseDate),
      };
    case "this_year":
      return {
        startDate: startOfDay(subDays(baseDate, 364)),
        endDate: endOfDay(baseDate),
      };
    default:
      return { startDate: startOfDay(baseDate), endDate: endOfDay(baseDate) };
  }
};

interface IProps {
  onDateChange: (rangeType: string, range: DateRange | null) => void;
}

const CustomDateRange: React.FC<IProps> = ({ onDateChange }) => {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMon = today.getMonth();
  const [selectedRange, setSelectedRange] = useState<string>("today");
  const [dateRange, setDateRange] = useState<DateRange>(getDateRange("today"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(subMonths(today, 1));
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
    selecting: boolean;
  }>({
    startDate: null,
    endDate: null,
    selecting: false,
  });

  const tentativeNextMonth = addMonths(currentMonth, 1);
  const tentativeNextYear = tentativeNextMonth.getFullYear();
  const tentativeNextMon = tentativeNextMonth.getMonth();
  const isTentativeNextFuture = tentativeNextYear > todayYear || (tentativeNextYear === todayYear && tentativeNextMon > todayMon);
  const effectiveNextMonth = isTentativeNextFuture ? currentMonth : tentativeNextMonth;

  const newCurrentMonth = tentativeNextMonth;
  const newTentativeNextMonth = addMonths(newCurrentMonth, 1);
  const newTentativeNextYear = newTentativeNextMonth.getFullYear();
  const newTentativeNextMon = newTentativeNextMonth.getMonth();
  const isNewTentativeNextFuture = newTentativeNextYear > todayYear || (newTentativeNextYear === todayYear && newTentativeNextMon > todayMon);
  const canNavigateNext = !isNewTentativeNextFuture;

  const handleOpenModal = () => {
    if (selectedRange === "custom_date" && dateRange.startDate && dateRange.endDate) {
      setSelectedDates({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        selecting: false,
      });
    } else {
      setSelectedDates({
        startDate: null,
        endDate: null,
        selecting: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    if (date > today) return; // Prevent selecting future dates

    if (!selectedDates.selecting || !selectedDates.startDate) {
      setSelectedDates({ startDate: date, endDate: date, selecting: true });
    } else {
      const [start, end] =
        selectedDates.startDate <= date
          ? [selectedDates.startDate, date]
          : [date, selectedDates.startDate];
      setSelectedDates({ startDate: start, endDate: end, selecting: false });
    }
  };

  const isDateStart = (date: Date) =>
    selectedDates.startDate && isSameDay(date, selectedDates.startDate);
  const isDateEnd = (date: Date) =>
    selectedDates.endDate && isSameDay(date, selectedDates.endDate);
  const isDateInRange = (date: Date) => {
    const { startDate, endDate } = selectedDates;
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const renderCalendar = (month: Date) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDayOfMonth = startOfMonth(month);
    const dayOfWeek =
      getDay(firstDayOfMonth) === 0 ? 7 : getDay(firstDayOfMonth);
    const days = [];

    for (let i = 1; i < dayOfWeek; i++)
      days.push(
        <div key={`empty-prev-${i}`} className="h-8 w-8 mx-auto"></div>
      );

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const isStart = isDateStart(date);
      const isEnd = isDateEnd(date);
      const isRange = isDateInRange(date);
      const isToday = isSameDay(date, new Date());

      let cellClasses =
        "h-8 w-8 flex items-center justify-center text-sm font-medium mx-auto transition-colors cursor-pointer ";

      if (date > today) {
        cellClasses += "text-gray-300 cursor-not-allowed";
      } else if (isStart && isEnd)
        cellClasses += "bg-[#5750F1] text-white rounded-md ";
      else if (isStart) cellClasses += "bg-[#5750F1] text-white rounded-l-md ";
      else if (isEnd) cellClasses += "bg-[#5750F1] text-white rounded-r-md ";
      else if (isRange) cellClasses += "bg-[#e0deff] text-[#5750F1] ";
      else if (isToday)
        cellClasses += "border border-[#5750F1] text-[#5750F1] rounded-md ";
      else cellClasses += "hover:bg-[#e0deff] text-[#475467] rounded-md ";

      days.push(
        <button
          key={`day-${day}`}
          className={cellClasses}
          onClick={() => handleDateClick(date)}
          disabled={date > today}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    if (canNavigateNext) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const handleApplyCustom = () => {
    if (selectedDates.startDate && selectedDates.endDate) {
      const newRange = {
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate,
      };
      setDateRange(newRange);
      setSelectedRange("custom_date");
      onDateChange("custom_date", newRange);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex gap-3 items-center">
      <SearchableSelect
        dataProps={{
          optionData: [
            { _id: "today", name: "Today" },
            { _id: "this_week", name: "Weekly" },
            { _id: "this_month", name: "Monthly" },
            { _id: "this_year", name: "Yearly" },
            { _id: "custom_date", name: "Custom Date" },
          ],
        }}
        selectionProps={{
          selectedValue: { value: selectedRange, label: selectedRange },
        }}
        displayProps={{
          placeholder: "Select Date Range",
          id: "custom-date-select",
          layoutProps: { className: "min-w-[200px]" },
        }}
        eventHandlers={{
          onChange: (option: any) => {
            const type = option.value || option._id;
            if (type === "custom_date") {
              handleOpenModal();
            } else {
              const range = getDateRange(type);
              setSelectedRange(type);
              setDateRange(range);
              onDateChange(type, range);
            }
          },
        }}
      />

      {selectedRange === "custom_date" && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 p-5 mr-2 border-[#EAECF0] text-[#475467]"
          onClick={handleOpenModal}
        >
          <Calendar className="h-4 w-4 text-[#5750F1]" />
          <span className="font-medium">
            {dateRange?.startDate && format(dateRange.startDate, "dd MMM yyyy")}{" "}
            - {dateRange?.endDate && format(dateRange.endDate, "dd MMM yyyy")}
          </span>
        </Button>
      )}

      {/* Custom Date Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-[800px]"
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Date Range</h3>
          </div>

          <div className="bg-[#F9FAFB] rounded-lg p-5">
            <div className="flex justify-between mb-5 items-center">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex w-[85%] justify-between text-center font-medium text-gray-700">
                <span>{format(currentMonth, "MMMM yyyy")}</span>
                <span>{format(effectiveNextMonth, "MMMM yyyy")}</span>
              </div>
              <button
                onClick={handleNextMonth}
                disabled={!canNavigateNext}
                className={`p-2 rounded-md ${canNavigateNext ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50'}`}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex justify-between">
              <div className="w-[48%] grid grid-cols-7 gap-1">
                {renderCalendar(currentMonth)}
              </div>
              <div className="w-[48%] grid grid-cols-7 gap-1">
                {renderCalendar(effectiveNextMonth)}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyCustom} disabled={!selectedDates.startDate || !selectedDates.endDate}>
              Apply
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomDateRange;