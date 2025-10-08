import { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface Error {
  errorNumber: number;
  category: string;
  description: string;
  location: string;
  attachmentName: string;
}

interface ErrorModalProps {
  isOpen: boolean;
  closeModal: () => void;
  errors: Error[];
  setErrors: (errors: Error[] | null) => void;
}

const ModalField: React.FC<{
  label: string;
  value: string;
  className?: string;
}> = ({ label, value, className }) => (
  <div className={`mb-4 sm:mb-6 ${className}`}>
    <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
      {label}
    </div>
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-medium border border-gray-200 dark:border-gray-700">
      {value}
    </div>
  </div>
);

export default function ErrorDetailsModal({
  isOpen,
  closeModal,
  errors,
  setErrors,
}: ErrorModalProps) {
  const [selectedError, setSelectedError] = useState<Error | null>(null);

  const handleClose = () => {
    setErrors(null);
    setSelectedError(null);
    closeModal();
  };

  const handleOpenDetails = (error: Error) => {
    setSelectedError(error);
  };

  const handleBackToList = () => {
    setSelectedError(null);
  };

  if (!isOpen || !errors || errors.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={!selectedError}
      className={`${selectedError? "max-w-[600px]": "max-w-[1000px]"} p-3 sm:p-5 lg:p-10 m-2 sm:m-4`}
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="px-1 sm:px-2">
          {selectedError ? (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline gap-1 transition-colors"
                >
                  Back to List
                </button>
              </div>
              <div className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-2">
                Error Details
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-dark dark:text-gray-100 mb-4 sm:mb-6">
                Error #{selectedError.errorNumber}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <ModalField label="Category" value={selectedError.category} />
                <ModalField label="Location" value={selectedError.location} />
              </div>
              <ModalField label="Description" value={selectedError.description} />
              <div className="mb-4 sm:mb-6">
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 uppercase tracking-wide">
                  Attachment
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                  <img
                    src={`${selectedError.attachmentName}`}
                    alt={selectedError.attachmentName}
                    className="max-w-full h-auto rounded-lg max-h-[300px] sm:max-h-[400px] object-cover mb-2 sm:mb-3"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {selectedError.attachmentName}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[900px]">
              <div className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                Error List
              </div>
              <div className="space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                {errors.map((error) => (
                  <div
                    key={error.errorNumber}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md dark:shadow-gray-700 dark:hover:shadow-gray-600 transition-shadow cursor-pointer"
                    onClick={() => handleOpenDetails(error)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-1">
                          Error #{error.errorNumber}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">
                          {error.category}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {error.description}
                        </div>
                      </div>
                      <button className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline self-start mt-2 sm:mt-0">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {errors.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8 sm:py-12 flex flex-col items-center">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mb-3 sm:mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="text-base sm:text-lg font-medium">No errors found.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}