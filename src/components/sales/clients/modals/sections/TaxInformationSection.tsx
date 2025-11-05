import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import SearchableSelect from "@/components/form/SearchableSelect";

interface TaxInformationSectionProps {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTaxTreatmentChange: (option: any) => void;
  getTaxLabel: (country: string) => string;
}

const taxTreatmentOptions = [
  { label: "Overseas", value: "overseas", _id: "overseas", name: "Overseas" },
  { label: "Domestic", value: "domestic", _id: "domestic", name: "Domestic" },
  { label: "Exempt", value: "exempt", _id: "exempt", name: "Exempt" },
];

export default function TaxInformationSection({
  formData,
  onInputChange,
  onTaxTreatmentChange,
  getTaxLabel,
}: TaxInformationSectionProps) {
  return (
    <div className="p-4 space-y-4 border border-gray-200 dark:border-gray-700 rounded-b-lg">
      {/* VAT Number */}
      <div>
        <Label>{getTaxLabel(formData.countryCode)}</Label>
        <Input
          name="vatNumber"
          placeholder={getTaxLabel(formData.countryCode)}
          value={formData.vatNumber}
          onChange={onInputChange}
        />
      </div>

      {/* Client Type */}
      <div>
        <Label className="flex items-center gap-2">
          Client Type
          <svg
            className="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </Label>
        <div className="flex gap-6 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="clientType"
              value="individual"
              checked={formData.clientType === "individual"}
              onChange={onInputChange}
              className="w-4 h-4 text-brand-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Individual
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="clientType"
              value="company"
              checked={formData.clientType === "company"}
              onChange={onInputChange}
              className="w-4 h-4 text-brand-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Company
            </span>
          </label>
        </div>
      </div>

      {/* Tax Treatment */}
      <div>
        <Label className="flex items-center gap-2">
          Tax Treatment
          <svg
            className="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </Label>
        <SearchableSelect
          dataProps={{
            optionData: taxTreatmentOptions.map((opt) => ({
              _id: opt.value,
              name: opt.label,
            })),
          }}
          selectionProps={{
            selectedValue: formData.taxTreatment
              ? {
                  _id: formData.taxTreatment,
                  value: formData.taxTreatment,
                  label:
                    taxTreatmentOptions.find(
                      (opt) => opt.value === formData.taxTreatment
                    )?.label || "",
                }
              : null,
          }}
          displayProps={{
            placeholder: "Select Tax Treatment",
          }}
          eventHandlers={{
            onChange: onTaxTreatmentChange,
            onDropdownClose: () => {},
          }}
        />
      </div>
    </div>
  );
}
