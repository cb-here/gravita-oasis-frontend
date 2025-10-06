"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  startTime?: number;
  isRunning?: boolean;
  onTimeUpdate?: (seconds: number) => void;
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

export default function Timer({
  startTime = 0,
  isRunning = true,
  onTimeUpdate,
  variant = "default",
  className = "",
}: TimerProps) {
  const [seconds, setSeconds] = useState(startTime);

  useEffect(() => {
    setSeconds(startTime);
  }, [startTime]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((s) => {
        const newSeconds = s + 1;
        onTimeUpdate?.(newSeconds);
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Active
          </span>
        </div>
        <div className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
          {formatTime(seconds)}
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={`inline-flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums ${className}`}
      >
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        {formatTime(seconds)}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="text-center">
          <div className="inline-block bg-white/5 backdrop-blur-2xl px-4 py-2 rounded-3xl border border-white/20 dark:border-gray-800 shadow-2xl">
            <div className="text-4xl font-light text-dark/90 dark:text-white/90 tabular-nums tracking-widest">
              {formatTime(seconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
