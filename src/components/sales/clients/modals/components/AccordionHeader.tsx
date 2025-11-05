import React from "react";
import { ChevronDown } from "lucide-react";

interface AccordionHeaderProps {
  section: string;
  title: string;
  isOpen: boolean;
  onToggle: (section: string) => void;
}

export default function AccordionHeader({
  section,
  title,
  isOpen,
  onToggle,
}: AccordionHeaderProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(section)}
      className={`flex items-center justify-between w-full p-4 text-left 
        bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 
        transition-colors rounded-t-lg 
        ${isOpen ? "rounded-b-none" : "rounded-b-lg"}`}
    >
      <span className="font-semibold text-gray-800 dark:text-white">
        {title}
      </span>
      <ChevronDown
        className={`w-5 h-5 text-gray-500 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}
