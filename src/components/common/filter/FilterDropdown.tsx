"use client";
import React from "react";
import Label from "../../form/Label";
import SearchableSelect from "@/components/form/SearchableSelect";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: { value?: string; label?: string; _id?: string; name?: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  totalRecords?: number;
  loadMoreData?: any;
  showCheckboxes?: boolean;
  selectedOptions?: any;
  id?: string;
  handleCheckbox?: any;
  setActiveDropdown?: any;
  disabled?: boolean
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select option",
  totalRecords,
  loadMoreData,
  showCheckboxes,
  selectedOptions,
  id,
  handleCheckbox,
  setActiveDropdown,
  disabled
}) => {
  const selectedOption = options?.find(
    (opt) => (opt.value || opt._id) === value
  );

  return (
    <div className="mb-4" style={{ position: "relative" }}>
      <Label>{label}</Label>
      <SearchableSelect
        dataProps={{
          optionData: options?.map((opt: any) => ({
            _id: opt.value || opt._id,
            name: opt.label || opt.name,
          })),
          total: totalRecords,
          loadMoreData: loadMoreData,
        }}
        selectionProps={{
          showCheckboxes: showCheckboxes,
          selectedOptions: showCheckboxes
            ? selectedOptions?.map((id: string) => {
                const option = options?.find(
                  (opt: any) => (opt.value || opt._id) === id
                );
                return {
                  value: id,
                  label: option?.label || option?.name || id,
                };
              })
            : null,
          selectedValue: !showCheckboxes ? selectedOption : null,
        }}
        displayProps={{
          placeholder: placeholder,
          id: id,
          disabled: disabled,
          layoutProps: {
            className: "w-full",
          },
          inputProps: {
            className: "w-full px-3 py-2 text-sm",
          },
        }}
        eventHandlers={{
          onChange: !showCheckboxes
            ? (option: any) => onChange(option?.value || option?._id || "")
            : null,
          handleCheckbox: showCheckboxes ? handleCheckbox : null,
          onDropdownClose: () => {
            setActiveDropdown?.(null);
          },
        }}
      />
    </div>
  );
};

export default FilterDropdown;
