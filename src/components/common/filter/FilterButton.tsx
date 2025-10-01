import React from "react";
import Button from "@/components/ui/button/Button";
import { Funnel } from "lucide-react";

interface FilterButtonProps {
  onClick: () => void;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, className }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    className={`h-10 flex items-center gap-2 ${className}`}
  >
    <Funnel className="w-4" />
    Filter
  </Button>
);

export default FilterButton;
