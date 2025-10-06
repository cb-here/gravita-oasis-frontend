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
  <div className={`mb-6 ${className}`}>
    <div className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
      {label}
    </div>
    <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium border border-gray-200">
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
      className="max-w-[800px] p-5 lg:p-10 m-4"
    >
      <div className="space-y-6">
        <div className="px-2">
          {selectedError ? (
            <div className="w-full">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline gap-1 transition-colors"
                >
                  Back to List
                </button>
              </div>
              <div className="font-bold text-xl text-gray-900 mb-2">
                Error Details
              </div>
              <div className="text-2xl font-black text-gray-dark mb-6">
                Error #{selectedError.errorNumber}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ModalField label="Category" value={selectedError.category} />
                <ModalField label="Location" value={selectedError.location} />
              </div>
              <ModalField
                label="Description"
                value={selectedError.description}
                className="md:grid-cols-2"
              />
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wide">
                  Attachment
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col items-center justify-center">
                  <img
                    src={`${selectedError.attachmentName}`}
                    alt={selectedError.attachmentName}
                    className="max-w-full h-auto rounded-lg max-h-[400px] object-cover mb-3"
                  />
                  <p className="text-xs text-gray-500 font-medium">
                    {selectedError.attachmentName}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="font-bold text-xl text-gray-900 mb-6">
                Error List
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {errors.map((error) => (
                  <div
                    key={error.errorNumber}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleOpenDetails(error)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          Error #{error.errorNumber}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {error.category}
                        </div>
                        <div className="text-xs text-gray-500">
                          {error.description}
                        </div>
                      </div>
                      <button className="ml-4 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline self-start">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {errors.length === 0 && (
                <div className="text-center text-gray-500 py-12 flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-300 mb-4"
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
                  <div className="text-lg font-medium">No errors found.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
