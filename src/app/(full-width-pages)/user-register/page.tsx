"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import Input from "@/components/form/input/InputField";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import Label from "@/components/form/Label";
import MyPhoneInput from "@/components/form/input/PhoneInput";
import DateTimePicker from "@/components/common/DateTimePicker";

const steps = [
  { label: "Personal Details", icon: "👤" },
  { label: "Bank", icon: "🏦" },
  { label: "Documents", icon: "📄" },
];

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  backupPhone: string;
  dob: Date | null;
  fatherName: string;
  motherName: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  aadharCard: File | null;
  panCard: File | null;
  experienceCertificate: File | null;
  educationalCertificate: File | null;
  otherDocuments: File | null;
  [key: string]: string | File | Date | null;
}

export default function UserRegistrationForm() {
  const [step, setStep] = useState(0);
  const [, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    backupPhone: "",
    dob: null,
    fatherName: "",
    motherName: "",
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    aadharCard: null,
    panCard: null,
    experienceCertificate: null,
    educationalCertificate: null,
    otherDocuments: null,
  });

  // Animation background elements
  const [circles] = useState(() =>
    Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
  );

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!form.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Invalid email format";
      if (!form.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^\+\d{10,15}$/.test(form.phone))
        newErrors.phone = "Invalid phone number format";
      if (!form.dob) newErrors.dob = "Date of birth is required";
      if (!form.gender.trim()) newErrors.gender = "Gender is required";
      if (!form.maritalStatus.trim())
        newErrors.maritalStatus = "Marital status is required";
      if (!form.addressLine1.trim())
        newErrors.addressLine1 = "Address is required";
      if (!form.city.trim()) newErrors.city = "City is required";
      if (!form.state.trim()) newErrors.state = "State is required";
      if (!form.postalCode.trim())
        newErrors.postalCode = "Postal code is required";
      if (!form.country.trim()) newErrors.country = "Country is required";
    }

    if (currentStep === 1) {
      if (!form.accountNumber.trim())
        newErrors.accountNumber = "Account number is required";
      if (!form.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required";
      if (!form.bankName.trim()) newErrors.bankName = "Bank name is required";
      if (!form.branchName.trim())
        newErrors.branchName = "Branch name is required";
    }

    if (currentStep === 2) {
      if (!form.aadharCard) newErrors.aadharCard = "Aadhar card is required";
      if (!form.panCard) newErrors.panCard = "PAN card is required";
      if (!form.educationalCertificate)
        newErrors.educationalCertificate =
          "Educational certificate is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = (currentStep: number): boolean => {
    if (currentStep === 0) {
      return !!(
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.email.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
        form.phone.trim() &&
        /^\+\d{10,15}$/.test(form.phone) &&
        form.dob &&
        form.gender.trim() &&
        form.maritalStatus.trim() &&
        form.addressLine1.trim() &&
        form.city.trim() &&
        form.state.trim() &&
        form.postalCode.trim() &&
        form.country.trim()
      );
    }

    if (currentStep === 1) {
      return !!(
        form.accountNumber.trim() &&
        form.ifscCode.trim() &&
        form.bankName.trim() &&
        form.branchName.trim()
      );
    }

    if (currentStep === 2) {
      return !!(form.aadharCard && form.panCard && form.educationalCertificate);
    }

    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelect = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [name]: "File size should be less than 5MB",
        }));
        return;
      }

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

    setForm((prev) => ({ ...prev, [name]: file }));
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      try {
        setIsSubmitting(true);
        console.log("Form submitted:", form);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
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
                placeholder="Enter your first name"
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
                placeholder="Enter your last name"
                error={!!errors.lastName}
                errorMessage={errors.lastName}
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
              <MyPhoneInput
                label="Phone Number"
                required
                value={form.phone}
                onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
                placeholder="Enter phone number"
                error={!!errors.phone}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500 error-message">
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <MyPhoneInput
                label="Backup Number"
                value={form.backupPhone}
                onChange={(phone) =>
                  setForm((prev) => ({ ...prev, backupPhone: phone }))
                }
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
              <DateTimePicker
                value={form.dob}
                onChange={(date) => {
                  setForm((prev) => ({ ...prev, dob: date }));
                  if (errors.dob) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.dob;
                      return newErrors;
                    });
                  }
                }}
                onlyPast={true}
                error={!!errors.dob}
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-500 error-message">
                  {errors.dob}
                </p>
              )}
            </div>
            <div>
              <Label>Father&apos;s Name</Label>
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
              <Label>Mother&apos;s Name</Label>
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

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Address Information
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <Label required>Address Line 1</Label>
                <Input
                  type="text"
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  placeholder="Street address, P.O. box"
                  error={!!errors.addressLine1}
                  errorMessage={errors.addressLine1}
                />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input
                  type="text"
                  name="addressLine2"
                  value={form.addressLine2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, building (optional)"
                  error={!!errors.addressLine2}
                  errorMessage={errors.addressLine2}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <Label required>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  error={!!errors.city}
                  errorMessage={errors.city}
                />
              </div>
              <div>
                <Label required>State/Province</Label>
                <Input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  error={!!errors.state}
                  errorMessage={errors.state}
                />
              </div>
              <div>
                <Label required>Postal Code</Label>
                <Input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                  error={!!errors.postalCode}
                  errorMessage={errors.postalCode}
                />
              </div>
            </div>
            <div>
              <Label required>Country</Label>
              <Input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Enter country"
                error={!!errors.country}
                errorMessage={errors.country}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 backdrop-blur-sm">
            <Label>Blood Group</Label>
            <div className="flex flex-wrap gap-2">
              {bloodGroupOptions.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  className={`px-4 py-2 rounded-lg border transition-all font-medium focus:outline-none text-sm ${
                    form.bloodGroup === bg
                      ? "bg-brand-500 text-white border-brand-500 shadow-theme-xs"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-brand-50 hover:border-brand-300 dark:hover:bg-brand-500/10 backdrop-blur-sm"
                  }`}
                  onClick={() => handleSelect("bloodGroup", bg)}
                >
                  {bg}
                </button>
              ))}
            </div>
            {errors.bloodGroup && (
              <p className="mt-2 text-sm text-error-500">{errors.bloodGroup}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 backdrop-blur-sm">
              <Label required>Gender</Label>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((g) => (
                  <button
                    type="button"
                    key={g}
                    className={`px-4 py-2 rounded-lg border transition-all font-medium focus:outline-none text-sm ${
                      form.gender === g
                        ? "bg-brand-500 text-white border-brand-500 shadow-theme-xs"
                        : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-brand-50 hover:border-brand-300 dark:hover:bg-brand-500/10 backdrop-blur-sm"
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
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-5 backdrop-blur-sm">
              <Label required>Marital Status</Label>
              <div className="flex flex-wrap gap-2">
                {maritalStatusOptions.map((m) => (
                  <button
                    type="button"
                    key={m}
                    className={`px-4 py-2 rounded-lg border transition-all font-medium focus:outline-none text-sm ${
                      form.maritalStatus === m
                        ? "bg-brand-500 text-white border-brand-500 shadow-theme-xs"
                        : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-brand-50 hover:border-brand-300 dark:hover:bg-brand-500/10 backdrop-blur-sm"
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
            disabled={!isStepValid(0)}
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
            disabled={!isStepValid(1)}
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
          className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700 transition-all backdrop-blur-sm"
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
          <Button
            variant="gradient"
            size="md"
            onClick={handleSubmit}
            disabled={!isStepValid(2)}
          >
            Submit
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {circles.map((circle, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-gradient-to-r from-brand-500/10 to-purple-500/10 dark:from-brand-400/5 dark:to-purple-400/5 animate-float"
            style={{
              left: `${circle.x}%`,
              top: `${circle.y}%`,
              width: `${circle.size}rem`,
              height: `${circle.size}rem`,
              animationDuration: `${circle.duration}s`,
              animationDelay: `${circle.delay}s`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, #9ca3af 1px, transparent 1px),
                             linear-gradient(to bottom, #9ca3af 1px, transparent 1px)`,
            backgroundSize: "4rem 4rem",
          }}
        />
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="relative">
            <Image
              width={200}
              height={42}
              src="/images/logo/app-logo.png"
              alt="Logo"
              className="text-gray-900 dark:text-gray-100"
            />
            <div className="absolute -inset-4 bg-brand-500/10 rounded-full blur-xl animate-pulse" />
          </div>
        </div>

        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            Create Your Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill in the details below to complete your registration
          </p>
        </div>

        {/* Enhanced Progress Steps */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-theme-lg border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((s, idx) => (
                <React.Fragment key={s.label}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-500 transform ${
                        idx === step
                          ? "bg-gradient-to-r from-[#00C6FF] to-[#9B5FFF] text-white ring-4 ring-[#00C6FF]/30 scale-110 shadow-lg"
                          : idx < step
                          ? "bg-brand-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 shadow-sm"
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
                          ? "text-brand-500 dark:text-brand-400 font-semibold"
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
                        className={`h-1 rounded-full transition-all duration-500 ${
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

        {/* Enhanced Form Container */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-theme-lg border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 lg:p-10 transform transition-all duration-300 hover:shadow-theme-xl">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {renderForm()}
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
