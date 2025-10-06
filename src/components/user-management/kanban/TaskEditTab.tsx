import React from "react";
import TaskEditSubTabs from "./TaskEditSubTabs";
import QAComponent from "./QAComponent";
import PreviewTab from "./PreviewTab";
import CodingTab from "./CodingTab";
import OasisTab from "./OasisTab";
import PocTab from "./PocTab";

interface TaskEditTabProps {
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
  readOnly?: boolean;
}

const TaskEditTab: React.FC<TaskEditTabProps> = ({
  activeSubTab,
  onSubTabChange,
  readOnly
}) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case "Coding":
        return <CodingTab readOnly={readOnly}/>;
      case "Oasis":
        return <OasisTab  readOnly={readOnly}/>;
      case "Poc":
        return <PocTab  readOnly={readOnly}/>;
      case "QA":
        return <QAComponent readOnly={readOnly} />;
      case "Preview":
        return <PreviewTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-[20px] text-gray-dark mt-[30px] mb-[14px] font-semibold">
        Edit Task
      </h1>
      <TaskEditSubTabs
        activeSubTab={activeSubTab}
        onSubTabChange={onSubTabChange}
        readOnly={readOnly}
      />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default React.memo(TaskEditTab);
