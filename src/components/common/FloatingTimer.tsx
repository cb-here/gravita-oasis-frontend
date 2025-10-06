"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Clock, X, Pause, Play, CheckCircle2, Maximize2, Minimize2 } from "lucide-react";
import Timer from "./Timer";
import { useTimer } from "@/lib/contexts/TimerContext";
import Button from "../ui/button/Button";
import CheckOutModal from "../user-management/kanban/modals/CheckOutModal";

export default function FloatingTimer() {
  const { isRunning, startTime, taskInfo, stopTimer, pauseTimer, resumeTimer } =
    useTimer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 40, y: 10 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  // For React re-renders only when needed (not during drag)
  const [, setRenderTrigger] = useState(0);

  useEffect(() => {
    // Set initial position from localStorage or default
    const savedPosition = localStorage.getItem("timerPosition");
    if (savedPosition) {
      const pos = JSON.parse(savedPosition);
      positionRef.current = pos;
      setRenderTrigger(prev => prev + 1); // Trigger re-render
    } else {
      // Default position (top-right)
      positionRef.current = { x: window.innerWidth - 400, y: 16 };
      setRenderTrigger(prev => prev + 1); // Trigger re-render
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timerRef.current) return;
    const rect = timerRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
  };

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!timerRef.current) return;

    const newX = clientX - dragOffsetRef.current.x;
    const newY = clientY - dragOffsetRef.current.y;

    // Boundary checks
    const maxX = window.innerWidth - (timerRef.current.offsetWidth || 0);
    const maxY = window.innerHeight - (timerRef.current.offsetHeight || 0);

    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    positionRef.current = { x: boundedX, y: boundedY };

    // Update element position directly for smooth dragging
    if (timerRef.current) {
      timerRef.current.style.left = `${boundedX}px`;
      timerRef.current.style.top = `${boundedY}px`;
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    // Cancel any previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      updatePosition(e.clientX, e.clientY);
    });
  }, [isDragging, updatePosition]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Save position to localStorage
      localStorage.setItem("timerPosition", JSON.stringify(positionRef.current));
      
      // Trigger re-render to ensure React knows about the final position
      setRenderTrigger(prev => prev + 1);
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      
      // Add grabbing cursor to body
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      
      // Clean up cursor styles
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!taskInfo) return null;

  const handleCheckOutClick = () => {
    setShowCheckOutModal(true);
  };

  const handleCheckOut = (notes: string) => {
    console.log("Checked out with notes:", notes);
    // You can handle the notes here (e.g., save to API)
    setShowCheckOutModal(false);
  };

  if (isMinimized) {
    return (
      <div
        ref={timerRef}
        className="fixed z-[99999]"
        style={{
          left: `${positionRef.current.x}px`,
          top: `${positionRef.current.y}px`,
        }}
      >
        <button
          onClick={() => setIsMinimized(false)}
          onMouseDown={handleMouseDown}
          className={`flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg shadow-lg hover:bg-brand-primary/90 transition-all ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Show Timer</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={timerRef}
      className={`fixed z-[99999] transition-all duration-300 ${
        isExpanded ? "w-96" : "w-auto"
      }`}
      style={{
        left: `${positionRef.current.x}px`,
        top: `${positionRef.current.y}px`,
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div
          className={`bg-gradient-to-r from-brand-primary to-brand-primary/80 text-white p-3 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Active Task Timer</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Hide"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="p-4">
          <Timer
            startTime={startTime}
            isRunning={isRunning}
            variant="compact"
            className="w-full justify-center"
          />

          {isExpanded && (
            <div className="mt-4 space-y-3">
              {/* Task Info */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {taskInfo.taskName}
                </h4>
                {taskInfo.patientName && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Patient
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {taskInfo.patientName}
                    </span>
                  </div>
                )}
                {taskInfo.mrn && (
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      MRN
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {taskInfo.mrn}
                    </span>
                  </div>
                )}
                {taskInfo.priority && (
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      Priority
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        taskInfo.priority === "High"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : taskInfo.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {taskInfo.priority}
                    </span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 text-xs py-1.5"
                  onClick={isRunning ? pauseTimer : resumeTimer}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Resume
                    </>
                  )}
                </Button>
                <Button
                  className="flex-1 text-xs py-1.5 bg-green-600 hover:bg-green-700"
                  onClick={handleCheckOutClick}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Check Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Check Out Modal */}
      <CheckOutModal
        isOpen={showCheckOutModal}
        onClose={() => setShowCheckOutModal(false)}
        onCheckOut={handleCheckOut}
      />
    </div>
  );
}