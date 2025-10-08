"use client";
import React, { useEffect, useRef, useState } from "react";
import { LucideMessageCircleQuestion } from "lucide-react";
import { showToast } from "@/lib/toast";
import { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
import * as yup from "yup";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import SearchableSelect from "@/components/form/SearchableSelect";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { FileUploadComponent } from "@/components/form/input/file-upload";
import Button from "@/components/ui/button/Button";
import Loading from "@/components/Loading";

export default function SupportPopupForm() {
//   const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const initFormData = {
    subject: "",
    category: "",
    description: "",
    attachments: [],
  };
  const [formData, setFormData] = useState(initFormData);
  const [errors, setErrors] = useState<any>({});
  const uploadRef = useRef<{ clearFiles: () => void }>(null);

  const [categoriesList, ] = useState([]);

  const getCategoriesList = async () => {
    try {
    //   const res = await axios.get(`ticket-categories`, { adminURL: true });
    //   const data = res?.data?.Response?.Categories;
    //   setCategoriesList(data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current === false) {
      initRef.current = true;
      getCategoriesList();
    }
  }, []);

  const validationSchema = yup.object().shape({
    subject: yup.string().required("Subject is required"),
    description: yup.string().required("Description is required"),
    category: yup.string().required("Category is required"),
  });

  const validateForm = async (): Promise<boolean> => {
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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const payload: any = new FormData();
      for (const attachment of formData.attachments as any) {
        let file = attachment?.file;
        if (!file && attachment?.preview) {
          file = base64ToFile(
            attachment?.preview,
            attachment?.id || "file.jpg"
          );
        }
        if (file) {
          payload.append("files", file);
        }
      }
      payload.append("title", formData?.subject);
      payload.append("categoryId", formData?.category);
      payload.append("message", formData?.description);
    //   const res = await axios.post(`create-ticket`, payload, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //     adminURL: true,
    //   });
    //   const response = res?.data?.Response;
      // showToast(
      //   "success",
      //   res?.data?.title || "Support Ticket Submitted",
      //   res?.data?.message ||
      //     "Your support ticket has been created successfully. Our team will reach out to you shortly with a resolution."
      // );

      // await router.push(`/support/${response?._id}`);
      // handleClose();
//       Swal.fire({
//         html: `
//     <div style="text-align: center; padding: 10px 0;">
//       <!-- Custom success icon -->
//       <div style="display: flex; justify-content: center; margin-bottom: 16px;">
//         <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none"
//           stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//           <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
//           <path d="m9 12 2 2 4-4" />
//         </svg>
//       </div>
//       <!-- Title -->
//       <h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 6px;">
//         ${res?.data?.title || "Request Successful"}
//       </h2>
//       <!-- Message -->
//       <p style="font-size: 14px; color: #6b7280;">
//         ${
//           "Your support ticket has been created successfully. Our team will reach out to you shortly with a resolution."
//         }
//       </p>
//     </div>
//   `,
//         showConfirmButton: true,
//         confirmButtonText: "OK",
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//         customClass: {
//           popup: "swal2-rounded custom-swal-popup",
//           confirmButton: "custom-swal-gradient-button",
//         },
//       }).then(() => {
//         router.push(`/support/${response?._id}`);
//         handleClose();
//       });
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
      setFormData(initFormData);
      uploadRef.current?.clearFiles();
      setErrors({});
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-[98] bottom-3 right-3 flex items-center justify-center bg-gradient-to-br from-primary to-primary hover:to-secondary transition-colors duration-200 ease-linear shadow-xl rounded-full p-3 text-white"
      >
        <LucideMessageCircleQuestion />
      </button>
      <Modal
        isOpen={open}
        onClose={handleClose}
        className="max-w-[1100px] p-5 lg:p-10 m-4"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Support Center
          </h1>
          <p className="text-base text-muted-foreground">
            Need help? Fill out the form below to create a support ticket. Our
            team will review your request and get back to you as soon as
            possible.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label required>Category</Label>
              <SearchableSelect
                dataProps={{
                  optionData: categoriesList,
                }}
                selectionProps={{
                  selectedValue: formData.category,
                }}
                displayProps={{
                  placeholder: "Select Category",
                  id: "category",
                  layoutProps: {
                    className: `w-full ${
                      errors.category
                        ? "border-red-500 border rounded-lg"
                        : ""
                    }`,
                  },
                }}
                eventHandlers={{
                  onChange: (option: any) => {
                    handleChange("category", option?.value);
                  },
                }}
              />
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>
            <div>
              <Label required>Title</Label>
              <Input
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder="Enter title"
                error={!!errors.subject}
              />
              {errors.subject && (
                <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
              )}
            </div>
          </div>
          <div>
            <Label required>Message</Label>
            <TextArea
              value={formData.description}
              onChange={(value: string) => handleChange("description", value)}
              placeholder="Task message..."
              error={errors.description}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
          <FileUploadComponent
            ref={uploadRef}
            onFilesChange={(files) =>
              setFormData((p: any) => ({ ...p, attachments: files }))
            }
            maxFiles={3}
            maxSizeMB={5}
          />
          <div className="flex items-center justify-between w-full gap-3 sm:w-auto mt-8">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              disabled={loading}
              type="submit"
              className="px-6 py-2 min-w-[100px]"
            >
              {loading ? <Loading size={1} style={2} /> : "Submit"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
