"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";
import ReactDatePicker from "../DateRangePicker";
import Label from "@/components/form/Label";
import FilterDropdown from "./FilterDropdown";

export interface FilterOption {
  value: any;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options?: FilterOption[];
  placeholder?: string;
  type?: "dropdown" | "checkbox" | "dateRange";
  dynamicPlaceholder?: (tempFilters: Record<string, any>) => string;
  totalRecords?: number;
  loadMoreData?: any;
  showCheckboxes?: boolean;
  selectedOptions?: string[];
  id?: string;
  handleCheckbox?: any;
  setActiveDropdown?: any;
  disabled?: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  filters: FilterConfig[];
  filterValues: { [key: string]: string };
  onFilterChange: (key: string, value: string) => void;
  onApply: (appliedFilters: { [key: string]: string }) => void;
  className?: string;
  onSelectOption?: (id: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  filters,
  filterValues,
  onFilterChange,
  onApply,
  className,
  onSelectOption,
}) => {
  const [tempFilters, setTempFilters] = useState(filterValues);

  useEffect(() => {
    setTempFilters(filterValues);
  }, [filterValues]);

  const handleDropdownChange = (key: string, value: any) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "pipelineId" || key === "personType" && onSelectOption) {
      onSelectOption?.(value);
    }
  };

  const handleApply = () => {
    const normalizedFilters: Record<string, string> = {};

    Object.entries(tempFilters).forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        ("start" in value || "end" in value)
      ) {
        const dateValue = value as { start: string | null; end: string | null };
        normalizedFilters[`${key}Start`] = dateValue.start || "";
        normalizedFilters[`${key}End`] = dateValue.end || "";
        onFilterChange(`${key}Start`, dateValue.start || "");
        onFilterChange(`${key}End`, dateValue.end || "");
      } else {
        const normalizedValue = Array.isArray(value)
          ? value.join(",")
          : String(value || "");
        normalizedFilters[key] = normalizedValue;
        onFilterChange(key, normalizedValue);
      }
    });

    onApply(normalizedFilters);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`max-w-[600px] p-5 lg:p-10 m-4 ${className}`}>
      <div className="px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h4>
        {description && (
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {description}
          </p>
        )}
      </div>

      <div
        className={`grid gap-6 px-2 ${
          filters.length > 2 ? "md:grid-cols-2" : "grid-cols-1"
        }`}>
        {filters.map((filter) => (
          <div
            key={filter.key}
            className={filters.length <= 2 ? "col-span-full" : ""}>
            {filter.type === "checkbox" ? (
              <div className="flex h-full">
                <Checkbox
                  label={filter.label}
                  checked={!!tempFilters[filter.key]}
                  onChange={(checked) =>
                    setTempFilters((prev: any) => ({
                      ...prev,
                      [filter.key]: checked,
                    }))
                  }
                  className="flex items-center"
                />
              </div>
            ) : filter.type === "dateRange" ? (
              <div>
                <Label>
                  {filter.label}
                </Label>
                <ReactDatePicker
                  formData={tempFilters}
                  setFormData={setTempFilters}
                  isFilter={true}
                />
              </div>
            ) : (
              <FilterDropdown
                label={filter.label}
                value={tempFilters[filter.key] || ""}
                options={filter.options ?? []}
                onChange={(value) => handleDropdownChange(filter.key, value)}
                placeholder={
                  filter.dynamicPlaceholder
                    ? filter.dynamicPlaceholder(tempFilters)
                    : filter.placeholder ||
                      `Select ${filter.label.toLowerCase()}`
                }
                totalRecords={filter.totalRecords}
                loadMoreData={filter.loadMoreData}
                showCheckboxes={filter.showCheckboxes}
                selectedOptions={
                  filter.selectedOptions ||
                  (typeof tempFilters[filter.key] === "string"
                    ? tempFilters[filter.key]
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : Array.isArray(tempFilters[filter.key])
                    ? tempFilters[filter.key]
                    : [])
                }
                id={filter.id}
                setActiveDropdown={filter.setActiveDropdown}
                handleCheckbox={async (
                  options: any[],
                  selectAll: boolean,
                  selected: any[],
                  props: any,
                  isChecked: boolean
                ) => {
                  let selectedValues: string[];

                  if (selectAll) {
                    selectedValues = isChecked
                      ? options.map((opt) => opt.value)
                      : [];
                  } else {
                    const current = selected.map((s) => s.value);
                    const alreadySelected = current.includes(props.value);
                    selectedValues = alreadySelected
                      ? current.filter((id) => id !== props.value)
                      : [...current, props.value];
                  }
                  handleDropdownChange(filter.key, selectedValues);
                  filter.handleCheckbox?.(selectedValues);
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between w-full gap-3 sm:w-auto mt-8 px-2">
        <Button size="sm" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" variant="gradient" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </Modal>
  );
};

export default FilterModal;
