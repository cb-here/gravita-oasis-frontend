"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/icons";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import axios from "@/lib/axiosInstance";
import { setAuthCookies } from "@/lib/cookies";
import { setToken, setLogin, setUserDetails } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { showToast } from "@/lib/toast";

const optTimer = 40;

export default function OrgOtpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(optTimer);
  const [canResend, setCanResend] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[name=otp-${index + 1}]`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
    if (newOtp.every((digit) => digit !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name=otp-${index - 1}]`
      ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setIsLoading(true);
      const res = await axios.post("/auth/resend-otp");
      const response = res?.data?.Response;
      setAuthCookies(response?.token);
      dispatch(setToken(response?.token));
      showToast("success", res?.data?.title, res?.data?.message);
      setTimer(optTimer);
      setCanResend(false);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      showToast("error", errData?.title, errData?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (code: string) => {
    try {
      setOtpStatus("loading");

      const res = await axios.post("/auth/verify-otp", {
        otp: code,
      });

      const response = res?.data?.Response;
      setOtpStatus("success");
      showToast("success", res?.data?.title, res?.data?.message);

      // Check if this is a login flow or password reset flow
      // If user details are present, it's a login flow
      if (response?._id && response?.email && response?.sessionId) {
        // Login flow - user verified OTP after login
        const user = {
          id: response?._id,
          email: response?.email,
          username: response?.username,
          sessionId: response?.sessionId,
          role: response?.role,
        };

        await setAuthCookies(response?.token, user, true);
        dispatch(setLogin(true));
        dispatch(setUserDetails(user));
        dispatch(setToken(response?.token));

        setTimeout(() => {
          router.push("/");
        }, 200);
      } else {
        // Password reset flow - only token is returned
        await setAuthCookies(response?.token);
        dispatch(setToken(response?.token));

        setTimeout(() => {
          router.push("/reset-password");
        }, 200);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errData = axiosError?.response?.data;
      setOtpStatus("error");
      showToast("error", errData?.title, errData?.message);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();
    if (!pasteData) return;

    const pasteArray = pasteData
      .replace(/\D/g, "") // remove non-digits
      .slice(0, otp.length)
      .split("");

    const newCode = [...otp];

    pasteArray.forEach((char, idx) => {
      newCode[idx] = char;
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]!.value = char;
      }
    });

    setOtp(newCode);

    // Focus the next empty input, or blur if filled
    const nextIndex =
      pasteArray.length < otp.length ? pasteArray.length : otp.length - 1;
    inputRefs.current[nextIndex]?.focus();

    if (newCode.every((digit) => digit !== "")) {
      handleVerificationComplete(newCode.join(""));
    }
  };

  const handleVerificationComplete = (otp: string) => {
    if (otp?.length === 6) {
      handleSubmit(otp);
    } else {
      // showToast("error", "", "Please enter a valid 6-digit code");
    }
  };

  const renderStatusIcon = () => {
    if (otpStatus === "loading") {
      return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;
    }
    if (otpStatus === "success") {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (otpStatus === "error") {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <div className="w-5"></div>;
  };

  return (
    <div className="flex items-center justify-center lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="w-full max-w-md sm:pt-4 mx-auto mb-5">
          <Link
            href="/signin"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to Login
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8 ">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Enter Verification Code
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We have sent a verification code to your email address. Please
                enter it below.
              </p>
            </div>
            <div className="space-y-5 sm:space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-3 px-2 sm:px-0 w-full">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    name={`otp-${index}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 text-center text-lg font-semibold 
        rounded-lg border appearance-none shadow-theme-xs 
        focus:outline-none focus:ring-3 focus:border-brand-300 focus:ring-brand-500/20
        dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 
        dark:focus:border-brand-800 shrink-0 min-w-0"
                    autoFocus={index === 0}
                    onPaste={handlePaste}
                  />
                ))}
                <div className="shrink-0">{renderStatusIcon()}</div>
              </div>
            </div>
            <div className="text-center mt-5 sm:mt-6">
              <p className="text-gray-700 dark:text-gray-400 text-sm flex items-center gap-1">
                {`Didn't receive the code? `}
                <button
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                  className={`text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 ${
                    !canResend ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : canResend ? (
                    "Resend"
                  ) : (
                    `Resend in ${timer}s`
                  )}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
