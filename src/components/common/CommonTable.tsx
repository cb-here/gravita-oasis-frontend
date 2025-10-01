import React, { useState, useRef, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Checkbox from "../form/input/Checkbox";
import Loading from "../Loading";
import { AngleDownIcon, AngleUpIcon } from "@/icons";
import InlineEditCell from "./InlineEditCell";

type SortDirection = "asc" | "desc" | null;

export type HeaderType<T> = {
  label?: any;
  render: (item: T) => React.ReactNode;
  className?: string;
  sortKey?: string;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  resizable?: boolean;
  inlineEdit?: {
    field: keyof T;
    type?: "text" | "number";
    placeholder?: string;
    onSave: (item: T, newValue: string | number) => Promise<void> | void;
    disabled?: (item: T) => boolean;
    minValue?: number | ((item: T) => number);
    maxValue?: number | ((item: T) => number);
    step?: number;
  };
};

type DropdownControls = {
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  closeDropdown: () => void;
};

type CommonTableProps<T extends Record<string, any>> = {
  headers: HeaderType<T>[];
  data: T[];
  loading?: boolean;
  selectedItems?: Record<string, boolean>;
  setSelectedItems?: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  actions?: (item: T, controls: DropdownControls) => React.ReactNode;
  showCheckbox?: boolean;
  rowIdAccessor?: keyof T | string;
  emptyState?: React.ReactNode;
  showRadio?: boolean;
  onSort?: (key: string, direction: "desc" | "asc") => void;
  currentSort?: any;
  className?: any;
  onSelectedChange?: (items: Record<string, boolean>) => void;
  selectOnWholeRow?: boolean;
};

export default function CommonTable<T extends Record<string, any>>({
  headers,
  data,
  loading = false,
  selectedItems = {},
  setSelectedItems,
  actions,
  showCheckbox = false,
  showRadio = false,
  rowIdAccessor = "_id",
  emptyState = "No data available",
  onSort,
  currentSort,
  className,
  onSelectedChange,
  selectOnWholeRow = false,
}: CommonTableProps<T>) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [sortConfig] = useState<{
    key: string | null;
    direction: SortDirection;
  }>({ key: null, direction: null });

  // Default column settings
  const getColumnDefaults = (header: HeaderType<T>) => ({
    width: header.width ?? 200,
    minWidth: header.minWidth ?? 150,
    resizable: header.resizable ?? true,
  });

  // Column width management
  const [columnWidths, setColumnWidths] = useState<Record<number, number>>(
    () => {
      const initialWidths: Record<number, number> = {};
      headers.forEach((header, index) => {
        const defaults = getColumnDefaults(header);
        initialWidths[index] = defaults.width;
      });
      return initialWidths;
    }
  );

  // Resize state
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const getNestedValue = (obj: any, accessor: string): any => {
    return accessor.split(".").reduce((acc, part) => {
      if (acc === null || acc === undefined) return undefined;
      return acc[part];
    }, obj);
  };

  const getRowId = (item: T): string => {
    const val =
      typeof rowIdAccessor === "string"
        ? getNestedValue(item, rowIdAccessor)
        : item[rowIdAccessor];
    return String(val ?? "");
  };

  // Resize handlers
  const handleResizeStart = useCallback(
    (event: React.MouseEvent, columnIndex: number) => {
      event.preventDefault();
      event.stopPropagation();

      setIsResizing(true);
      setResizingColumn(columnIndex);
      startXRef.current = event.clientX;
      startWidthRef.current = columnWidths[columnIndex];

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [columnWidths]
  );

  const handleResizeMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizing || resizingColumn === null) return;

      const deltaX = event.clientX - startXRef.current;
      const columnDefaults = getColumnDefaults(headers[resizingColumn]);
      const newWidth = Math.max(
        columnDefaults.minWidth,
        startWidthRef.current + deltaX
      );

      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: newWidth,
      }));
    },
    [isResizing, resizingColumn, headers]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizingColumn(null);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  // Add event listeners for mouse move and mouse up
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);

      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const handleSort = (key: string) => {
    if (!onSort) return;

    let direction: "asc" | "desc" = "asc";

    if (currentSort?.sortBy === key) {
      // If same column clicked, toggle direction
      direction = currentSort.sort === "asc" ? "desc" : "asc";
    }

    onSort(key, direction);
  };

  const sortedData = data;

  const isAllSelected =
    data?.length > 0 && data.every((item) => selectedItems[getRowId(item)]);

  const handleSelectAll = (checked: boolean) => {
    if (!setSelectedItems && !onSelectedChange) return;
    const updated = data.reduce((acc, item) => {
      acc[getRowId(item)] = checked;
      return acc;
    }, {} as Record<string, boolean>);
    setSelectedItems?.(updated);
    onSelectedChange?.(updated);
  };

  const handleRowCheck = (id: string, checked: boolean) => {
    if (!setSelectedItems && !onSelectedChange) return;

    if (showRadio) {
      // For radio: clear all and select only the clicked one
      setSelectedItems?.({ [id]: true });
    } else {
      // For checkbox: toggle normally
      setSelectedItems?.((prev: Record<string, boolean>) => ({
        ...prev,
        [id]: checked,
      }));
      if (onSelectedChange) {
        const updated = { ...selectedItems, [id]: checked };
        onSelectedChange(updated);
      }
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const visibleColumnsCount =
    headers.length + (showCheckbox ? 1 : 0) + (actions ? 1 : 0);

  // Resize handle component
  const ResizeHandle = ({ columnIndex }: { columnIndex: number }) => {
    const columnDefaults = getColumnDefaults(headers[columnIndex]);
    if (!columnDefaults.resizable) return null;

    return (
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500 hover:opacity-50 group"
        onMouseDown={(e) => handleResizeStart(e, columnIndex)}
        style={{
          backgroundColor:
            resizingColumn === columnIndex ? "#3B82F6" : "transparent",
          opacity: resizingColumn === columnIndex ? 0.8 : 1,
        }}
      >
        <div className="h-full w-full group-hover:bg-blue-500 group-hover:opacity-30" />
      </div>
    );
  };

  function SortArrows({
    sortKey,
    columnKey,
    sortOrder,
    onClick,
  }: {
    sortKey: string | null;
    columnKey: string | undefined;
    sortOrder: SortDirection | null;
    onClick: () => void;
  }) {
    const isActiveAsc = sortKey === columnKey && sortOrder === "asc";
    const isActiveDesc = sortKey === columnKey && sortOrder === "desc";

    return (
      <button
        className="flex flex-col gap-0.5"
        type="button"
        aria-label="Sort"
        onClick={onClick}
      >
        <AngleUpIcon
          className={`text-gray-300 dark:text-gray-700 ${
            isActiveAsc ? "text-brand-500" : ""
          }`}
        />
        <AngleDownIcon
          className={`text-gray-300 dark:text-gray-700 ${
            isActiveDesc ? "text-brand-500" : ""
          }`}
        />
      </button>
    );
  }

  return (
    <div
      ref={tableRef}
      className={`max-w-full max-h-[1000px] overflow-auto custom-scrollbar mt-5 bg-white dark:bg-gray-900 relative border border-gray-100 dark:border-white/[0.05] rounded-lg ${className}`}
    >
      <Table
        className="min-w-full border-separate border-spacing-0"
        style={{ tableLayout: "fixed" }}
      >
        <TableHeader>
          <TableRow className="bg-white dark:bg-gray-900">
            {headers.map((header, idx) => {
              const isFirstColumn = headers[0] === header;
              if (showCheckbox && isFirstColumn)
                return (
                  <TableCell
                    key={`checkbox-header-${idx}`}
                    isHeader
                    className="text-left px-4 py-3 border-b border-r border-gray-100 dark:border-white/[0.05] sticky top-0 lg:-left-1 bg-white dark:bg-gray-900 z-25 relative"
                    style={{
                      width: `${columnWidths[idx]}px`,
                      minWidth: `${columnWidths[idx]}px`,
                      maxWidth: `${columnWidths[idx]}px`,
                    }}
                  >
                    <div className="flex items-center gap-6">
                      <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                      <span className="text-theme-xs text-gray-700 dark:text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
                        {header.label}
                      </span>
                      {header.sortable && (
                        <div className="ml-auto">
                          <SortArrows
                            sortKey={currentSort?.sortBy || null}
                            columnKey={header.sortKey || String(idx)}
                            sortOrder={currentSort?.sort || null}
                            onClick={() =>
                              handleSort(header.sortKey || String(idx))
                            }
                          />
                        </div>
                      )}
                    </div>
                    <ResizeHandle columnIndex={idx} />
                  </TableCell>
                );

              return (
                <TableCell
                  key={`header-${idx}`}
                  isHeader
                  className={`px-4 py-3 border-b border-r border-gray-100 dark:border-white/[0.05] relative ${
                    isFirstColumn
                      ? "text-left sticky lg:left-0 z-25"
                      : "text-center"
                  } z-20 sticky top-0 bg-white dark:bg-gray-900`}
                  style={{
                    width: `${columnWidths[idx]}px`,
                    minWidth: `${columnWidths[idx]}px`,
                    maxWidth: `${columnWidths[idx]}px`,
                  }}
                >
                  <div
                    className={`flex items-center ${
                      isFirstColumn ? "justify-start" : "justify-center"
                    } gap-2 w-full`}
                  >
                    <span className="font-medium text-gray-700 text-theme-xs dark:text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
                      {header.label}
                    </span>
                    {header.sortable && (
                      <div className="ml-auto">
                        <SortArrows
                          sortKey={sortConfig.key}
                          columnKey={header.sortKey || String(idx)}
                          sortOrder={sortConfig.direction}
                          onClick={() =>
                            handleSort(header.sortKey || String(idx))
                          }
                        />
                      </div>
                    )}
                  </div>
                  <ResizeHandle columnIndex={idx} />
                </TableCell>
              );
            })}
            {actions && (
              <TableCell
                isHeader
                className="px-4 py-3 border-b border-r border-gray-100 dark:border-white/[0.05] text-center sticky top-0 md:right-0 z-20 bg-white dark:bg-gray-900 w-[100px]"
              >
                <p className="text-gray-700 text-theme-xs dark:text-gray-400">
                  Actions
                </p>
              </TableCell>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumnsCount}
                className="relative bg-white dark:bg-gray-900 h-[150px]"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none"></div>
              </TableCell>
            </TableRow>
          ) : sortedData?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={visibleColumnsCount}>
                <div className="py-8 text-lg text-center text-gray-500 h-[150px]">
                  {/* {emptyState} */}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedData?.map((item, index) => {
              const rowId = getRowId(item) || `row-${index}`;
              return (
                <TableRow
                  key={rowId}
                  onClick={() => {
                    if (showRadio || selectOnWholeRow) {
                      const checked = showRadio ? true : !selectedItems[rowId];
                      handleRowCheck(rowId, checked);
                    }
                  }}
                >
                  {headers.map((header, idx) => {
                    const isFirstColumn = headers[0] === header;
                    const content = header?.render(item);

                    // Render cell content - either inline editable or regular content
                    const renderCellContent = () => {
                      if (header.inlineEdit) {
                        const fieldValue = item[header.inlineEdit.field];
                        const minValue =
                          typeof header.inlineEdit.minValue === "function"
                            ? header.inlineEdit.minValue(item)
                            : header.inlineEdit.minValue;
                        const maxValue =
                          typeof header.inlineEdit.maxValue === "function"
                            ? header.inlineEdit.maxValue(item)
                            : header.inlineEdit.maxValue;

                        return (
                          <InlineEditCell
                            value={fieldValue || ""}
                            onSave={(newValue) =>
                              header.inlineEdit!.onSave(item, newValue)
                            }
                            type={header.inlineEdit.type || "text"}
                            placeholder={header.inlineEdit.placeholder}
                            disabled={
                              header.inlineEdit.disabled
                                ? header.inlineEdit.disabled(item)
                                : false
                            }
                            minValue={minValue}
                            maxValue={maxValue}
                            step={header.inlineEdit.step}
                            className="w-full"
                          />
                        );
                      }
                      return content || "-";
                    };

                    if ((showCheckbox || showRadio) && isFirstColumn) {
                      return (
                        <TableCell
                          key={`${rowId}-checkbox-cell-${idx}`}
                          className={`text-left px-4 py-4 border-b border-r border-gray-100 dark:border-white/[0.05] dark:text-white/90  bg-white dark:bg-gray-900 sticky lg:-left-1 z-10`}
                          style={{
                            width: `${columnWidths[idx]}px`,
                            minWidth: `${columnWidths[idx]}px`,
                            maxWidth: `${columnWidths[idx]}px`,
                          }}
                        >
                          <div className="flex items-center gap-6">
                            {showCheckbox && (
                              <Checkbox
                                checked={!!selectedItems[rowId]}
                                onChange={(checked) =>
                                  handleRowCheck(rowId, checked)
                                }
                              />
                            )}
                            {showRadio && (
                              <input
                                type="radio"
                                name="row-selection"
                                checked={!!selectedItems[rowId]}
                                onChange={() => handleRowCheck(rowId, true)}
                                className="w-4 h-4 accent-brand-500"
                              />
                            )}
                            <div
                              className={`${
                                header?.className || ""
                              } text-left flex items-center gap-1 sm:gap-2 overflow-hidden flex-1`}
                            >
                              <div
                                className={`${
                                  header.inlineEdit
                                    ? "w-full"
                                    : "whitespace-nowrap overflow-hidden text-ellipsis"
                                }`}
                              >
                                {renderCellContent()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell
                          key={`${rowId}-cell-${idx}`}
                          className={`px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm ${
                            isFirstColumn
                              ? "text-left dark:text-white/90 sticky lg:left-0 z-20 bg-white dark:bg-gray-900"
                              : header.sortable
                              ? "text-left dark:text-white/90"
                              : "text-center dark:text-gray-400"
                          } ${header?.className || ""}`}
                          style={{
                            width: `${columnWidths[idx]}px`,
                            minWidth: `${columnWidths[idx]}px`,
                            maxWidth: `${columnWidths[idx]}px`,
                          }}
                        >
                          <div
                            className={`${
                              header.inlineEdit
                                ? "w-full"
                                : "whitespace-nowrap overflow-hidden text-ellipsis cut-text"
                            }`}
                          >
                            {renderCellContent()}
                          </div>
                        </TableCell>
                      );
                    }
                  })}
                  {actions && (
                    <TableCell className="px-4 py-4 font-normal text-gray-800 border border-gray-100 dark:border-white/[0.05] text-theme-sm dark:text-white/90 whitespace-nowrap text-center bg-white dark:bg-gray-900 md:sticky md:right-0 md:z-10">
                      <div className="inline-flex items-center justify-center gap-1 w-auto">
                        {actions(item, {
                          isDropdownOpen: openDropdownId === rowId,
                          toggleDropdown: () => toggleDropdown(rowId),
                          closeDropdown: () => setOpenDropdownId(null),
                        })}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
          <Loading size={4} />
        </div>
      ) : sortedData?.length === 0 ? (
        <div className="absolute inset-0 flex text-lg text-gray-500 items-center justify-center bg-white dark:bg-gray-900">
          {emptyState}
        </div>
      ) : null}
    </div>
  );
}
