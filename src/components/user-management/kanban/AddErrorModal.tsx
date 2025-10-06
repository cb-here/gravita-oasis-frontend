import React, { useState } from "react";
import TextArea from "@/components/form/input/TextArea";
import Input from "@/components/form/input/InputField";
import SearchableSelect from "@/components/form/SearchableSelect";
import ReusableDropzone from "@/components/common/ReusableDropzone";
import Button from "@/components/ui/button/Button";

interface AddErrorModalProps {
  // categories: string[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const categories = [
  { value: "All Changes", label: "All Changes" },
  { value: "Creation", label: "Creation" },
  { value: "Assignment", label: "Assignment" },
  { value: "Content Update", label: "Content Update" },
  { value: "Put on Hold", label: "Put on Hold" },
  { value: "Status Change", label: "Status Change" },
  { value: "QA", label: "QA" },
  { value: "Completed", label: "Completed" },
];

const AddErrorModal: React.FC<AddErrorModalProps> = ({ onClose, onSave }) => {
  // const [category, setCategory] = useState(categories[0] || "");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full max-w-[580px] p-4">
      <div className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-4">
        Add Error Details
      </div>
      {/* Error Category */}
      <div className="grid grid-cols-2 gap-5">
        <div className="mb-2 col-span-2">
          <div className="text-[16px] text-gray-light  mb-2">
            Error Category
          </div>

          <SearchableSelect
            dataProps={{
              optionData: categories.map((opt) => ({
                _id: opt.value,
                name: opt.label,
              })),
            }}
            selectionProps={{}}
            displayProps={{
              placeholder: "Select Option",
              id: "",
            }}
            eventHandlers={{}}
          />
        </div>
        {/* Description */}
        <div className="col-span-2">
          <div className="text-[16px] text-gray-light  mb-2">Description</div>

          <TextArea
            placeholder="Description the error in details"
            value={description}
            onChange={(value) => setDescription(value)}
          />
        </div>
        {/* Location Reference */}
        <div className="mb-4 col-span-2">
          <div className="text-[16px] text-gray-light  mb-2">
            Location Reference
          </div>
          <Input
            className="w-full bg-[#F2F4F7] rounded-[10px] px-3 py-[10px] text-[16px] text-gray-light font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Specify where in the document"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        {/* Dropzone */}
        <div className="mb-6 col-span-2">
          <ReusableDropzone
            width="100%"
            height={180}
            accept={{
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
              "application/vnd.ms-excel": [".xls"],
              "text/csv": [".csv"],
            }}
            onFileUpload={(files) => setFiles(files)}
          />
          {/* Show selected files with icon */}
          {files.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-2 text-xs text-gray-700"
                >
                  {/* Use inline SVG for file icon */}
                  <svg
                    className="text-brand-primary w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v16H4z" stroke="currentColor" />
                    <path d="M8 4v16" stroke="currentColor" />
                    <path d="M16 4v16" stroke="currentColor" />
                  </svg>
                  <span className="truncate max-w-[180px]">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          className="flex-1 font-medium  rounded-[10px] px-3 py-[10px] text-[14px] bg-[#EAECF0] text-gray-700  hover:bg-gray-200"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="flex-1  font-medium  rounded-[10px] px-3 py-[10px] text-[14px] bg-brand-primary text-white "
          onClick={() => onSave({ description, location, files })}
        >
          Save Error
        </Button>
      </div>
    </div>
  );
};

export default AddErrorModal;
