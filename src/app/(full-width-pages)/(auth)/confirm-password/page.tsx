"use client";

import { useState } from "react";
import PasswordField from "@/components/form/input/PasswordField";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { ChevronLeftIcon } from "@/icons";
import * as yup from "yup";

export default function ResetPasswordPage() {
  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const validateForm = async (formData: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return { valid: true, errors: {} };
    } catch (err) {
      const errors: Record<string, string> = {};
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
      }
      return { valid: false, errors };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    const { valid, errors } = await validateForm(formData);
    if (!valid) {
      setErrors(errors);

      return;
    }
  };

  return (
    <div className="flex items-center justify-center lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="w-full max-w-md sm:pt-4 mx-auto mb-5">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to Login
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Reset Password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your password below
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordField
                placeholder="New Password"
                value={formData?.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                error={!!errors.password}
                errorMessage={errors.password}
              />

              <PasswordField
                placeholder="Confirm New Password"
                value={formData?.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }));
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                error={errors.confirmPassword}
                errorMessage={errors.confirmPassword}
              />

              <Button
                variant="gradient"
                type="submit"
                size="sm"
                className="w-full"
              >
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
