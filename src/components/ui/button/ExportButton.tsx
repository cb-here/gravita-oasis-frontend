"use client";

import Loading from "@/components/Loading";
import Button from "@/components/ui/button/Button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ExportButton({
  loading = false,
  onClick,
  className = "",
}: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`h-9 gap-1 rounded-full w-full md:min-w-[100px] md:w-auto ${className}`}
    >
      {loading ? (
        <>
          <div className="hidden dark:flex items-center justify-center w-full">
            <Loading style={2} size={1} />
          </div>
          <div className="flex dark:hidden items-center justify-center w-full">
            <Loading style={4} size={1} />
          </div>
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </>
      )}
    </Button>
  );
}
