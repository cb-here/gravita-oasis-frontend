import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { X } from "lucide-react";
import { SortPill } from "./SortPill";

type Option = { value: string; label: string };

interface FilterConfig {
  key: string;
  label?: string;
  options?: Option[];
}

interface Props {
  filters: Record<string, any>;
  sorting?: {
    sortBy?: string;
    sort?: string;
    isDefault?: boolean;
  };
  onRemoveFilter: (key: string) => void;
  onRemoveSort?: () => void;
  filterConfigs?: FilterConfig[];
  labelMap?: Record<string, string>;
  excludedKeys?: string[];
}

const FilterAndSortPills: React.FC<Props> = ({
  filters,
  sorting,
  onRemoveFilter,
  onRemoveSort,
  filterConfigs = [],
  labelMap = {},
  excludedKeys = ["page", "limit", "sort", "sortBy", "search", "type"],
}) => {
  return (
    <div className="flex justify-end mt-2 w-full">
      <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto max-w-full whitespace-nowrap custom-scrollbar py-1 px-2">
        {Object.entries(filters)
          .filter(([key, value]) => value && !excludedKeys.includes(key))
          .map(([key, value]) => {
            const config = filterConfigs.find((f) => f.key === key);
            const values = Array.isArray(value)
              ? value
              : String(value).split(",");

            let displayValue = "";

            if (config?.options) {
              const labels = values
                .map(
                  (val) =>
                    config.options?.find((opt) => opt.value === val)?.label
                )
                .filter(Boolean);
              displayValue = labels.join(", ");
            } else {
              displayValue = values.join(", ");
            }

            const label = labelMap[key] || config?.label || key;

            return (
              <Badge
                key={key}
                variant="light"
                color="info"
                className="flex items-center gap-1 text-xs shrink-0"
              >
                <div className="capitalize max-w-[400px] truncate">
                  {label}: {displayValue}
                </div>
                <button
                  onClick={() => onRemoveFilter(key)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        {sorting?.sortBy && (
          <SortPill
            sortBy={sorting.sortBy}
            sort={sorting.sort || "asc"}
            onRemove={sorting.isDefault ? () => {} : onRemoveSort || (() => {})}
          />
        )}
      </div>
    </div>
  );
};

export default FilterAndSortPills;
