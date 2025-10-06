import React from "react";
import { TabButton } from "../../ui/tabs/TabWithUnderline";

interface TaskModalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["Details", "Edit", "History", "Tasks"];

const TaskModalTabs: React.FC<TaskModalTabsProps> = ({
  activeTab,
  onTabChange,
}) => (
  <div>
    <nav className="-mb-px flex space-x-2 overflow-x-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 dark:[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-1.5">
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          id={tab}
          label={tab}
          isActive={activeTab === tab}
          onClick={() => onTabChange(tab)}
        />
      ))}
    </nav>
  </div>
);

export default React.memo(TaskModalTabs);
