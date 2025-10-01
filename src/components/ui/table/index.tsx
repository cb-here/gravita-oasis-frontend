import React, { ReactNode } from "react";
// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
  ref?: any; // Optional className for styling
  style?: any; // Optional className for styling
}
// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}
// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}
// Props for TableRow
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  className?: string;
}
// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  colSpan?: number; // Optional colSpan
  style?: any;
}
// Table Component
const Table: React.FC<TableProps> = ({ children, className, ref, style }) => {
  return <table ref={ref} className={`min-w-full  ${className}`} style={style}>{children}</table>;
};
// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};
// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};
// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
  return <tr className={className} {...props}>{children}</tr>;
};
// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  colSpan,
  style
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag style={style} colSpan={colSpan} className={` ${className}`}>{children}</CellTag>;
};
export { Table, TableHeader, TableBody, TableRow, TableCell };