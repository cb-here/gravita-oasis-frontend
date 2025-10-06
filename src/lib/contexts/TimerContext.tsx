"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface TaskInfo {
  taskId: string;
  taskName: string;
  patientName?: string;
  mrn?: string;
  priority?: string;
  age?: string;
}

interface TimerContextType {
  isRunning: boolean;
  startTime: number;
  taskInfo: TaskInfo | null;
  startTimer: (task: TaskInfo) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  getElapsedTime: () => number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskInfo | null>(null);
  const [checkInTime, setCheckInTime] = useState<number | null>(null);
  const [currentElapsedTime, setCurrentElapsedTime] = useState(0);

  // Update elapsed time every second
  React.useEffect(() => {
    if (!isRunning || !checkInTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - checkInTime) / 1000);
      setCurrentElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, checkInTime]);

  const startTimer = useCallback((task: TaskInfo) => {
    console.log("Starting timer with task:", task);
    const now = Date.now();
    setCheckInTime(now);
    setCurrentElapsedTime(0);
    setTaskInfo(task);
    setIsRunning(true);

    // Store in localStorage for persistence
    localStorage.setItem(
      "activeTimer",
      JSON.stringify({
        checkInTime: now,
        taskInfo: task,
      })
    );
    console.log("Timer started successfully");
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setCurrentElapsedTime(0);
    setTaskInfo(null);
    setCheckInTime(null);
    localStorage.removeItem("activeTimer");
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const getElapsedTime = useCallback(() => {
    if (!checkInTime) return 0;
    return Math.floor((Date.now() - checkInTime) / 1000);
  }, [checkInTime]);

  // Restore timer on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("activeTimer");
    if (stored) {
      try {
        const { checkInTime: storedTime, taskInfo: storedTask } =
          JSON.parse(stored);
        const elapsed = Math.floor((Date.now() - storedTime) / 1000);
        console.log("Restoring timer - checkInTime:", storedTime, "elapsed:", elapsed);
        setCheckInTime(storedTime);
        setCurrentElapsedTime(elapsed);
        setTaskInfo(storedTask);
        setIsRunning(true);
      } catch (error) {
        console.error("Failed to restore timer:", error);
        localStorage.removeItem("activeTimer");
      }
    }
  }, []);

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        startTime: currentElapsedTime,
        taskInfo,
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
        getElapsedTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
