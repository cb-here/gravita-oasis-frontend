"use client";

import React from "react";
import Image from "next/image";

interface Attachment {
  id: string | number;
  name: string;
  type: string;
  icon: string;
  actionLabel?: string;
}

interface AttachmentsProps {
  title?: string;
  attachments: Attachment[];
  onUpload?: (files: FileList) => void;
  onRemove?: (id: string | number) => void;
  allowedTypes?: "image" | "pdf" | "doc" | "media" | "custom";
  customAccept?: string; // for custom file extensions
}

export default function Attachments({
  title = "Attachments",
  attachments,
  onUpload,
  onRemove,
  allowedTypes = "custom",
  customAccept,
}: AttachmentsProps) {
  // Define accepted file formats
  const getAcceptType = () => {
    switch (allowedTypes) {
      case "image":
        return "image/png,image/jpeg,image/jpg,image/webp,image/gif";
      case "pdf":
        return "application/pdf";
      case "doc":
        return ".doc,.docx,.txt,.rtf,.odt";
      case "media":
        return "video/*,audio/*";
      case "custom":
        return customAccept || "*/*";
      default:
        return "*/*";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onUpload) {
      onUpload(e.target.files);
      e.target.value = ""; // reset input for next upload
    }
  };

  return (
    <div className="relative p-3 mt-6 border border-gray-200 rounded-xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:p-5">
      {/* Upload Input */}
      <input
        type="file"
        id="upload-file"
        className="sr-only"
        multiple
        accept={getAcceptType()}
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-lg font-medium text-gray-800 dark:text-white/90">
          {title}
        </span>
        <span className="block w-px h-4 bg-gray-200 dark:bg-gray-800"></span>
        <label
          htmlFor="upload-file"
          className="text-sm font-medium text-brand-500 cursor-pointer">
          Upload file
        </label>
      </div>

      {/* Attachment List */}
      <div className="flex flex-col items-center gap-3 sm:flex-row flex-wrap">
        {attachments.map((file) => (
          <div
            key={file.id}
            className="group relative flex w-full sm:w-auto cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-5 dark:border-gray-800 dark:bg-white/5">
            {/* Remove Button */}
            {onRemove && (
              <span
                onClick={() => onRemove(file.id)}
                className="absolute flex items-center justify-center w-5 h-5 text-gray-400 bg-white border border-gray-200 rounded-full opacity-0 -right-2 -top-2 group-hover:opacity-100 dark:border-gray-800 dark:bg-gray-900">
                <svg
                  className="fill-current"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.021 8.27a.5.5 0 0 0 .707.707L6 6.707l2.27 2.27a.5.5 0 0 0 .707-.707L6.707 6l2.27-2.27a.5.5 0 0 0-.707-.707L6 5.293 3.73 3.02a.5.5 0 0 0-.707.707L5.293 6 3.02 8.27Z"
                  />
                </svg>
              </span>
            )}

            <div className="w-full h-10 max-w-10">
              <Image width={40} height={40} src={file.icon} alt={file.type} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {file.name}
              </p>
              <span className="flex items-center gap-1.5 text-gray-500 text-theme-xs dark:text-gray-400">
                <span>{file.type}</span>
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{file.actionLabel || "Download"}</span>
              </span>
            </div>
          </div>
        ))}

        {/* Add Button */}
        <label
          htmlFor="upload-file"
          className="flex h-[60px] w-full sm:w-[60px] cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 dark:border-gray-800 dark:bg-white/5 dark:text-gray-400">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.25 6a.75.75 0 0 1 1.5 0v5.25H18a.75.75 0 0 1 0 1.5h-5.25V18a.75.75 0 0 1-1.5 0v-5.25H6a.75.75 0 0 1 0-1.5h5.25V6Z"
            />
          </svg>
        </label>
      </div>
    </div>
  );
}
