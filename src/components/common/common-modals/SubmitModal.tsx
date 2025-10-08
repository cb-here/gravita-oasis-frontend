import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import Loading from "@/components/Loading";
import { Modal } from "@/components/ui/modal";

interface SubmitModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  description: string;
  onSubmit: () => Promise<void> | void; // supports async
  btnText?: string;
}

export default function SubmitModal({
  isOpen,
  closeModal,
  title,
  description,
  onSubmit,
  btnText = "Submit",
}: SubmitModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await onSubmit();
      closeModal();
    } catch (error) {
      console.error("SubmitModal error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={false}
      className="max-w-[550px] w-full p-6 lg:p-8 m-4 rounded-2xl shadow-lg bg-white dark:bg-gray-900">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {title || "Confirm Action"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description || "Are you sure you want to continue?"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div></div>
          <div className="flex justify-between gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={loading}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="px-6 py-2 min-w-[140px]"
              disabled={loading}>
              {loading ? <Loading size={1} style={2} /> : btnText}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
