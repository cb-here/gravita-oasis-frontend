"use client";

import React, { useState } from "react";
import Link from "next/link";
import Label from "../form/Label";
import Input from "@/components/form/input/InputField";
import Button from "../ui/button/Button";
import * as yup from "yup";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import axios from "@/lib/axiosInstance";
import { setAuthCookies } from "@/lib/cookies";
import { setToken, setUserDetails } from "@/redux/slices/authSlice";
import { showToast } from "@/lib/toast";
import Loading from "../Loading";

export default function ForgetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
  });

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setError({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setError(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError((prev: any) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setIsLoading(true);
      const res = await axios.post("/auth/forgot-password", {
        email: formData.email,
      });

      const response = res?.data?.Response;
      const user = { email: formData.email };

      setAuthCookies(response?.token, user);
      dispatch(setUserDetails(user));
      dispatch(setToken(response?.token));

      showToast("success", res?.data?.title, res?.data?.message);
      router.push("/verify-otp");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      showToast("error", errData?.title, errData?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Forgot Your Password?
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the email address linked to your account, and we’ll send you a
            link to reset your password.
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label required>Email</Label>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={!!error.email}
                  errorMessage={error.email}
                />
              </div>

              <div>
                <Button type="submit" variant="gradient" className="w-full">
                  {isLoading ? (
                    <Loading size={1} style={2} />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Wait, I remember my password...{" "}
              <Link
                href="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Click here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
