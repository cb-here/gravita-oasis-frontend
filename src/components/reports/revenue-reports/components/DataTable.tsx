interface Column {
  header: string;
  accessor: string;
  align?: "left" | "right";
  format?: (value: any, row?: any, index?: number) => string;
  className?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  title: string;
}

export const DataTable = ({ data, columns, title }: DataTableProps) => {
  return (
    <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-border">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`py-3 px-4 font-semibold text-card-foreground ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
              >
                {columns.map((column, colIdx) => {
                  const value = row[column.accessor];
                  const formattedValue = column.format
                    ? column.format(value, row, rowIdx)
                    : value;

                  return (
                    <td
                      key={colIdx}
                      className={`py-3 px-4 ${
                        column.align === "right" ? "text-right" : "text-left"
                      } ${column.className || "text-card-foreground"}`}
                    >
                      {formattedValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
