import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import SearchableSelect from "@/components/form/SearchableSelect";
import { Upload } from "lucide-react";
import countries from "world-countries";

interface BasicInformationSectionProps {
  formData: any;
  errors: Record<string, string>;
  logoPreview: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
  onCountryChange: (option: any) => void;
  onIndustryChange: (option: any) => void;
}

const industryOptions = [
  {
    label: "Technology",
    name: "Technology",
    _id: "Technology",
    value: "Technology",
  },
  {
    label: "Healthcare",
    name: "Healthcare",
    _id: "Healthcare",
    value: "Healthcare",
  },
  { label: "Finance", name: "Finance", _id: "Finance", value: "Finance" },
  { label: "Retail", name: "Retail", _id: "Retail", value: "Retail" },
  {
    label: "Manufacturing",
    name: "Manufacturing",
    _id: "Manufacturing",
    value: "Manufacturing",
  },
  {
    label: "Education",
    name: "Education",
    _id: "Education",
    value: "Education",
  },
];

export const countryOptions = countries.map((country) => ({
  label: `${country.flag} ${country.name.common}`,
  value: country.cca2,
  _id: country.cca2,
  name: country.name.common,
}));

export default function BasicInformationSection({
  formData,
  errors,
  logoPreview,
  onInputChange,
  onLogoUpload,
  onLogoRemove,
  onCountryChange,
  onIndustryChange,
}: BasicInformationSectionProps) {
  return (
    <div className="p-4 space-y-4 border border-gray-200 dark:border-gray-700 rounded-b-lg">
      {/* Logo Upload */}
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
        {logoPreview ? (
          <div className="relative">
            <img
              src={logoPreview}
              alt="Logo preview"
              className="w-32 h-32 object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={onLogoRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Logo
            </span>
            <span className="text-xs text-gray-500 mt-1">
              JPG or PNG, Dimensions 1080×1080px and file size up to 20MB
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={onLogoUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Business Name */}
      <div>
        <Label required>Business Name</Label>
        <Input
          name="businessName"
          placeholder="Business Name (Required)"
          value={formData.businessName}
          onChange={onInputChange}
          error={!!errors.businessName}
          errorMessage={errors.businessName}
        />
      </div>

      {/* Client Industry */}
      <div>
        <Label required>Client Industry</Label>
        <SearchableSelect
          dataProps={{
            optionData: industryOptions.map((opt) => ({
              _id: opt.value,
              name: opt.label,
            })),
          }}
          selectionProps={{
            selectedValue: formData.clientIndustry
              ? {
                  _id: formData.clientIndustry,
                  value: formData.clientIndustry,
                  label: formData.clientIndustry,
                }
              : null,
          }}
          displayProps={{
            placeholder: "-Select an industry-",
            isClearable: true,
          }}
          eventHandlers={{
            onChange: onIndustryChange,
            onDropdownClose: () => {},
          }}
        />
        {errors.clientIndustry && (
          <p className="text-sm text-red-500 mt-1">{errors.clientIndustry}</p>
        )}
      </div>

      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label required>Select Country</Label>
          <SearchableSelect
            dataProps={{
              optionData: countryOptions.map((opt) => ({
                _id: opt.value,
                name: opt.label,
              })),
            }}
            selectionProps={{
              selectedValue: formData.countryCode
                ? {
                    _id: formData.countryCode,
                    value: formData.countryCode,
                    label:
                      countryOptions.find((opt) => opt.value === formData.countryCode)
                        ?.label || "",
                  }
                : null,
            }}
            displayProps={{
              placeholder: "Select Country",
              isClearable: true,
            }}
            eventHandlers={{
              onChange: onCountryChange,
              onDropdownClose: () => {},
            }}
          />
        </div>

        <div>
          <Label>City/Town</Label>
          <Input
            name="cityTown"
            placeholder="City/Town Name"
            value={formData.cityTown}
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
}
