import Loading from "@/components/Loading";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { DownloadIcon } from "@/icons";
import React, { useState } from "react";

interface DownloadModalProps {
  isOpen: boolean;
  closeModal: () => void;
  selectedItem: any;
  setSelectedItem: any;
}

export default function DownloadModal({
  isOpen,
  closeModal,
  selectedItem,
  setSelectedItem,
}: DownloadModalProps) {
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    if (!loading) {
      setSelectedItem(null);
      setLoading(false);
      closeModal();
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className={`max-w-[600px]
       p-5 lg:p-10 m-4`}
    >
      <div>
        <h3 className="text-xl font-bold mb-4">Download XLS File</h3>
        <div className="flex-1 overflow-auto">
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to download the XLS file?
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <DownloadIcon />
                <span className="text-sm font-medium">{selectedItem?.name || "hello_word.xlsx"}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-2">
                <p className="text-sm text-brand-500">Total Rows: {20}</p>
                <p className="text-sm text-success-500">Successfully Created: {10}</p>
                <p className="text-sm text-error-500">Failed Tasks: {5}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2 pt-4 border-t dark:border-gray-700">
          <Button variant="outline" disabled={loading} onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[180px]">
            {loading ? (
              <>
                <Loading size={1} style={3} />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <DownloadIcon />
                <span>Download</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
