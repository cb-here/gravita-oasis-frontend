import React, { useState, useRef } from "react";
import ErrorDetailsModal from "./ErrorDetailsModal";
import AddErrorModal from "./AddErrorModal";
import { Modal } from "@/components/ui/modal";
import { Download, DownloadCloud } from "lucide-react";
import CommonTable from "@/components/common/CommonTable";
import { useModal } from "@/hooks/useModal";

// Different table data for each tab

const sampleErrors = [
  {
    errorNumber: 1,
    category: "DX Missing (4 points)",
    description: "Missing wound measurement",
    location: "Wound Assessment Form",
    attachmentName: "/images/cards/card-01.png",
  },
  {
    errorNumber: 2,
    category: "Convention Error (8 points)",
    description: "Some convention error",
    location: "Convention Sheet",
    attachmentName: "convention.pdf",
  },
  {
    errorNumber: 3,
    category: "OASIS Assessment Error (6 points)",
    description: "Incomplete assessment data",
    location: "OASIS Form",
    attachmentName: "oasis_form.pdf",
  },
  {
    errorNumber: 4,
    category: "Timing Issue (4 points)",
    description: "Assessment not completed within timeframe",
    location: "Schedule Record",
    attachmentName: "schedule.png",
  },
  {
    errorNumber: 5,
    category: "Medication Error (8 points)",
    description: "Incorrect dosage documented",
    location: "Medication Record",
    attachmentName: "med_record.pdf",
  },
  {
    errorNumber: 6,
    category: "Treatment Omission (6 points)",
    description: "Required treatment not documented",
    location: "Treatment Log",
    attachmentName: "treatment_log.png",
  },
];

const codingTableData = [
  {
    category: "DX Missing",
    count: 1,
    points: 4,
    details: true,
    description: "Missing wound measurement",
    location: "Wound Assessment Form",
    attachment: "wound_form.png",
  },
  {
    category: "Convention Error",
    count: 1,
    points: 8,
    details: true,
    description: "Some convention error",
    location: "Convention Sheet",
    attachment: "convention.pdf",
  },
  { category: "Failure to Query", count: 0, points: 0, details: false },
  { category: "Gender Discrepancy", count: 0, points: 0, details: false },
  { category: "Process Error", count: 0, points: 0, details: false },
];

const oasisTableData = [
  {
    category: "OASIS Assessment Error",
    count: 2,
    points: 6,
    details: true,
    description: "Incomplete assessment data",
    location: "OASIS Form",
    attachment: "oasis_form.pdf",
  },
  {
    category: "Timing Issue",
    count: 1,
    points: 4,
    details: true,
    description: "Assessment not completed within timeframe",
    location: "Schedule Record",
    attachment: "schedule.png",
  },
  { category: "Documentation Gap", count: 0, points: 0, details: false },
  { category: "Compliance Issue", count: 0, points: 0, details: false },
];

const pocTableData = [
  {
    category: "Medication Error",
    count: 1,
    points: 8,
    details: true,
    description: "Incorrect dosage documented",
    location: "Medication Record",
    attachment: "med_record.pdf",
  },
  {
    category: "Treatment Omission",
    count: 1,
    points: 6,
    details: true,
    description: "Required treatment not documented",
    location: "Treatment Log",
    attachment: "treatment_log.png",
  },
  { category: "Vital Signs Missing", count: 0, points: 0, details: false },
  { category: "Care Plan Issue", count: 0, points: 0, details: false },
];

const summaryTableData = [
  {
    Section: "Coding",
    count: 3,
    points: 18,
    "Quality Score": "88%",
  },
  {
    Section: "OSIS",
    count: 1,
    points: 4,
    "Quality Score": "88%",
  },
  {
    Section: "POC",
    count: 0,
    points: 0,
    "Quality Score": "94%",
  },
  {
    Section: "Overall",
    count: 4,
    points: 22,
    "Quality Score": "88%",
  },
  {
    Section: "Total",
    count: "-",
    points: "-",
    "Quality Score": "100%",
  },
];

// Tab type definition
type TabType = "coding" | "oasis" | "poc" | "summary";

interface QAComponentProps {
  readOnly?: boolean;
}

const QAComponent: React.FC<QAComponentProps> = ({ readOnly = false }) => {
  const [showAddErrorModal, setShowAddErrorModal] = useState(false);
  const [externalQA, setExternalQA] = useState(88); 
  const [activeTab, setActiveTab] = useState<TabType>("coding");
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const errorModal = useModal();

  const [errors, setErrors] = useState<any>(null);

  // Get current table data based on active tab
  const getCurrentTableData = () => {
    switch (activeTab) {
      case "coding":
        return codingTableData;
      case "oasis":
        return oasisTableData;
      case "poc":
        return pocTableData;
      case "summary":
        return summaryTableData;
      default:
        return codingTableData;
    }
  };

  // // Get error categories for AddErrorModal based on active tab
  // const getErrorCategories = () => {
  //   const currentData = getCurrentTableData();
  //   return currentData
  //     .filter((e) => e.details)
  //     .map((e) => `${e.category} (${e.points}point)`);
  // };

  // Get columns based on active tab
  const getColumns = (): any[] => {
    if (activeTab === "summary") {
      return [
        {
          label: "Section",
          render: (row: any) => row.Section,
        },
        {
          label: "Count",
          render: (row: any) => row.count,
        },
        {
          label: "Points",
          render: (row: any) => row.points,
        },
        {
          label: "Quality Score",
          render: (row: any) => (
            <span className="bg-[#C7F5DA] text-[#039855] text-xs font-medium px-[10px] py-[2px] rounded-[6px]">
              {row["Quality Score"]}
            </span>
          ),
        },
      ];
    } else {
      return [
        {
          label: "Error Category",
          render: (row: any) => row.category,
        },
        {
          label: "Count",
          render: (row: any) => row.count,
        },
        {
          label: "Points",
          render: (row: any) => row.points,
        },
        {
          label: "Reasons & Attachments",
          render: (row: any) => {
            const currentData = getCurrentTableData();
            const idx = currentData.findIndex((r) => r === row);
            return (
              <div className="flex gap-2 items-center justify-center">
                {row.details && (
                  <button
                    className="text-brand-primary text-xs font-medium hover:underline"
                    onClick={() => {
                      openErrorModal();
                    }}
                  >
                    View Details
                  </button>
                )}
                {!readOnly && (
                  <button
                    className="text-green-600 text-xs font-medium hover:underline"
                    onClick={() => setShowAddErrorModal(true)}
                  >
                    +Add Error
                  </button>
                )}
              </div>
            );
          },
        },
      ];
    }
  };

  // Mouse/touch drag logic
  const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let clientX = 0;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setExternalQA(Math.round(percent));
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onDrag as any);
    window.addEventListener("touchmove", onDrag as any);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
  };

  const stopDrag = () => {
    dragging.current = false;
    document.body.style.userSelect = "";
    window.removeEventListener("mousemove", onDrag as any);
    window.removeEventListener("touchmove", onDrag as any);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("touchend", stopDrag);
  };

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      setExternalQA((v) => Math.max(0, v - 1));
      e.preventDefault();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      setExternalQA((v) => Math.min(100, v + 1));
      e.preventDefault();
    }
  };

  // Tab configuration
  const tabs = [
    { id: "coding" as TabType, label: "Coding" },
    { id: "oasis" as TabType, label: "Oasis" },
    { id: "poc" as TabType, label: "Poc" },
    { id: "summary" as TabType, label: "Summary" },
  ];

  const openErrorModal = () => {
    setErrors(sampleErrors);
    errorModal.openModal();
  };

  return (
    <div className="w-full">
      {/* Add Error Modal */}
      {showAddErrorModal && (
        <Modal
          isOpen={showAddErrorModal}
          onClose={() => setShowAddErrorModal(false)}
          className="max-w-[580px] p-6"
        >
          <AddErrorModal
            onClose={() => setShowAddErrorModal(false)}
            onSave={() => {
              setShowAddErrorModal(false);
            }}
          />
        </Modal>
      )}
      {/* Quality Scoring Section */}
      <div className="bg-white rounded-xl border border-gray-200 mx-[16px] p-[16px] mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="leading-[24px] text-[16px] text-gray-dark">
            Quality Scoring
          </span>
          <div className="flex gap-2">
            <button className="px-[12px] py-[6px] rounded-[8px] border border-green-500 text-[#039855] bg-white text-sm flex items-center gap-1">
              Excel
              <Download
                style={{
                  height: "16px",
                  width: "16px",
                }}
              />
            </button>
            <button className="px-[12px] py-[6px] rounded-[8px] border border-red-500 text-[#D92D20] bg-white text-sm flex items-center gap-1">
              PDF
              <DownloadCloud className="h-4 w-4 text-error-500" />
            </button>
          </div>
        </div>
        <div className="bg-[#EEF1FF] rounded-[10px] p-[16px] mb-[10px]">
          <div className="flex items-center w-full mb-3">
            <span className="text-brand-primary font-medium text-sm">
              External QA
            </span>
            <div className="flex-1 flex items-center justify-end">
              <span className="text-gray-light text-sm mr-[12px] font-[550]">
                Score (%):
              </span>
              <div
                ref={sliderRef}
                className="relative w-[300px] h-4 bg-white rounded-full mr-4 cursor-pointer select-none"
                onMouseDown={startDrag}
                onTouchStart={startDrag}
                tabIndex={0}
                aria-valuenow={externalQA}
                aria-valuemin={0}
                aria-valuemax={100}
                role="slider"
                onKeyDown={handleKeyDown}
                style={{ outline: "none" }}
              >
                <div
                  className="h-4 bg-[#039855] rounded-full absolute top-0 left-0"
                  style={{ width: `${externalQA}%` }}
                ></div>
                <div
                  ref={handleRef}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `calc(${externalQA}% - 12px)` }}
                >
                  <div
                    className="w-6 h-6 bg-white border-2 border-green-500 rounded-full shadow flex items-center justify-center cursor-pointer"
                    tabIndex={0}
                    aria-label={`External QA score: ${externalQA}%`}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-brand-primary text-white px-[12px] py-[4px] rounded-[8px] text-sm font-bold ml-2 min-w-[48px] text-center">
                {externalQA}%
              </div>
            </div>
          </div>
          <div className="mb-[16px]">
            <label className="block text-sm text-gray-dark mb-1">
              Comments
            </label>
            <textarea
              className="w-full min-h-[83px] border border-[#EAECF0] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              placeholder="Enter external QA comment here..."
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button className="px-[16px] py-[10px] rounded-[10px] bg-brand-primary text-white text-sm  transition-colors">
              Complete External QA
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl mb-[14px] p-[16px]">
        <div className="mb-2">
          <div className="flex gap-2 mb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-[90px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-primary text-white"
                    : "bg-[#EAECF0] text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <CommonTable
          headers={getColumns()}
          data={getCurrentTableData()}
          className="mb-2"
        />
        <div className="bg-[#EEF1FF] rounded-[10px] p-[16px] mb-[10px] mt-[14p]">
          <div className="flex items-center w-full mb-3">
            <span className="text-gray-dark font-medium text-sm">
              Additional Comments:
            </span>
          </div>
          <div className="">
            <textarea
              className="w-full min-h-[83px] border border-[#EAECF0] rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              placeholder="Enter external QA comment here..."
            ></textarea>
          </div>
        </div>
      </div>
      <ErrorDetailsModal
        isOpen={errorModal.isOpen}
        closeModal={errorModal.closeModal}
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  );
};

export default QAComponent;
