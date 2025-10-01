"use client";

import React from "react";
import Pagination from "@/components/tables/DataTables/TableThree/Pagination";

interface TableFooterProps {
  rowsPerPage: number;
  handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  totalEntries: number;
  startIndex: number;
  endIndex: number;
}

const TableFooter: React.FC<TableFooterProps> = ({
  rowsPerPage,
  handleRowsPerPageChange,
  currentPage,
  totalPages,
  handlePageChange,
  totalEntries,
  startIndex,
  endIndex,
}) => {
  return (
    <div className="border border-t-0 rounded-b-xl border-gray-100 py-4 pl-[18px] pr-4 dark:border-white/[0.05]">
      <RowsPerPage
        rowsPerPage={rowsPerPage}
        handleRowsPerPageChange={handleRowsPerPageChange}
      />
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mt-3">
        <div className="pb-3 xl:pb-0">
          <p className="pb-3 text-sm font-medium text-left md:text-center text-gray-500 border-b border-gray-100 dark:border-gray-800 dark:text-gray-400 xl:border-b-0 xl:pb-0 xl:text-left">
            Showing {totalEntries === 0 ? 0 : startIndex + 1} to {endIndex || 0}{" "}
            of {totalEntries || 0} entries
          </p>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default TableFooter;

function RowsPerPage({
  rowsPerPage,
  handleRowsPerPageChange,
}: {
  rowsPerPage?: any;
  handleRowsPerPageChange?: any;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-500 dark:text-gray-400"> Show </span>
      <div className="relative z-20 bg-transparent">
        <select
          className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
        >
          <option
            value="10"
            className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
          >
            10
          </option>
          <option
            value="20"
            className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
          >
            20
          </option>
          <option
            value="50"
            className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
          >
            50
          </option>
          <option
            value="100"
            className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
          >
            100
          </option>
        </select>
        <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
          <svg
            className="stroke-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
              stroke=""
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <span className="text-gray-500 dark:text-gray-400"> entries </span>
    </div>
  );
}
