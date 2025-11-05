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
import axios from "@/lib/axiosInstance";

interface DocumentModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modelType: "upload" | "edit" | "delete" | "read";
  setModelType: React.Dispatch<React.SetStateAction<string>>;
  selectedDocument: any;
  setSelectedDocument: React.Dispatch<React.SetStateAction<any>>;
  setDocuments: any;
   rowsPerPage: any;
}


export default function DocumentModal({
  isOpen,
  closeModal,
  modelType,
  setModelType,
  selectedDocument,
  setSelectedDocument,
  setDocuments,
  rowsPerPage
}: DocumentModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
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
        fileName: selectedDocument.name || "",
        description: selectedDocument.description || "",
        visible: selectedDocument.visible ?? false,
      });
    } else {
      setFormData({ fileName: "", description: "", visible: false });
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

    if (modelType !== "delete") {
      const isValid = await validateForm();
      if (!isValid) return;
    }

    setLoading(true);

    try {
      if (modelType === "delete") {
        const res = await axios.delete(
          `/documents/${selectedDocument?._id}`
        );
        showToast("success", res?.data?.title, res?.data?.message);

        setDocuments((prev: any) => ({
          ...prev,
          documents: prev.documents.filter(
            (doc: any) => doc?._id !== selectedDocument?._id
          ),
          totalRecords: prev.totalRecords - 1,
        }));

        handleClose();
      } else {
        if (modelType === "edit") {
          const res = await axios.put(
            `/documents/${selectedDocument?._id}`,
            {
              name: formData.fileName,
              description: formData.description,
              visible: formData.visible,
            }
          );
          showToast("success", res?.data?.title, res?.data?.message);

          setDocuments((prev: any) => ({
            ...prev,
            documents: prev.documents.map((doc: any) =>
              doc._id === selectedDocument?._id
                ? {
                    ...doc,
                    name: formData.fileName,
                    description: formData.description,
                    visible: formData.visible,
                  }
                : doc
            ),
          }));

          handleClose();
        } else {
          const res = await axios.post(`/documents`, {
            name: formData.fileName,
            description: formData.description,
            visible: formData.visible,
          });
          showToast("success", res?.data?.title, res?.data?.message);
          const response = res?.data?.Response;

          setDocuments((prev: any) => {
            const updatedDocuments = [...prev.documents];

            if (updatedDocuments.length >= rowsPerPage) {
              updatedDocuments.pop();
            }

            return {
              ...prev,
              documents: [response, ...updatedDocuments],
              totalRecords: prev.totalRecords + 1,
            };
          });

          handleClose();
        }
      }
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
                <p className="rounded-lg bg-gray-100 dark:bg-gray-700 p-4 text-lg text-foreground">
                  {selectedDocument?.name}
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
              Cancel
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
