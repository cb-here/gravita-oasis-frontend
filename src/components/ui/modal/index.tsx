"use client";
import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose?: any;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  openFromRight?: boolean;
  sidebarContent?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
  openFromRight = false,
  sidebarContent,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isSidePanel = openFromRight;
  const showSidebar = isSidePanel && sidebarContent;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sidebarOpen && sidebarRef.current) {
      const width = sidebarRef.current.scrollWidth;
      setSidebarWidth(width);
    } else {
      setSidebarWidth(0);
    }
  }, [sidebarOpen, sidebarContent]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <ModalContent
      isSidePanel={isSidePanel}
      isFullscreen={isFullscreen}
      showSidebar={showSidebar}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      sidebarWidth={sidebarWidth}
      sidebarRef={sidebarRef}
      modalRef={modalRef}
      onClose={onClose}
      showCloseButton={showCloseButton}
      className={className}
      sidebarContent={sidebarContent}
    >
      {children}
    </ModalContent>
  );

  return createPortal(modalContent, document.body);
};

// Extracted modal content component
const ModalContent: React.FC<{
  isSidePanel: boolean;
  isFullscreen: boolean;
  showSidebar: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarWidth: number;
  sidebarRef: React.RefObject<HTMLDivElement>;
  modalRef: React.RefObject<HTMLDivElement>;
  onClose?: any;
  showCloseButton: boolean;
  className?: string;
  sidebarContent?: React.ReactNode;
  children: React.ReactNode;
}> = ({
  isSidePanel,
  isFullscreen,
  showSidebar,
  sidebarOpen,
  setSidebarOpen,
  sidebarWidth,
  sidebarRef,
  modalRef,
  onClose,
  showCloseButton,
  className,
  sidebarContent,
  children,
}) => {
  // Calculate dynamic width for side panel with sidebar
  const calculateModalWidth = () => {
    const baseWidth = "70vw";

    if (!showSidebar || !sidebarOpen || sidebarWidth === 0) {
      return baseWidth;
    }

    // Increase width to accommodate sidebar content
    if (baseWidth.includes("vw")) {
      const vwValue = parseFloat(baseWidth);
      const sidebarVW = (sidebarWidth / window.innerWidth) * 100;
      return `${Math.min(vwValue + sidebarVW + 5, 95)}vw`;
    }

    return baseWidth;
  };

  const sideModalStyle = {
    width: showSidebar ? calculateModalWidth() : "70vw",
    height: "100%",
    transition: "width 0.3s ease-in-out",
  };

  const containerClasses = isSidePanel
    ? "fixed inset-0 z-99999 flex justify-end"
    : "fixed inset-0 flex items-center justify-center modal z-99999";

  const overlayClasses =
    "fixed inset-0 h-full w-full bg-gray-400/50 z-[99999] pointer-events-auto";

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay, not bubbled from children
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      if (onClose) {
        onClose();
      }
    }
  };

  const baseContentClasses = isSidePanel
    ? `relative bg-white dark:bg-gray-900 z-[99999] overflow-visible`
    : isFullscreen
    ? "w-full h-full"
    : "relative w-full rounded-xl bg-white dark:bg-gray-900";

  const contentClasses = isSidePanel
    ? `${baseContentClasses} transform transition-transform duration-300 ease-in-out translate-x-0 ${
        className || ""
      }`
    : `${baseContentClasses} ${
        className || ""
      } max-h-[calc(100vh-20px)] overflow-y-auto overflow-x-hidden no-scrollbar z-[99999]`;

  const closeButtonClasses = isSidePanel
    ? "absolute -left-[38px] top-6 z-[100000] flex h-10 w-10 items-center justify-center rounded-l-4xl rounded-r-none bg-white dark:bg-gray-900 border border-r-0 border-gray-200 dark:border-gray-700 text-gray-800 transition-all duration-300 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-200 darh:hover:text-gray-100"
    : "absolute z-0 right-3 top-3 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11";

  return (
    <div className={containerClasses} onClick={handleOverlayClick}>
      {!isFullscreen && <div className={overlayClasses}></div>}

      {/* For side panel, wrap content and close button together */}
      {isSidePanel ? (
        <div className="relative">
          <div
            ref={modalRef}
            className={contentClasses}
            style={sideModalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {showSidebar ? (
              <div
                className={`flex h-full w-full relative ${
                  sidebarOpen ? "overflow-hidden" : "overflow-y-auto overflow-x-hidden no-scrollbar"
                }`}
              >
                <div
                  className="h-full flex-grow-0 flex-shrink-0 transition-all duration-300 ease-in-out no-scrollbar"
                  style={{
                    width: `calc(100% - ${sidebarOpen ? sidebarWidth : 0}px)`,
                    transition: "width 0.3s ease-in-out",
                  }}
                >
                  {children}
                </div>

                {/* Toggle sidebar button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`absolute top-4 z-50 w-[48px] h-10 bg-white border border-[#EAECF0] text-gray-dark rounded-full flex items-center justify-center shadow-lg hover:bg-[#EAECF0] transition-all duration-300`}
                  style={{
                    right: sidebarOpen ? `${sidebarWidth + 16}px` : "16px",
                    transition: "right 0.3s ease-in-out",
                  }}
                  aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                  {sidebarOpen ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronLeft size={16} />
                  )}
                </button>

                {/* Right sidebar with content-defined width */}
                <div
                  ref={sidebarRef}
                  className={`h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700 flex-shrink-0`}
                  style={{
                    width: sidebarOpen ? "auto" : "0px",
                    opacity: sidebarOpen ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "width 0.3s ease-in-out, opacity 0.3s ease-in-out",
                  }}
                >
                  <div className="h-full no-scrollbar p-4 whitespace-nowrap overflow-y-auto">
                    {sidebarOpen && sidebarContent}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto no-scrollbar">
                {children}
              </div>
            )}
          </div>

          {showCloseButton && (
            <button
              onClick={onClose || null}
              className={closeButtonClasses}
              aria-label="Close"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div
          ref={modalRef}
          className={contentClasses}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button onClick={onClose || null} className={closeButtonClasses}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
          <div className="overflow-x-hidden">{children}</div>
        </div>
      )}
    </div>
  );
};
