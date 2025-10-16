import DatePicker from "@/components/form/date-picker";
import Badge from "@/components/ui/badge/Badge";

interface HeaderSectionProps {
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export default function HeaderSection({ setStartDate, setEndDate }: HeaderSectionProps) {
  return (
    <div className="flex flex-col gap-6 mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-6">
          <img
            src="https://i.pravatar.cc/150?img=47"
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-200 dark:border-indigo-600 shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
              Sarah Mitchell
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
              Senior Medical Coder
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cardiology Coding Team • ID: MC-2023-047
            </p>
            <p className="mt-2">
              <Badge className="inline-flex items-center" color="success">
                Active
              </Badge>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-full max-w-md">
            <DatePicker
              id="dateRange"
              mode="range"
              placeholder="Select date range..."
              onChange={(selectedDates: Date[]) => {
                if (selectedDates.length === 2) {
                  setStartDate(selectedDates[0].toISOString().split("T")[0]);
                  setEndDate(selectedDates[1].toISOString().split("T")[0]);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}