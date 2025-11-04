import React, { useState } from "react";
import { filterPermissions, handleToggleAll } from "./permission-utils";
import Search from "@/components/common/Search";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import PermissionAccordion from "./PermissionAccordian";

interface Action {
  _id: string;
  action: string;
  readOnly?: boolean;
}
interface Permission {
  feature: string;
  actions: Action[];
}

interface Props {
  permissions: Permission[];
  selectedPermissions: string[];
  setSelectedPermissions: (ids: string[]) => void;
  readOnly?: boolean;
  showOnlyLabels?: boolean;
  className?: string;
}

export default function PermissionsMain({
  permissions,
  selectedPermissions,
  setSelectedPermissions,
  readOnly = false,
  className = "",
  showOnlyLabels = false,
}: Props) {
  console.log("🚀 ~ PermissionsMain ~ selectedPermissions:", selectedPermissions)
  const [search, setSearch] = useState("");

  const filtered = filterPermissions(permissions, search);
  const allActionIds = permissions.flatMap((p) => p.actions.map((a) => a._id));
  const isAllChecked = allActionIds.every((id) =>
    selectedPermissions?.includes(id)
  );
  const isIndeterminate =
    allActionIds.some((id) => selectedPermissions?.includes(id)) &&
    !isAllChecked;

  const [expandedFeatures, setExpandedFeatures] = useState<string[]>([]);

  const handleToggleAllAccordions = () => {
    if (expandedFeatures.length === filtered.length) {
      // collapse all
      setExpandedFeatures([]);
    } else {
      // expand all
      setExpandedFeatures(filtered.map((p) => p.feature));
    }
  };

  const isAllExpanded = expandedFeatures.length === filtered.length;

  return (
    <div className={`w-full ${className}`}>
      <Search
        placeholder="Search permissions..."
        value={search}
        onChange={(e: any) => setSearch(e.target.value)}
        className="w-full sm:w-auto xl:w-[300px] mb-4"
      />

      <div className="mb-4 flex items-center gap-4 flex-wrap w-full justify-between">
        {!readOnly ? (
          <>
            <div className="flex items-center gap-2">
              <Checkbox
                id="all"
                checked={isAllChecked}
                indeterminate={isIndeterminate}
                onChange={() =>
                  handleToggleAll({
                    permissions,
                    selectedPermissions,
                    setSelectedPermissions,
                  })
                }
                disabled={readOnly}
              />
              <label
                htmlFor="all"
                className="text-[16px] font-medium mb-0 cursor-pointer text-gray-700 dark:text-gray-400"
              >
                Select All Permissions
              </label>
            </div>
          </>
        ) : (
          <div></div>
        )}
        <Button onClick={handleToggleAllAccordions} variant="outline">
          {isAllExpanded ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      <div className="space-y-4">
        {filtered.map((permission) => (
          <PermissionAccordion
            key={permission.feature}
            permission={permission}
            permissions={permissions}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
            readOnly={readOnly}
            showOnlyLabels={showOnlyLabels}
            isOpen={expandedFeatures.includes(permission.feature)}
            setOpen={(open) =>
              setExpandedFeatures((prev) =>
                open
                  ? [...prev, permission.feature]
                  : prev.filter((f) => f !== permission.feature)
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
