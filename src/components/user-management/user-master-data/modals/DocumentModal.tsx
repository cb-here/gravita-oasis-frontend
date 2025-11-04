"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Loading from "@/components/Loading";
import { showToast } from "@/lib/toast";
import { AxiosError } from "axios";
import * as yup from "yup";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Switch from "@/components/form/switch/Switch";

interface DocumentModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: "upload" | "edit" | "delete" | "read";
  setModelType: React.Dispatch<React.SetStateAction<string>>;
  selectedDocument: any;
  setSelectedDocument: React.Dispatch<React.SetStateAction<any>>;
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fileName: "",
    description: "",
    visible: false,
  });
  const validationSchema = yup.object().shape({
    fileName: yup.string().required("File name is required"),
    description: yup.string().nullable(),
  });

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  useEffect(() => {
    if (!isOpen) return;

    if ((modelType === "edit" || modelType === "read") && selectedDocument) {
      setFormData({
        fileName: selectedDocument.fileName || "",
        description: selectedDocument.description || "",
        visible: selectedDocument.visible ?? false,
      });
    } else {
      setFormData({ fileName: "", description: "", visible: false });
      setUploadedFiles([]);
    }
  }, [isOpen, modelType, selectedDocument]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) {
      setErrors((p) => {
        const copy = { ...p };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((p) => ({ ...p, visible: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modelType === "read") {
      handleClose();
      return;
    }

    // ---- delete mode – no validation needed ----
    if (modelType === "delete") {
      setLoading(true);
      try {
        // await api.deleteDocument(selectedDocument._id);
        showToast("success", "Deleted", "Document removed permanently");
        handleClose();
      } catch (err) {
        const axiosErr = err as AxiosError<any>;
        showToast(
          "error",
          axiosErr?.response?.data?.title || "Error",
          axiosErr?.response?.data?.message || "Could not delete"
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // ---- upload / edit ----
    if (modelType === "upload" && uploadedFiles.length === 0) {
      showToast("error", "File Required", "Please select a file");
      return;
    }

    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
      const payload: any = {
        fileName: formData.fileName,
        description: formData.description,
        visible: formData.visible,
        file: uploadedFiles[0]?.file ?? null,
      };

      if (modelType === "edit" && uploadedFiles.length === 0) {
        payload.existingFile = selectedDocument.fileUrl;
      }

      console.log("SUBMIT PAYLOAD →", payload);
      // await api.saveDocument(payload, modelType);
      showToast(
        "success",
        "Success",
        `Document ${modelType === "edit" ? "updated" : "uploaded"}`
      );
      handleClose();
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      showToast(
        "error",
        axiosErr?.response?.data?.title || "Error",
        axiosErr?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setFormData({ fileName: "", description: "", visible: false });
    setErrors({});
    setUploadedFiles([]);
    setModelType("");
    setSelectedDocument(null);
    closeModal();
  };

  const getModalTitle = () => {
    switch (modelType) {
      case "upload":
        return "Add New Document";
      case "edit":
        return "Edit Document";
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
        return "Add a new document to the system.";
      case "edit":
        return "Update the document details.";
      case "delete":
        return "This action cannot be undone.";
      case "read":
        return "Preview the document.";
      default:
        return "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`${
        modelType === "read" ? "max-w-4xl" : "max-w-2xl"
      } p-5 lg:p-10 m-4`}
    >
      <div className="space-y-6">
        <header className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {getModalTitle()}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getModalDescription()}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {modelType === "delete" ? (
            <div className="space-y-5">
              <div>
                <Label>File Name</Label>
                <p className="rounded-lg bg-gray-100 dark:bg-gray-700 p-6 text-lg text-foreground">
                  {selectedDocument?.fileName}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              <div>
                <Label required>File Name</Label>
                <Input
                  name="fileName"
                  placeholder="Enter a name"
                  value={formData.fileName}
                  onChange={handleInputChange}
                  error={!!errors.fileName}
                  errorMessage={errors.fileName}
                />
              </div>

              {/* Description */}
              <div>
                <Label>Description (optional)</Label>
                <TextArea
                  placeholder="Short description..."
                  value={formData.description}
                  onChange={(value: string) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      description: value,
                    }));
                  }}
                  rows={3}
                />
              </div>

              {/* Visible Toggle */}
              <div className="flex items-center gap-3">
                <Label>Visible</Label>
                <Switch
                  checked={formData.visible}
                  onChange={handleSwitchChange}
                  color="blue"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancek
            </Button>

            <Button type="submit" disabled={loading} className="min-w-[160px]">
              {loading ? (
                <Loading size={1} style={2} />
              ) : modelType === "delete" ? (
                "Delete"
              ) : modelType === "edit" ? (
                "Update"
              ) : (
                "Upload"
              )}{" "}
              Document
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
