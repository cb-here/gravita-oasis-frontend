import React, { useState } from "react";
import {
  FaUser,
  FaCheckCircle,
  FaClipboardList,
  FaUsers,
  FaPauseCircle,
  FaQuestionCircle,
  FaEdit,
} from "react-icons/fa";
import { Modal } from "@/components/ui/modal";
import SearchableSelect from "@/components/form/SearchableSelect";

const mockHistory = [
  {
    type: "Creation",
    icon: <FaClipboardList className="text-brand-primary text-2xl" />,
    title: "Task created by Admin User",
    timestamp: "4/3/2025, 2:50:00 PM",
    reason: "Bulk upload from Excel sheet",
    avatars: [1, 2, 3, 4],
    tagColor: "bg-[#EEF1FF] text-brand-primary dark:bg-brand-primary-900/20 dark:text-brand-primary-300",
  },
  {
    type: "Assignment",
    icon: <FaUsers className="text-[#9747FF] text-2xl" />,
    title: 'Assigned to team "Amira Team" by Admin User',
    timestamp: "4/3/2025, 3:05:00 PM",
    prevState: "15m 0s",
    avatars: [1, 2, 3, 4],
    tagColor: "bg-[#EEF1FF] text-[#9747FF] dark:bg-[#9747FF]/10 dark:text-[#9747FF]",
  },
  {
    type: "Assignment",
    icon: <FaUsers className="text-[#9747FF] text-2xl" />,
    title: "Assigned to Pramod A by Manager User",
    timestamp: "4/3/2025, 2:50:00 PM",
    prevState: "15m 0s",
    avatars: [1, 2, 3, 4],
    tagColor: "bg-[#EEF1FF] text-[#9747FF] dark:bg-[#9747FF]/10 dark:text-[#9747FF]",
  },
  {
    type: "Content Update",
    icon: <FaEdit className="text-[#039855] text-2xl" />,
    title: "Coding section updated by Pramod A",
    timestamp: "4/3/2025, 2:50:00 PM",
    prevState: "15m 0s",
    viewChanges: true,
    avatars: [1, 2, 3, 4],
    tagColor: "bg-[#ECFDF3] text-[#039855] dark:bg-[#039855]/10 dark:text-[#039855]",
  },
  {
    type: "Content Update",
    icon: <FaEdit className="text-[#039855] text-2xl" />,
    title: "OASIS section updated by Coder A",
    timestamp: "4/3/2025, 2:50:00 PM",
    prevState: "15m 0s",
    viewChanges: true,
    avatars: [1, 2, 3, 4],
    tagColor: "bg-[#ECFDF3] text-[#039855] dark:bg-[#039855]/10 dark:text-[#039855]",
  },
  {
    type: "Put on Hold",
    icon: <FaPauseCircle className="text-[#EBB12D] text-2xl" />,
    title: "Task put on hold by Coder A",
    timestamp: "4/3/2025, 2:50:00 PM",
    reason: "Need clinical follow-up: Missing vital signs documentation",
    avatars: [1, 2, 3, 4],
    tagColor: "bg-[#FFFAEB] text-[#EBB12D] dark:bg-[#EBB12D]/10 dark:text-[#EBB12D]",
  },
];

const statusTags = [
  {
    label: "Creation",
    color: "bg-[#EEF1FF] text-brand-primary dark:bg-brand-primary-900/20 dark:text-brand-primary-300",
    icon: <FaClipboardList />,
  },
  {
    label: "Assignment",
    color: "bg-[#EEF1FF] text-[#9747FF] dark:bg-[#9747FF]/10 dark:text-[#9747FF]",
    icon: <FaUsers />,
  },
  {
    label: "Content Update",
    color: "bg-[#ECFDF3] text-[#039855] dark:bg-[#039855]/10 dark:text-[#039855]",
    icon: <FaEdit />,
  },
  {
    label: "Put on Hold",
    color: "bg-[#FFFAEB] text-[#EBB12D] dark:bg-[#EBB12D]/10 dark:text-[#EBB12D]",
    icon: <FaPauseCircle />,
  },
  {
    label: "Status Change",
    color: "bg-[#ECFDF3] text-[#039855] dark:bg-[#039855]/10 dark:text-[#039855]",
    icon: <FaCheckCircle />,
  },
  {
    label: "QA",
    color: "bg-[#EEF1FF] text-[#9747FF] dark:bg-[#9747FF]/10 dark:text-[#9747FF]",
    icon: <FaQuestionCircle />,
  },
  {
    label: "Completed",
    color: "bg-[#EEF1FF] text-brand-primary dark:bg-brand-primary-900/20 dark:text-brand-primary-300",
    icon: <FaCheckCircle />,
  },
  {
    label: "Put on Hold",
    color: "bg-[#FFFAEB] text-[#EBB12D] dark:bg-[#EBB12D]/10 dark:text-[#EBB12D]",
    icon: <FaPauseCircle />,
  },
  {
    label: "Status Change",
    color: "bg-[#ECFDF3] text-[#039855] dark:bg-[#039855]/10 dark:text-[#039855]",
    icon: <FaCheckCircle />,
  },
  {
    label: "QA",
    color: "bg-[#EEF1FF] text-[#9747FF] dark:bg-[#9747FF]/10 dark:text-[#9747FF]",
    icon: <FaQuestionCircle />,
  },
  {
    label: "Completed",
    color: "bg-[#EEF1FF] text-brand-primary dark:bg-brand-primary-900/20 dark:text-brand-primary-300",
    icon: <FaCheckCircle />,
  },
  {
    label: "Put on Hold",
    color: "bg-[#FFFAEB] text-[#EBB12D] dark:bg-[#EBB12D]/10 dark:text-[#EBB12D]",
    icon: <FaPauseCircle />,
  },
  {
    label: "Status Change",
    color: "bg-[#ECFDF3] text-[#039855] dark:bg-[#039855]/10 dark:text-[#039855]",
    icon: <FaCheckCircle />,
  },
  {
    label: "QA",
    color: "bg-[#EEF1FF] text-[#9747FF] dark:bg-[#9747FF]/10 dark:text-[#9747FF]",
    icon: <FaQuestionCircle />,
  },
  {
    label: "Completed",
    color: "bg-[#EEF1FF] text-brand-primary dark:bg-brand-primary-900/20 dark:text-brand-primary-300",
    icon: <FaCheckCircle />,
  },
  {
    label: "Put on Hold",
    color: "bg-[#FFFAEB] text-[#EBB12D] dark:bg-[#EBB12D]/10 dark:text-[#EBB12D]",
    icon: <FaPauseCircle />,
  },
  {
    label: "Status Change",
    color: "bg-[#ECFDF3] text-[#039855] dark:bg-[#039855]/10 dark:text-[#039855]",
    icon: <FaCheckCircle />,
  },
  {
    label: "QA",
    color: "bg-[#EEF1FF] text-[#9747FF] dark:bg-[#9747FF]/10 dark:text-[#9747FF]",
    icon: <FaQuestionCircle />,
  },
  {
    label: "Completed",
    color: "bg-[#EEF1FF] text-brand-primary dark:bg-brand-primary-900/20 dark:text-brand-primary-300",
    icon: <FaCheckCircle />,
  },
];

const historyTypes = [
  { value: "All Changes", label: "All Changes" },
  { value: "Creation", label: "Creation" },
  { value: "Assignment", label: "Assignment" },
  { value: "Content Update", label: "Content Update" },
  { value: "Put on Hold", label: "Put on Hold" },
  { value: "Status Change", label: "Status Change" },
  { value: "QA", label: "QA" },
  { value: "Completed", label: "Completed" },
];

const TaskHistoryTab: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  // const [historyType, setHistoryType] = useState(historyTypes[0] || "");
  const [selectedHistoryType, setSelectedHistoryType] = useState<string | null>(
    null
  );
  const [modalData, setModalData] = useState<any>(null);

  // Mock change data for modal
  const mockChange = {
    version: 4,
    changedBy: "Coder A",
    changedAt: "4/3/2025, 4:45:00 PM",
    section: "Coding Section",
    prevValue: "No previous value",
    newValue: '"/* Coding section data */"',
  };

  const handleViewChanges = () => {
    setModalData(mockChange);
    setModalOpen(true);
  };

  const handleHistoryTypeChange = (selectedOption: any) => {
    setSelectedHistoryType(selectedOption?.value || null);
    // console.log("Selected time:", selectedOption?.value);
  };

  return (
    <div className="p-2 min-h-full">
      {/* Header and Filter */}
      <div className="flex items-center justify-between mb-4 mt-[25px]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Task History</h2>
        <div className="min-w-[200px]">
          <SearchableSelect
            dataProps={{
              optionData: historyTypes.map((opt) => ({
                _id: opt.value,
                name: opt.label,
              })),
            }}
            selectionProps={{
              selectedValue: selectedHistoryType
                ? { value: selectedHistoryType }
                : null,
            }}
            displayProps={{
              placeholder: "Filter by Type",
              id: "history-type-filter",
            }}
            eventHandlers={{
              onChange: handleHistoryTypeChange,
            }}
          />
        </div>
      </div>
      {/* Status Tags */}
      <div className="flex gap-[8px] mb-6 overflow-x-auto custom1-scrollbar pb-2">
        {statusTags.map((tag, index) => (
          <span
            key={index}
            className={`flex flex-shrink-0 whitespace-nowrap items-center gap-1 px-[10px] py-[8px] rounded-[10px] text-xs ${tag.color}`}
          >
            <div className="text-sm">{tag.icon}</div>
            {tag.label}
          </span>
        ))}
      </div>
      {/* Timeline */}
      <div className="flex flex-col gap-4">
        {mockHistory.map((event, idx) => (
          <div className="flex gap-4 items-start w-full" key={idx}>
            <div
              className={`flex items-center justify-center ${event.tagColor} h-[54px] w-[54px] rounded-full text-2xl flex-shrink-0`}
            >
              {event.icon}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex gap-4 items-start w-full">
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2 w-full">
                  <span className="text-gray-900 dark:text-white text-[16px]">
                    {event.title}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 leading-[18px] font-medium mb-4">
                  <span>{event.timestamp}</span>
                  {event.prevState && (
                    <span className="bg-gray-100 dark:bg-gray-700 px-[10px] py-[4px] rounded-[6px] text-gray-500 dark:text-gray-400 text-xs">
                      Time in previous state: {event.prevState}
                    </span>
                  )}
                </div>
                {event.reason && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-[6px] px-[16px] py-[10px] text-sm text-gray-500 dark:text-gray-400 mb-1 w-full">
                    <span className="font-semibold">Reason:</span>{" "}
                    {event.reason}
                  </div>
                )}
                {event.viewChanges && (
                  <button
                    onClick={handleViewChanges}
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    View Changes{" "}
                    <FaCheckCircle className="inline text-indigo-400 dark:text-indigo-300" />
                  </button>
                )}
              </div>
              {/* Avatars */}
              <div className="flex -space-x-2 items-start">
                {event.avatars.map((a) => (
                  <span
                    key={a}
                    className="inline-block h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800"
                  >
                    <FaUser className="text-gray-400 dark:text-gray-500 h-5 w-5 m-1.5" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for View Changes */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-w-[600px]"
      >
        <div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 ">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{`Content Changes - Version ${modalData?.version}`}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{`Changed by ${modalData?.changedBy} on ${modalData?.changedAt}`}</p>
            <div className="font-semibold mb-2 text-gray-900 dark:text-white">{modalData?.section}</div>
            <div className="flex gap-4 flex-col">
              <div className="flex-1">
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">Previous Value</div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border border-red-100 dark:border-red-800/50">
                  {modalData?.prevValue}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">New Value</div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-gray-300 border border-green-100 dark:border-green-800/50">
                  {modalData?.newValue}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(TaskHistoryTab);