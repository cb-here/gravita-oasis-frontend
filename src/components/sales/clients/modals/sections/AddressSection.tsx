"use client";

import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import SearchableSelect from "@/components/form/SearchableSelect";

interface AddressSectionProps {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressCountryChange?: (option: any) => void;
  onAddressStateChange?: (option: any) => void;
  onAddressCityChange?: (option: any) => void;
}

export default function AddressSection({
  formData,
  onInputChange,
  onAddressCountryChange,
  onAddressStateChange,
  onAddressCityChange,
}: AddressSectionProps) {
  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [stateOptions, setStateOptions] = useState<any[]>([]);
  const [cityOptions, setCityOptions] = useState<any[]>([]);

  // Load all countries when component mounts
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.isoCode,
      _id: country.isoCode,
      name: country.name,
    }));
    setCountryOptions(countries);
  }, []);

  // Handle country change → load states
  const handleCountryChange = (option: any) => {
    const states = State.getStatesOfCountry(option.value).map((state) => ({
      label: state.name,
      value: state.isoCode,
      _id: state.isoCode,
      name: state.name,
    }));
    setStateOptions(states);
    setCityOptions([]); // reset city options
    onAddressCountryChange?.(option);
  };

  // Handle state change → load cities
  const handleStateChange = (option: any) => {
    const cities = City.getCitiesOfState(
      formData.addressCountry,
      option.value
    ).map((city) => ({
      label: city.name,
      value: city.name,
      _id: city.name,
      name: city.name,
    }));
    setCityOptions(cities);
    onAddressStateChange?.(option);
  };

  // Handle city change
  const handleCityChange = (option: any) => {
    onAddressCityChange?.(option);
  };

  return (
    <div className="p-4 space-y-4 border border-gray-200 dark:border-gray-700 rounded-b-lg">

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
              selectedValue: formData.addressCountry
                ? {
                    _id: formData.addressCountry,
                    value: formData.addressCountry,
                    label:
                      countryOptions.find(
                        (opt) => opt.value === formData.addressCountry
                      )?.label || "",
                  }
                : null,
            }}
            displayProps={{
              placeholder: "Select Country",
              isRequired: true,
              isClearable: true
            }}
            eventHandlers={{
              onChange: handleCountryChange,
            }}
          />
        </div>

        <div>
          <Label>Select State / Province</Label>
          <SearchableSelect
            dataProps={{
              optionData: stateOptions.map((opt) => ({
                _id: opt.value,
                name: opt.label,
              })),
            }}
            selectionProps={{
              selectedValue: formData.addressState
                ? {
                    _id: formData.addressState,
                    value: formData.addressState,
                    label:
                      stateOptions.find(
                        (opt) => opt.value === formData.addressState
                      )?.label || "",
                  }
                : null,
            }}
            displayProps={{
              placeholder: "Select State / Province",
              isClearable: true
            }}
            eventHandlers={{
              onChange: handleStateChange,
            }}
          />
        </div>
      </div>

      <div>
        <Label>Select City / Town</Label>
        <SearchableSelect
          dataProps={{
            optionData: cityOptions.map((opt) => ({
              _id: opt.value,
              name: opt.label,
            })),
          }}
          selectionProps={{
            selectedValue: formData.addressCity
              ? {
                  _id: formData.addressCity,
                  value: formData.addressCity,
                  label:
                    cityOptions.find((opt) => opt.value === formData.addressCity)
                      ?.label || "",
                }
              : null,
          }}
          displayProps={{
            placeholder: "Select City / Town",
            isClearable: true
          }}
          eventHandlers={{
            onChange: handleCityChange
          }}
        />
      </div>

      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Street Address</Label>
          <Input
            name="addressStreet"
            placeholder="Street Address"
            value={formData.addressStreet}
            onChange={onInputChange}
          />
        </div>

        <div>
          <Label>Postal Code / Zip Code</Label>
          <Input
            name="addressZipCode"
            placeholder="Postal Code / Zip Code"
            value={formData.addressZipCode}
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
}
