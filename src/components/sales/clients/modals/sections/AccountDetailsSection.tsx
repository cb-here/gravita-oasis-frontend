import React from "react";
import Label from "@/components/form/Label";
import SearchableSelect from "@/components/form/SearchableSelect";

interface AccountDetailsSectionProps {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLedgerChange?: (option: any) => void;
}

export default function AccountDetailsSection({
  formData,
  onInputChange,
  onLedgerChange,
}: AccountDetailsSectionProps) {
  const ledgerOptions = [
    { label: "Ledger 1", value: "ledger1" },
    { label: "Ledger 2", value: "ledger2" },
    { label: "Ledger 3", value: "ledger3" },
  ];

  return (
    <div className="p-4 space-y-4 border border-gray-200 dark:border-gray-700 rounded-b-lg">
      <div>
        <Label>Ledger Configuration</Label>
        <div className="flex gap-6 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ledgerConfiguration"
              value="none"
              checked={formData.ledgerConfiguration === "none"}
              onChange={onInputChange}
              className="w-4 h-4 text-brand-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Don&apos;t create
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ledgerConfiguration"
              value="create"
              checked={formData.ledgerConfiguration === "create"}
              onChange={onInputChange}
              className="w-4 h-4 text-brand-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Create new ledger
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="ledgerConfiguration"
              value="link"
              checked={formData.ledgerConfiguration === "link"}
              onChange={onInputChange}
              className="w-4 h-4 text-brand-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Link an existing ledger
            </span>
          </label>
        </div>
      </div>

      {formData.ledgerConfiguration === "link" && (
        <div>
          <Label className="flex items-center gap-1">Link Ledger</Label>
          <SearchableSelect
            dataProps={{
              optionData: ledgerOptions.map((opt) => ({
                _id: opt.value,
                name: opt.label,
              })),
            }}
            selectionProps={{
              selectedValue: formData.linkLedger
                ? {
                    _id: formData.linkLedger,
                    value: formData.linkLedger,
                    label:
                      ledgerOptions.find(
                        (opt) => opt.value === formData.linkLedger
                      )?.label || "",
                  }
                : null,
            }}
            displayProps={{
              placeholder: "Select Ledger",
              id: "linkLedger",
              isClearable: true,
            }}
            eventHandlers={{
              onChange: onLedgerChange,
            }}
          />
        </div>
      )}
    </div>
  );
}
