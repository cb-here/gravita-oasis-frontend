import React from "react";

export default function Tabs({
  tabGroups,
  selectedTabGroup,
  setSelectedTabGroup,
  onClick,
  fullWidth = false,
}: {
  tabGroups: (
    | false
    | { key: string; name: string; icon?: React.ElementType; count?: number }
  )[];
  selectedTabGroup: string;
  setSelectedTabGroup?: (key: string) => void;
  onClick?: (key: string) => void;
  fullWidth?: boolean;
}) {
  return (
    <div className="flex items-center gap-x-1 gap-y-2 rounded-lg overflow-x-auto custom-scrollbar bg-gray-100 p-0.5 dark:bg-gray-900">
      {tabGroups.map((group) => {
        if (!group) return;
        const Icon = group.icon;
        return (
          <button
            type="button"
            key={group.key}
            onClick={() => {
              setSelectedTabGroup?.(group.key);
              onClick?.(group.key);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap group hover:text-gray-900 dark:hover:text-white ${
              selectedTabGroup === group.key
                ? "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                : "text-gray-500 dark:text-gray-400"
            } ${
              fullWidth
                ? "flex-1 justify-center"
                : "w-auto xl:justify-start justify-center"
            }`}
          >
            {Icon && <Icon className="h-4 w-4 -mt-0.5" />}
            {group.name}
            {group.count !== undefined && group.count > 0 && (
              <span
                className={`inline-flex flex-shrink-0 items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                  selectedTabGroup === group.key
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                }`}
              >
                {group.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
