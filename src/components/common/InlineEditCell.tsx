import React, { useState, useRef, useEffect } from "react";
import { Pencil, Check, X, AlertCircle } from "lucide-react";

interface InlineEditCellProps {
  value: string | number;
  onSave: (newValue: string | number) => Promise<void> | void;
  type?: "text" | "number";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

export default function InlineEditCell({
  value,
  onSave,
  type = "text",
  placeholder = "",
  disabled = false,
  className = "",
  inputClassName = "",
  minValue,
  maxValue,
  step = 1,
}: InlineEditCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleEdit = () => {
    if (!disabled) {
      setIsEditing(true);
      setEditValue(value);
      setError("");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
    setError("");
  };

  const validateInput = (inputValue: string | number): string | null => {
    if (type === "number") {
      const numValue = Number(inputValue);
      if (isNaN(numValue)) {
        return "Please enter a valid number";
      }
      if (minValue !== undefined && numValue < minValue) {
        return `Value must be at least ${minValue}`;
      }
      if (maxValue !== undefined && numValue > maxValue) {
        return `Value must be at most ${maxValue}`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    // Clear previous errors
    setError("");

    // Validate input
    const validationError = validateInput(editValue);
    if (validationError) {
      setError(validationError);
      // showToast("error", "Validation Error", validationError);
      return;
    }

    setIsLoading(true);
    try {
      let processedValue: string | number = editValue;
      
      if (type === "number") {
        processedValue = Number(editValue);
      }

      await onSave(processedValue);
      setIsEditing(false);
      setError("");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to save changes";
      setError(errorMessage);
      // showToast("error", "Save Failed", errorMessage);
      // Keep editing mode open on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  if (isEditing) {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type={type}
            value={editValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            min={type === "number" ? minValue : undefined}
            max={type === "number" ? maxValue : undefined}
            step={type === "number" ? step : undefined}
            className={`flex-1 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-colors ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/10"
                : "border-blue-500 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600"
            } ${inputClassName}`}
          />
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              disabled={isLoading || !!error}
              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {error && (
          <div className="flex items-start text-left gap-1 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-3 h-3 flex-shrink-0 mt-[2px]" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-2 ${className}`}>
      <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">
        {value}
      </span>
      {!disabled && (
        <button
          onClick={handleEdit}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}