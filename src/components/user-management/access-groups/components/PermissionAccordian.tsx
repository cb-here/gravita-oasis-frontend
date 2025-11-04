import React from "react";
import { ChevronDown, ChevronRight, Check, X } from "lucide-react";
import { isReadDisabledByDependency, toggleActionById, toggleFeatureActions } from "./permission-utils";
import Checkbox from "@/components/form/input/Checkbox";


interface Action {
  _id: string;
  action: string;
  readOnly?: boolean;
}
interface Permission {
  feature: string;
  actions: Action[];
  isAllowed?: boolean;
}

interface Props {
  permission: Permission;
  permissions: Permission[];
  selectedPermissions: string[];
  setSelectedPermissions: (ids: string[]) => void;
  readOnly?: boolean;
  showOnlyLabels?: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export default function PermissionAccordion({
  permission,
  permissions,
  selectedPermissions,
  setSelectedPermissions,
  readOnly = false,
  showOnlyLabels = false,
  isOpen,
  setOpen,
}: Props) {
  const allChecked = permission.actions.every((a) =>
    selectedPermissions?.includes(a._id)
  );
  const someChecked =
    permission.actions.some((a) => selectedPermissions?.includes(a._id)) &&
    !allChecked;

  const toggleFeature = () => {
    const updated = toggleFeatureActions({
      permission,
      selectedPermissions,
      permissions,
    });
    setSelectedPermissions(updated);
  };

  const toggleAction = (actionId: string) => {
    const updated = toggleActionById({
      actionId,
      permission,
      selectedPermissions,
      permissions,
    });
    setSelectedPermissions(updated);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer bg-gray-100 dark:bg-gray-900"
        onClick={() => setOpen(!isOpen)}
      >
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {!readOnly && (
            <Checkbox
              id={`feature-${permission.feature}`}
              checked={allChecked}
              indeterminate={someChecked}
              onChange={toggleFeature}
              disabled={readOnly || permission.isAllowed === false}
            />
          )}
          <label
            htmlFor={`feature-${permission.feature}`}
            className="font-medium cursor-pointer text-gray-700 dark:text-gray-400"
          >
            {permission.feature}
          </label>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {permission.actions.map((action) => {
            const isChecked = selectedPermissions?.includes(action._id);
            const isRead = action.action === "READ";
            const isDisabled =
              readOnly ||
              action.readOnly ||
              permission.isAllowed === false ||
              (isRead &&
                isReadDisabledByDependency(
                  permission.feature,
                  selectedPermissions,
                  permissions
                ));

            return (
              <div key={action._id} className="flex items-center gap-2">
                {showOnlyLabels ? null : isDisabled ? (
                  isChecked ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )
                ) : (
                  <Checkbox
                    id={`action-${action._id}`}
                    checked={isChecked}
                    onChange={() => toggleAction(action._id)}
                    disabled={isDisabled}
                  />
                )}
                <label
                  htmlFor={`action-${action._id}`}
                  className="text-sm cursor-pointer text-gray-700 dark:text-gray-400"
                >
                  {action.action}
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
