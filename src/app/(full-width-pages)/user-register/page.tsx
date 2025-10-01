"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import Input from "@/components/form/input/InputField";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import Label from "@/components/form/Label";
import MyPhoneInput from "@/components/form/input/PhoneInput";

const steps = [
  { label: "Personal Details", icon: "👤" },
  { label: "Bank", icon: "🏦" },
  { label: "Documents", icon: "📄" },
];

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  backupPhone: string;
  dob: string;
  fatherName: string;
  motherName: string;
  gender: string;
  maritalStatus: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  aadharCard: File | null;
  panCard: File | null;
  experienceCertificate: File | null;
  educationalCertificate: File | null;
  otherDocuments: File | null;
  [key: string]: string | File | null;
}

export default function UserRegistrationForm() {
  const [step, setStep] = useState(0);
  const [, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [form, setForm] = useState<FormData>({
    // Personal Details
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    backupPhone: "",
    dob: "",
    fatherName: "",
    motherName: "",
    gender: "",
    maritalStatus: "",
    // Bank Details
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    // Documents
    aadharCard: null,
    panCard: null,
    experienceCertificate: null,
    educationalCertificate: null,
    otherDocuments: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [name]: "File size should be less than 5MB",
        }));
        return;
      }

      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only PDF, JPG, and PNG files are allowed",
        }));
        return;
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setForm({ ...form, [name]: file });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Handle form submission
      console.log("Form submitted:", form);
      // Add your API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileClick = (name: string) => {
    fileInputRefs.current[name]?.click();
  };

  const renderForm = () => {
    switch (step) {
      case 0:
        return renderPersonalDetails();
      case 1:
        return renderBankDetails();
      case 2:
        return renderDocuments();
      default:
        return renderPersonalDetails();
    }
  };

  const renderPersonalDetails = () => {
    return (
      <>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-1">
            Personal Details
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please provide your personal information
          </p>
        </div>
        <div className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <Label required>First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter your name"
                error={!!errors.firstName}
                errorMessage={errors.firstName}
              />
            </div>
            <div>
              <Label required>Last Name</Label>
              <Input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter your name"
                error={!!errors.lastName}
                errorMessage={errors.lastName}
              />
            </div>
            <div>
              <Label required>Username</Label>
              <Input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your name"
                error={!!errors.username}
                errorMessage={errors.username}
              />
            </div>
            <div>
              <Label required>Personal Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={!!errors.email}
                errorMessage={errors.email}
              />
            </div>
            <div>
              <Label required>Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your number"
                error={!!errors.phone}
                errorMessage={errors.phone}
              />
            </div>
            <div>
              <MyPhoneInput
                label="Backup Number"
                value={form.backupPhone}
                onChange={(phone) => setForm({ ...form, backupPhone: phone })}
                placeholder="Enter backup number"
                error={!!errors.backupPhone}
              />
              {errors.backupPhone && (
                <p className="mt-1 text-sm text-red-500 error-message">
                  {errors.backupPhone}
                </p>
              )}
            </div>
            <div>
              <Label required>Date of Birth</Label>
              <Input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                placeholder="dd-mm-yyyy"
                error={!!errors.dob}
                errorMessage={errors.dob}
              />
            </div>
            <div>
              <Label>Father's Name</Label>
              <Input
                type="text"
                name="fatherName"
                value={form.fatherName}
                onChange={handleChange}
                placeholder="Enter father's name"
                error={!!errors.fatherName}
                errorMessage={errors.fatherName}
              />
            </div>
            <div>
              <Label>Mother's Name</Label>
              <Input
                type="text"
                name="motherName"
                value={form.motherName}
                onChange={handleChange}
                placeholder="Enter mother's name"
                error={!!errors.motherName}
                errorMessage={errors.motherName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
              <Label required>Gender</Label>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((g) => (
                  <button
                    type="button"
                    key={g}
                    className={`px-4 py-2 rounded-lg border transition-all font-medium focus:outline-none text-sm ${
                      form.gender === g
                        ? "bg-brand-500 text-white border-brand-500 shadow-theme-xs"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-brand-50 hover:border-brand-300 dark:hover:bg-brand-500/10"
                    }`}
                    onClick={() => handleSelect("gender", g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-2 text-sm text-error-500">{errors.gender}</p>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
              <Label required>Marital Status</Label>
              <div className="flex flex-wrap gap-2">
                {maritalStatusOptions.map((m) => (
                  <button
                    type="button"
                    key={m}
                    className={`px-4 py-2 rounded-lg border transition-all font-medium focus:outline-none text-sm ${
                      form.maritalStatus === m
                        ? "bg-brand-500 text-white border-brand-500 shadow-theme-xs"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-brand-50 hover:border-brand-300 dark:hover:bg-brand-500/10"
                    }`}
                    onClick={() => handleSelect("maritalStatus", m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {errors.maritalStatus && (
                <p className="mt-2 text-sm text-error-500">
                  {errors.maritalStatus}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            variant="gradient"
            size="md"
            endIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M5 12h14m-7 7 7-7-7-7"
                />
              </svg>
            }
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </>
    );
  };

  const renderBankDetails = () => {
    return (
      <>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-1">
            Bank Details
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your banking information for payment processing
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label required>Account Number</Label>
            <Input
              type="text"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              error={!!errors.accountNumber}
              errorMessage={errors.accountNumber}
            />
          </div>
          <div>
            <Label required>IFSC Code</Label>
            <Input
              type="text"
              name="ifscCode"
              value={form.ifscCode}
              onChange={handleChange}
              placeholder="Enter IFSC code"
              error={!!errors.ifscCode}
              errorMessage={errors.ifscCode}
            />
          </div>
          <div>
            <Label required>Bank Name</Label>
            <Input
              type="text"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="Enter bank name"
              error={!!errors.bankName}
              errorMessage={errors.bankName}
            />
          </div>
          <div>
            <Label required>Branch Name</Label>
            <Input
              type="text"
              name="branchName"
              value={form.branchName}
              onChange={handleChange}
              placeholder="Enter branch name"
              error={!!errors.branchName}
              errorMessage={errors.branchName}
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            size="md"
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M19 12H5m7-7-7 7 7 7"
                />
              </svg>
            }
            onClick={handlePrevious}
          >
            Previous
          </Button>
          <Button
            variant="gradient"
            size="sm"
            endIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M5 12h14m-7 7 7-7-7-7"
                />
              </svg>
            }
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </>
    );
  };

  const renderFileUpload = (
    name: string,
    label: string,
    required: boolean = false
  ) => {
    return (
      <div>
        <Label required={required}>{label}</Label>
        <input
          type="file"
          ref={(el) => {
            fileInputRefs.current[name] = el;
          }}
          className="hidden"
          onChange={(e) => handleFileChange(name, e.target.files?.[0] || null)}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <div
          className="flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700 transition-all"
          onClick={() => handleFileClick(name)}
        >
          {form[name] ? (
            <div className="text-center">
              <svg
                className="w-10 h-10 text-green-500 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                File uploaded successfully
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(form[name] as File).name}
              </p>
            </div>
          ) : (
            <>
              <svg
                className="w-10 h-10 text-brand-500 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, JPG or PNG (max. 5MB)
              </p>
            </>
          )}
        </div>
        {errors[name] && (
          <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
        )}
      </div>
    );
  };

  const renderDocuments = () => {
    return (
      <>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-1">
            Upload Documents
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload required documents. Accepted formats: PDF, JPG, PNG (max 5MB
            each)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {renderFileUpload("aadharCard", "Aadhar Card", true)}
          {renderFileUpload("panCard", "PAN Card", true)}
          {renderFileUpload("experienceCertificate", "Experience Certificate")}
          {renderFileUpload(
            "educationalCertificate",
            "Educational Certificate",
            true
          )}
          {renderFileUpload("otherDocuments", "Other Documents")}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            size="md"
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M19 12H5m7-7-7 7 7 7"
                />
              </svg>
            }
            onClick={handlePrevious}
          >
            Previous
          </Button>
          <Button variant="gradient" size="md" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 relative">
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center mb-8 sm:mb-10">
          <Image
            width={200}
            height={42}
            src="/images/logo/auth-logo.svg"
            alt="Logo"
            className="text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            Create Your Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill in the details below to complete your registration
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-theme-xs border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((s, idx) => (
                <React.Fragment key={s.label}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 ${
                        idx === step
                          ? "bg-brand-500 text-white ring-4 ring-brand-500/20"
                          : idx < step
                          ? "bg-brand-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {idx < step ? (
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <>
                          {s.label === "Personal Details" && (
                            <svg
                              className="w-5 h-5 sm:w-6 sm:h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          )}
                          {s.label === "Bank" && (
                            <svg
                              className="w-5 h-5 sm:w-6 sm:h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                            </svg>
                          )}
                          {s.label === "Documents" && (
                            <svg
                              className="w-5 h-5 sm:w-6 sm:h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          )}
                        </>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs sm:text-sm font-medium text-center transition-colors ${
                        idx <= step
                          ? "text-brand-500 dark:text-brand-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className="flex-1 mx-2 sm:mx-4"
                      style={{ maxWidth: "120px" }}
                    >
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx < step
                            ? "bg-brand-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-theme-xs border border-gray-200 dark:border-gray-700 p-6 sm:p-8 lg:p-10">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {renderForm()}
          </form>
        </div>
      </div>
    </div>
  );
}
