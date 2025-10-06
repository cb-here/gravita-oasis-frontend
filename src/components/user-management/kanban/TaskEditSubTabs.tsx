import React from "react";
import { TabButton } from "../../ui/tabs/TabWithUnderline";

interface TaskEditSubTabsProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
  readOnly?: boolean;
}

const subTabs = ["Coding", "Oasis", "Poc", "QA", "Preview"];

const TaskEditSubTabs: React.FC<TaskEditSubTabsProps> = ({
  activeSubTab,
  onSubTabChange,
}) => (
  <div className="w-full rounded-lg py-[10px] mb-4 mt-2">
    <div className="">
      <nav className="-mb-px flex space-x-2 overflow-x-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5">
        {subTabs.map((tab) => (
          <TabButton
            key={tab}
            id={tab}
            label={tab}
            isActive={activeSubTab === tab}
            onClick={() => onSubTabChange(tab)}
          />
        ))}
      </nav>
    </div>
  </div>
);

export default React.memo(TaskEditSubTabs);
