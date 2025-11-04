import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import { AxiosError } from "axios";
import * as yup from "yup";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { FileUploadComponent } from "@/components/form/input/file-upload";

interface DocumentModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: string;
  setModelType: any;
  selectedDocument: any;
  setSelectedDocument: any;
}

interface FileUpload {
  id: string;
  file: File;
  preview?: string;
}

export default function DocumentModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  selectedDocument,
  setSelectedDocument,
}: DocumentModalProps) {
  const [errors, setErrors] = useState<any>({});
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const validationSchema = yup.object().shape({
    fileName: yup.string().required("File name is required"),
  });

  const validateForm = async (formData: any): Promise<boolean> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const [formData, setFormData] = useState({
    fileName: "",
    file: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modelType === "edit" && selectedDocument) {
      setFormData({
        fileName: selectedDocument.name || "",
        file: selectedDocument.file || "",
      });
      // Set file preview for edit mode
      if (selectedDocument.fileUrl || selectedDocument.preview) {
        setFilePreview(selectedDocument.fileUrl || selectedDocument.preview);
      }
    } else if (modelType === "read" && selectedDocument) {
      if (selectedDocument.fileUrl || selectedDocument.preview) {
        setFilePreview(selectedDocument.fileUrl || selectedDocument.preview);
      }
    } else {
      setFormData({
        fileName: "",
        file: "",
      });
      setFilePreview(null);
      setUploadedFiles([]);
    }
  }, [selectedDocument, modelType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFilesChange = (files: FileUpload[]) => {
    setUploadedFiles(files);

    if (files.length > 0) {
      const file = files[0].file;
      setFormData((prev) => ({
        ...prev,
        file: file.name,
      }));

      if (!formData.fileName) {
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setFormData((prev) => ({
          ...prev,
          fileName: fileNameWithoutExt,
        }));
      }

      // Set preview for images
      if (file.type.startsWith("image/") && files[0].preview) {
        setFilePreview(files[0].preview);
      } else if (file.type === "application/pdf") {
        // For PDFs, we can create a blob URL for preview
        const pdfUrl = URL.createObjectURL(file);
        setFilePreview(pdfUrl);
      }
    } else {
      setFormData((prev) => ({ ...prev, file: "" }));
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modelType === "read") {
      handleClose();
      return;
    }

    // Validate file upload for create mode
    if (modelType === "upload" && uploadedFiles.length === 0) {
      showToast("error", "File Required", "Please select a file to upload");
      return;
    }

    const isValid = await validateForm(formData);
    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      // Prepare form data for submission
      const submitData = {   
        fileName: formData.fileName,
        file: uploadedFiles.length > 0 ? uploadedFiles[0].file : null,
        // Include existing file for edit mode if no new file selected
        existingFile:
          modelType === "edit" && uploadedFiles.length === 0
            ? selectedDocument.file
            : null,
      };

      console.log("Submitting data:", submitData);

      // Your API call would go here
      // await api.submitDocument(submitData);

      showToast(
        "success",
        "Success",
        `Document ${modelType === "edit" ? "updated" : "uploaded"} successfully`
      );

      handleClose();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      showToast(
        "error",
        errData?.title || "Error",
        errData?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        fileName: "",
        file: "",
      });
      setErrors({});
      setUploadedFiles([]);
      setFilePreview(null);
      setModelType("");
      setSelectedDocument(null);
      setLoading(false);
      closeModal();
    }
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "upload":
        return "Upload New Document";
      case "edit":
        return "Update Document";
      case "delete":
        return "Delete Document";
      case "read":
        return "View Document";
      default:
        return "";
    }
  };

  const getModalDescription = () => {
    switch (modelType) {
      case "upload":
        return "Add and upload a new document to the system.";
      case "edit":
        return "Modify or replace the existing document information.";
      case "delete":
        return "This action cannot be undone. It will permanently remove this document.";
      case "read":
        return "Preview and review the document details without making changes.";
      default:
        return "";
    }
  };

  const isImageFile = (fileName: string) => {
    return /\.(jpg|jpeg|jfif|png|gif|bmp|webp|svg)$/i.test(fileName);
  };

  const isPdfFile = (fileName: string) => {
    return /\.pdf$/i.test(fileName);
  };

  const renderFilePreview = () => {
    if (!filePreview) return null;

    const fileName =
      selectedDocument?.fileName || selectedDocument?.name || formData.fileName;

    if (isImageFile(filePreview) || (fileName && isImageFile(fileName))) {
      return (
        <div className="mt-4">
          <Label>Preview</Label>
          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <img
              src={filePreview}
              alt="Document preview"
              className="max-w-full max-h-96 mx-auto object-contain"
            />
          </div>
        </div>
      );
    } else if (isPdfFile(filePreview) || (fileName && isPdfFile(fileName))) {
      return (
        <div className="mt-4">
          <Label>Preview</Label>
          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-96">
            <iframe
              src={filePreview}
              className="w-full h-full border-0"
              title="PDF preview"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-4">
          <Label>File Information</Label>
          <div className="mt-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              File: {formData.file || fileName || "No file selected"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Preview not available for this file type
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType === "read"
          ? "max-w-[900px]"
          : modelType !== "delete"
          ? "max-w-[800px]"
          : "max-w-[600px]"
      } p-5 lg:p-10 m-4`}
    >
      <div className="space-y-6">
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {getModalTitle()}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {getModalDescription()}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {modelType === "read" ? (
            <div className="space-y-6">
              <div>
                <Label>File Name</Label>
                <Input
                  type="text"
                  name="fileName"
                  value={
                    selectedDocument?.fileName ||
                    selectedDocument?.name ||
                    formData.fileName
                  }
                  className="w-full"
                  readOnly
                />
              </div>
              {renderFilePreview()}
            </div>
          ) : modelType !== "delete" ? (
            // Upload/Edit Mode
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label required>File Name</Label>
                <Input
                  type="text"
                  name="fileName"
                  placeholder="File Name"
                  value={formData.fileName}
                  onChange={handleInputChange}
                  className="w-full"
                  error={!!errors.fileName}
                  errorMessage={errors.fileName}
                />
              </div>
              <div>
                <Label required={modelType === "upload"}>Upload Document</Label>
                <FileUploadComponent
                  onFilesChange={handleFilesChange}
                  maxFiles={1}
                  maxSizeMB={10}
                />
                {modelType === "edit" && uploadedFiles.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Leave empty to keep the current file
                  </p>
                )}
              </div>
              {(filePreview || uploadedFiles.length > 0) && (
                <div>{renderFilePreview()}</div>
              )}
            </div>
          ) : (
            // Delete Mode
            <div>
              {selectedDocument && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-300">
                        {selectedDocument?.fileName ||
                          selectedDocument?.name ||
                          "Untitled Document"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              type="button"
              disabled={loading}
            >
              {modelType === "read" ? "Close" : "Cancel"}
            </Button>
            {modelType !== "read" && (
              <Button
                type="submit"
                className="px-6 py-2 min-w-[175px]"
                disabled={loading}
              >
                {loading ? (
                  <Loading size={1} style={2} />
                ) : (
                  `${
                    modelType === "delete"
                      ? "Delete"
                      : modelType === "edit"
                      ? "Update"
                      : "Upload"
                  } Document`
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}
