import { useState, useRef } from "react";
import { Paperclip, X, File, Image, FileText } from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";
import Button from "@/components/ui/button/Button";
import { showToast } from "@/lib/toast";
import Badge from "@/components/ui/badge/Badge";

interface FileUpload {
  id: string;
  file: File;
  preview?: string;
}

interface FileUploadProps {
  onFilesChange: (files: FileUpload[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

interface SimpleFileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
}

export function FileUpload({
  onFilesSelected,
  // maxFiles = 5,
  className,
}: SimpleFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFilesSelected(files);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="gap-2">
        <Paperclip className="h-4 w-4" />
        Attach Files
      </Button>
    </div>
  );
}

export const FileUploadComponent = forwardRef(function FileUploadComponent(
  { onFilesChange, maxFiles = 5, maxSizeMB = 10 }: FileUploadProps,
  ref
) {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    clearFiles: () => {
      setUploads([]);
      onFilesChange([]);
    },
  }));

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return Image;
    if (file.type.includes("pdf") || file.type.includes("document"))
      return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (uploads.length + files.length > maxFiles) {
      showToast(
        "warning",
        "Too many files",
        `Maximum ${maxFiles} files allowed`
      );
      return;
    }

    const newUploads: FileUpload[] = [];

    files.forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        showToast(
          "warning",
          "File too large",
          `${file.name} exceeds ${maxSizeMB}MB limit`
        );
        return;
      }

      const upload: FileUpload = {
        id: `${Date.now()}-${file.name}`,
        file,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          upload.preview = e.target?.result as string;
          setUploads((prev) =>
            prev.map((u) => (u.id === upload.id ? upload : u))
          );
        };
        reader.readAsDataURL(file);
      }

      newUploads.push(upload);
    });

    const updatedUploads = [...uploads, ...newUploads];
    setUploads(updatedUploads);
    onFilesChange(updatedUploads);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    const updatedUploads = uploads.filter((upload) => upload.id !== id);
    setUploads(updatedUploads);
    onFilesChange(updatedUploads);
  };

  return (
    <div className="space-y-4">
     
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="gap-2">
          <Paperclip className="h-4 w-4" />
          Attach Files
        </Button>
        <div className="text-xs text-gray-600 dark:text-white/70 flex items-center">
          Max {maxFiles} files, {maxSizeMB}MB each
        </div>
      </div>

      {/* File List */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload) => {
            const FileIcon = getFileIcon(upload.file);
            return (
              <div
                key={upload.id}
                className="p-3 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {upload.preview ? (
                      <img
                        src={upload.preview}
                        alt="Preview"
                        className="w-10 h-10 object-cover rounded border border-gray-300 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <FileIcon className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {upload.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs">
                          {formatFileSize(upload.file.size)}
                        </p>
                        <Badge
                          variant="light"
                          className="text-xs text-gray-600 dark:text-white/70 border-gray-300 dark:border-gray-600">
                          {upload.file.type.split("/")[1]?.toUpperCase() ||
                            "FILE"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile(upload.id)}
                    className="shrink-0 hover:text-error-500">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
