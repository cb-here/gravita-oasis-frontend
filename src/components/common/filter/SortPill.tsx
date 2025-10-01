import Badge from "@/components/ui/badge/Badge";

export const SortPill = ({ 
  sortBy, 
  sort, 
  onRemove 
}: { 
  sortBy: string; 
  sort: string; 
  onRemove: () => void 
}) => {
  if (!sortBy) return null;

  return (
    <Badge
      variant="light"
      color="info"
      className="flex items-center gap-1 text-xs shrink-0"
    >
      <span className="capitalize">
        Sorted by: {sortBy} ({sort === "asc" ? "Asc" : "Desc"})
      </span>
      <button
        onClick={onRemove}
        className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </Badge>
  );
};