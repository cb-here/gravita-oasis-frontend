import React, { FC, useState, useEffect } from "react";

interface FileInputProps {
  error?: boolean;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  previewImageUrl?: string;
}

const FileUploader: FC<FileInputProps> = ({
  className,
  onChange,
  accept,
  previewImageUrl,
  error,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (previewImageUrl) {
      setPreviewUrl(previewImageUrl);
    }
  }, [previewImageUrl]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    onChange?.(event);
  };

  return (
    <>
      <input
        type="file"
        accept={accept}
        className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg 
    border ${
      error
        ? "border border-red-500 dark:border-red-500"
        : "border border-gray-300 dark:border-gray-700"
    } 
    bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors 
    file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg 
    file:border-0 file:border-r file:border-solid file:border-gray-200 
    file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 
    placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden 
    focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 
    dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] 
    dark:file:text-gray-400 dark:placeholder:text-gray-400 ${className}`}
        onChange={handleChange}
      />
      {previewUrl && (
        <div className="relative mt-2 max-h-20 inline-block">
          <img
            src={previewUrl}
            alt="Logo Preview"
            className="h-20 w-auto rounded border border-gray-300 object-contain"
          />
        </div>
      )}
    </>
  );
};

export default FileUploader;
