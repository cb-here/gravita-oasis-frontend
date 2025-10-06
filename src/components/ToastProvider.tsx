"use client";
import React, { useState, useEffect } from "react";
import { registerToastTrigger } from "@/lib/toast";
import Alert from "./ui/alert/Alert";

interface Toast {
  id: number;
  variant: "success" | "error" | "warning" | "info";
  title?: string;
  message?: string;
  duration?: number;
}

const ToastProvider: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    variant: Toast["variant"],
    title?: string,
    message?: string,
    duration = 3000
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, variant, title, message, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  useEffect(() => {
    registerToastTrigger(addToast);
  }, []);

  return (
    <div className="fixed top-4 right-4 space-y-3 z-[100]">
      {toasts.map((toast, index) => (
        <Alert
          key={`${toast.id}_${index}`}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
        />
      ))}
    </div>
  );
};

export default ToastProvider;
