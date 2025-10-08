import React, { useState, useRef } from "react";
import ErrorDetailsModal from "./ErrorDetailsModal";
import AddErrorModal from "./AddErrorModal";
import { Modal } from "@/components/ui/modal";
import { Download } from "lucide-react";
import CommonTable from "@/components/common/CommonTable";
import { useModal } from "@/hooks/useModal";
import TextArea from "@/components/form/input/TextArea";
import Badge from "@/components/ui/badge/Badge";

// Interfaces for type safety
interface SampleError {
  errorNumber: number;
  category: string;
  description: string;
  location: string;
  attachmentName: string;
}

interface TableRow {
  category?: string;
  count: number | string;
  points: number | string;
  details?: boolean;
  description?: string;
  location?: string;
  attachment?: string;
  Section?: string;
  "Quality Score"?: string;
}

type TabType = "coding" | "oasis" | "poc" | "summary";

interface QAComponentProps {
  readOnly?: boolean;
}

const sampleErrors: SampleError[] = [
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

const codingTableData: TableRow[] = [
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

const oasisTableData: TableRow[] = [
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

const pocTableData: TableRow[] = [
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

const summaryTableData: TableRow[] = [
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

const QAComponent: React.FC<QAComponentProps> = ({ readOnly = false }) => {
  const [showAddErrorModal, setShowAddErrorModal] = useState(false);
  const [externalQA, setExternalQA] = useState(88);
  const [activeTab, setActiveTab] = useState<TabType>("coding");
  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const errorModal = useModal();

  const [errors, setErrors] = useState<any | null>(null);

  // Get current table data based on active tab
  const getCurrentTableData = (): TableRow[] => {
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

  // Get columns based on active tab
  const getColumns = (): any[] => {
    if (activeTab === "summary") {
      return [
        {
          label: "Section",
          render: (row: TableRow) => row.Section,
        },
        {
          label: "Count",
          render: (row: TableRow) => row.count,
        },
        {
          label: "Points",
          render: (row: TableRow) => row.points,
        },
        {
          label: "Quality Score",
          render: (row: TableRow) => (
            <Badge color="success" className="text-xs">
              {row["Quality Score"]}
            </Badge>
          ),
        },
      ];
    } else {
      return [
        {
          label: "Error Category",
          render: (row: TableRow) => row.category,
        },
        {
          label: "Count",
          render: (row: TableRow) => row.count,
        },
        {
          label: "Points",
          render: (row: TableRow) => row.points,
        },
        {
          label: "Reasons & Attachments",
          render: (row: TableRow) => {
            return (
              <div className="flex gap-2 items-center justify-center">
                {row.details && (
                  <button
                    className="text-brand-primary dark:text-brand-primary-300 text-xs font-medium hover:underline"
                    onClick={() => {
                      openErrorModal();
                    }}>
                    View Details
                  </button>
                )}
                {!readOnly && (
                  <button
                    className="text-green-600 dark:text-green-400 text-xs font-medium hover:underline"
                    onClick={() => setShowAddErrorModal(true)}>
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

  const startDrag = () => {
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
          className="max-w-[580px] p-6">
          <AddErrorModal
            onClose={() => setShowAddErrorModal(false)}
            onSave={() => {
              setShowAddErrorModal(false);
            }}
          />
        </Modal>
      )}
      {/* Quality Scoring Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700  p-[16px] mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="leading-[24px] text-[16px] text-gray-900 dark:text-white">
            Quality Scoring
          </span>
          <div className="flex gap-2">
            <button className="px-[12px] py-[6px] rounded-[8px] border border-green-500 text-green-600 dark:text-green-400 bg-white dark:bg-gray-700 text-sm flex items-center gap-1">
              Excel
              <Download
                style={{
                  height: "16px",
                  width: "16px",
                }}
              />
            </button>
            <button className="px-[12px] py-[6px] rounded-[8px] border border-red-500 text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 text-sm flex items-center gap-1">
              PDF
              <Download className="h-4 w-4 text-red-500 dark:text-red-400" />
            </button>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-brand-900/20 rounded-[10px] p-[16px] mb-[10px]">
          <div className="flex items-center w-full mb-3">
            <span className="text-brand-primary dark:text-brand-primary-300 font-medium text-sm">
              External QA
            </span>
            <div className="flex-1 flex items-center justify-end">
              <span className="text-gray-500 dark:text-gray-400 text-sm mr-[12px] font-[550]">
                Score (%):
              </span>
              <div
                ref={sliderRef}
                className="relative w-[300px] h-4 bg-white dark:bg-gray-700 rounded-full mr-4 cursor-pointer select-none"
                onMouseDown={startDrag}
                onTouchStart={startDrag}
                tabIndex={0}
                aria-valuenow={externalQA}
                aria-valuemin={0}
                aria-valuemax={100}
                role="slider"
                onKeyDown={handleKeyDown}
                style={{ outline: "none" }}>
                <div
                  className="h-4 bg-green-500 rounded-full absolute top-0 left-0"
                  style={{ width: `${externalQA}%` }}></div>
                <div
                  ref={handleRef}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `calc(${externalQA}% - 12px)` }}>
                  <div
                    className="w-6 h-6 bg-white dark:bg-gray-700 border-2 border-green-500 rounded-full shadow flex items-center justify-center cursor-pointer"
                    tabIndex={0}
                    aria-label={`External QA score: ${externalQA}%`}>
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
            <label className="block text-sm text-gray-900 dark:text-white mb-1">
              Comments
            </label>
            <TextArea
              className="w-full min-h-[83px] "
              placeholder="Enter external QA comment here..."
            />
          </div>
          <div className="flex justify-end">
            <button className="px-[16px] py-[10px] rounded-[10px] bg-brand-primary text-white text-sm  transition-colors hover:bg-brand-primary/90">
              Complete External QA
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl mb-[14px] p-[16px] border border-gray-200 dark:border-gray-700">
        <div className="mb-2">
          <div className="flex gap-2 mb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-[90px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => setActiveTab(tab.id)}>
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
        <div className="bg-blue-50 dark:bg-brand-900/20 rounded-[10px] p-[16px] mb-[10px] mt-[14px]">
          <div className="flex items-center w-full mb-3">
            <span className="text-gray-900 dark:text-white font-medium text-sm">
              Additional Comments:
            </span>
          </div>
          <div className="">
            <TextArea
              className="w-full min-h-[83px]"
              placeholder="Enter external QA comment here..."
            />
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
