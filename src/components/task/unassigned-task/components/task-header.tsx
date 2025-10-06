import SearchableSelect from "@/components/form/SearchableSelect";
import Button from "@/components/ui/button/Button";
import { endOfDay, format, startOfDay, subDays } from "date-fns";

type DateRange = {
  startDate: Date;
  endDate: Date;
};

export const getDateRange = (selected: string): DateRange => {
  const baseDate = new Date();

  switch (selected) {
    case "today":
      return {
        startDate: startOfDay(baseDate), // today at 00:00:00
        endDate: endOfDay(baseDate), // today at 23:59:59
      };

    case "this_week":
      return {
        startDate: startOfDay(subDays(baseDate, 6)), // 6 days back, 00:00:00
        endDate: endOfDay(baseDate), // today 23:59:59
      };

    case "this_month":
      return {
        startDate: startOfDay(subDays(baseDate, 29)),
        endDate: endOfDay(baseDate),
      };

    case "this_year":
      return {
        startDate: startOfDay(subDays(baseDate, 364)),
        endDate: endOfDay(baseDate),
      };

    default:
      return {
        startDate: startOfDay(baseDate),
        endDate: endOfDay(baseDate),
      };
  }
};

interface IProps {
  onClickAction: () => void;
  dateRange: any;
  onDateChange: (data: any, date: any) => void;
  setCustomDate: () => void;
}
function TaskTableHeader({
  onClickAction,
  dateRange,
  onDateChange,
  setCustomDate,
}: IProps) {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="gap-4 flex items-center">
        <Button
          size="sm"
          className="flex items-center gap-2 p-5 border-[#EAECF0] text-[#475467] hover:bg-[#F9FAFB]"
          onClick={onClickAction}
        >
          <i className="fa fa-plus" />
          <span>Create New Task</span>
        </Button>

        {dateRange === "custom_date" && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 p-5 mr-2 border-[#EAECF0] text-[#475467] hover:bg-[#F9FAFB]"
            onClick={setCustomDate}
          >
            <i className="fa fa-calendar mr-1.5 text-[#5750F1]" />
            <span className="font-medium">
              {dateRange?.startDate &&
                format(dateRange?.startDate, "dd MMM yyyy")}{" "}
              -{" "}
              {dateRange?.endDate && format(dateRange?.endDate, "dd MMM yyyy")}
            </span>
          </Button>
        )}
      </div>
      <SearchableSelect
        dataProps={{
          optionData: [
            { label: "Today", value: "today" },
            { label: "Weekly", value: "this_week" },
            { label: "Monthly", value: "this_month" },
            { label: "Yearly", value: "this_year" },
            { label: "Custom Date", value: "custom_date" },
          ].map((opt) => ({
            _id: opt.value,
            name: opt.label,
          })),
        }}
        selectionProps={{
          selectedValue: dateRange,
        }}
        displayProps={{
          placeholder: "Select date range",
          id: "dateRange",
          layoutProps: { className: "min-w-[200px]" },
        }}
        eventHandlers={{
          onChange: (option: any) => {
            const date_type = option.value;
            let date_value;
            if (date_type !== "custom_date")
              date_value = getDateRange(date_type as any);

            console.log(date_value, "date_valuedate_valuedate_value");
            onDateChange(date_type, date_value);
          },
        }}
      />
    </div>
  );
}

export default TaskTableHeader;
