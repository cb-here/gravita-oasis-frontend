import React, { useCallback, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";

interface ReusableDropzoneProps {
  width?: string | number;
  height?: string | number;
  onFileUpload: (files: File[]) => void;
  accept?: Accept;
}

const defaultAccept: Accept = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
  "application/vnd.ms-excel": [],
  "text/csv": [],
};

const ReusableDropzone: React.FC<ReusableDropzoneProps> = ({
  width = "100%",
  height = 180,
  onFileUpload,
  accept = defaultAccept,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setSelectedFiles(acceptedFiles);
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div
      {...getRootProps()}
      style={{ width, height }}
      className={`border-2 border-dashed border-brand-primary rounded-[10px] bg-[#fffff] flex flex-col items-center justify-center cursor-pointer transition-colors ${
        isDragActive ? "bg-blue-50 border-blue-500" : ""
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <div className="mb-2">
          {/* Upload Icon */}
          <i className="fa-solid fa-cloud-arrow-up text-brand-primary text-2xl"></i>
        </div>
        <div className="font-semibold text-gray-700 text-base mb-1">
          Drop your file here or click to upload
        </div>
        <div className="text-xs text-gray-500 mb-1">
          Supports Excel (.xlsx) and CSV files
        </div>
        <span className="text-brand-primary hover:underline text-sm cursor-pointer">Choose file</span>
        {/* Show selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-2 text-xs text-gray-700">
            {selectedFiles.map((file) => (
              <div key={file.name} className="truncate max-w-[200px]">{file.name}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReusableDropzone; 