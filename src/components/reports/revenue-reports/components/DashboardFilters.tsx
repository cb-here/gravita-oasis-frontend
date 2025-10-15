import DatePicker from "@/components/form/date-picker";
import SearchableSelect from "@/components/form/SearchableSelect";
import Button from "@/components/ui/button/Button";
import { Filter } from "lucide-react";

interface DashboardFiltersProps {
  selectedTeam: string;
  setSelectedTeam: any;
  selectedProject: string;
  setSelectedProject: any;
  selectedGroup: string;
  setSelectedGroup: any;
  teamOptions: any[];
  projectOptions: any[];
  groupOptions: any[];
  timeFrames: any[];
  timeFrame: any;
  setTimeFrame: any;
}

export const DashboardFilters = ({
  selectedTeam,
  selectedProject,
  selectedGroup,
  teamOptions,
  projectOptions,
  groupOptions,
  setSelectedGroup,
  setSelectedProject,
  setSelectedTeam,
  timeFrames,
  setTimeFrame,
  timeFrame,
}: DashboardFiltersProps) => {
  return (
    <div className="rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-brand-600" />
        <h2 className="text-heading">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="w-full">
          <SearchableSelect
            dataProps={{
              optionData: teamOptions?.map((opt: any) => ({
                _id: opt.value,
                name: opt.label,
              })),
            }}
            selectionProps={{
              selectedValue: selectedTeam
                ? {
                    _id: selectedTeam,
                    name:
                      teamOptions.find((t: any) => t.value === selectedTeam)
                        ?.label || selectedTeam,
                  }
                : null,
            }}
            displayProps={{
              placeholder: "Select team...",
              id: "team",
              isClearable: true,
              layoutProps: {
                className: "w-full",
              },
            }}
            eventHandlers={{
              onChange: (selected: any) => {
                setSelectedTeam(selected ? selected._id : null);
              },
            }}
          />
        </div>

        <SearchableSelect
          dataProps={{
            optionData: projectOptions?.map((opt: any) => ({
              _id: opt.value,
              name: opt.label,
            })),
          }}
          selectionProps={{
            selectedValue: selectedProject
              ? {
                  _id: selectedProject,
                  name:
                    teamOptions.find((t: any) => t.value === selectedProject)
                      ?.label || selectedProject,
                }
              : null,
          }}
          displayProps={{
            placeholder: "Select project...",
            id: "project",
            isClearable: true,
            layoutProps: {
              className: "w-full",
            },
          }}
          eventHandlers={{
            onChange: (selected: any) => {
              setSelectedProject(selected ? selected._id : null);
            },
          }}
        />

        <div>
          <SearchableSelect
            dataProps={{
              optionData: groupOptions?.map((opt: any) => ({
                _id: opt.value,
                name: opt.label,
              })),
            }}
            selectionProps={{
              selectedValue: selectedGroup
                ? {
                    _id: selectedGroup,
                    name:
                      teamOptions.find((t: any) => t.value === selectedGroup)
                        ?.label || selectedGroup,
                  }
                : null,
            }}
            displayProps={{
              placeholder: "Select group...",
              id: "group",
              isClearable: true,
              layoutProps: {
                className: "w-full",
              },
            }}
            eventHandlers={{
              onChange: (selected: any) => {
                setSelectedGroup(selected ? selected._id : null);
              },
            }}
          />
        </div>
      </div>
      <div className="mt-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-wrap justify-center gap-3">
            {timeFrames.map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={timeFrame === value ? "gradient" : "outline"}
                onClick={() => setTimeFrame(value)}
                className="capitalize transition-all duration-300 hover:scale-105 group flex items-center gap-2 px-4 py-2.5"
              >
                <Icon className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span>{label}</span>
              </Button>
            ))}
          </div>
          <DatePicker
            id="dateRange"
            mode="range"
            placeholder="Select date range..."
          />
        </div>
      </div>
    </div>
  );
};
