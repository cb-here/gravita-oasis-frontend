"use client";

import React, { useState, useMemo } from "react";
import { Grid3x3 } from "lucide-react";
import CategoryDistribution from ".././hold-reports/CategoryDistribution";
import SearchableSelect from "../../form/SearchableSelect";
import DatePicker from "../../form/date-picker";
import { DownloadIcon } from "@/icons";
import Button from "@/components/ui/button/Button";

interface HoldItem {
  id: number;
  person: string;
  team: string;
  category: string;
  date: string;
  count: number;
}

interface SelectOption {
  label: string;
  value: string;
}

interface SelectItem {
  _id: string;
  name: string;
}

interface RowData {
  name: string;
  total: number;
  [key: string]: number | string | undefined;
}

export default function HoldReports() {
 const rawData: HoldItem[] = [
   // Team Pramod - 18 users covering all categories
   {
     id: 1,
     person: "John Doe",
     team: "Team Pramod",
     category: "Vinod's Open",
     date: "2025-10-01",
     count: 3,
   },
   {
     id: 2,
     person: "Jane Smith",
     team: "Team Pramod",
     category: "Under QA",
     date: "2025-10-02",
     count: 2,
   },
   {
     id: 3,
     person: "Alice Johnson",
     team: "Team Pramod",
     category: "Ready for Vinod",
     date: "2025-10-03",
     count: 4,
   },
   {
     id: 4,
     person: "Bob Brown",
     team: "Team Pramod",
     category: "Pre-Coding Review",
     date: "2025-10-01",
     count: 1,
   },
   {
     id: 5,
     person: "Charlie Wilson",
     team: "Team Pramod",
     category: "Rushil",
     date: "2025-10-03",
     count: 4,
   },
   {
     id: 6,
     person: "David Lee",
     team: "Team Pramod",
     category: "Need NOC",
     date: "2025-10-04",
     count: 2,
   },
   {
     id: 7,
     person: "Emma Davis",
     team: "Team Pramod",
     category: "Coding Completed",
     date: "2025-10-04",
     count: 2,
   },
   {
     id: 8,
     person: "Frank Harris",
     team: "Team Pramod",
     category: "Need Eval",
     date: "2025-10-02",
     count: 3,
   },
   {
     id: 9,
     person: "Grace Clark",
     team: "Team Pramod",
     category: "High Priority",
     date: "2025-10-03",
     count: 5,
   },
   {
     id: 10,
     person: "Henry Lewis",
     team: "Team Pramod",
     category: "Dx Verify",
     date: "2025-10-05",
     count: 1,
   },
   {
     id: 11,
     person: "Isla Martin",
     team: "Team Pramod",
     category: "Medication Queries",
     date: "2025-10-02",
     count: 3,
   },
   {
     id: 12,
     person: "Jack Thompson",
     team: "Team Pramod",
     category: "Missing Chart Info",
     date: "2025-10-03",
     count: 2,
   },
   {
     id: 13,
     person: "Karen Walker",
     team: "Team Pramod",
     category: "Clerical Follow up",
     date: "2025-10-04",
     count: 3,
   },
   {
     id: 14,
     person: "Liam Scott",
     team: "Team Pramod",
     category: "Orders/Foley and Other Notes",
     date: "2025-10-05",
     count: 2,
   },
   {
     id: 15,
     person: "Mia Baker",
     team: "Team Pramod",
     category: "Patient Discharged",
     date: "2025-10-05",
     count: 4,
   },
   {
     id: 16,
     person: "Noah Hill",
     team: "Team Pramod",
     category: "Vinod's Open",
     date: "2025-10-03",
     count: 1,
   },
   {
     id: 17,
     person: "Olivia Scott",
     team: "Team Pramod",
     category: "Rushil",
     date: "2025-10-04",
     count: 3,
   },
   {
     id: 18,
     person: "Paul Green",
     team: "Team Pramod",
     category: "Ready for Vinod",
     date: "2025-10-05",
     count: 2,
   },

   // Team Shijo - 18 users covering all categories
   {
     id: 19,
     person: "Ivy Walker",
     team: "Team Shijo",
     category: "Vinod's Open",
     date: "2025-10-01",
     count: 2,
   },
   {
     id: 20,
     person: "Jack Hall",
     team: "Team Shijo",
     category: "Under QA",
     date: "2025-10-02",
     count: 5,
   },
   {
     id: 21,
     person: "Karen Allen",
     team: "Team Shijo",
     category: "Ready for Vinod",
     date: "2025-10-03",
     count: 3,
   },
   {
     id: 22,
     person: "Liam Young",
     team: "Team Shijo",
     category: "Pre-Coding Review",
     date: "2025-10-03",
     count: 3,
   },
   {
     id: 23,
     person: "Mia King",
     team: "Team Shijo",
     category: "Rushil",
     date: "2025-10-04",
     count: 1,
   },
   {
     id: 24,
     person: "Noah Wright",
     team: "Team Shijo",
     category: "Need NOC",
     date: "2025-10-05",
     count: 4,
   },
   {
     id: 25,
     person: "Olivia Scott",
     team: "Team Shijo",
     category: "Coding Completed",
     date: "2025-10-03",
     count: 2,
   },
   {
     id: 26,
     person: "Paul Green",
     team: "Team Shijo",
     category: "Need Eval",
     date: "2025-10-05",
     count: 5,
   },
   {
     id: 27,
     person: "Quinn Baker",
     team: "Team Shijo",
     category: "High Priority",
     date: "2025-10-02",
     count: 2,
   },
   {
     id: 28,
     person: "Rachel Adams",
     team: "Team Shijo",
     category: "Dx Verify",
     date: "2025-10-04",
     count: 3,
   },
   {
     id: 29,
     person: "Steve Bennett",
     team: "Team Shijo",
     category: "Medication Queries",
     date: "2025-10-02",
     count: 2,
   },
   {
     id: 30,
     person: "Tina Foster",
     team: "Team Shijo",
     category: "Missing Chart Info",
     date: "2025-10-05",
     count: 3,
   },
   {
     id: 31,
     person: "Uma Carter",
     team: "Team Shijo",
     category: "Clerical Follow up",
     date: "2025-10-04",
     count: 3,
   },
   {
     id: 32,
     person: "Victor Hughes",
     team: "Team Shijo",
     category: "Orders/Foley and Other Notes",
     date: "2025-10-05",
     count: 4,
   },
   {
     id: 33,
     person: "Wendy Price",
     team: "Team Shijo",
     category: "Patient Discharged",
     date: "2025-10-02",
     count: 2,
   },
   {
     id: 34,
     person: "Xena Turner",
     team: "Team Shijo",
     category: "Vinod's Open",
     date: "2025-10-03",
     count: 1,
   },
   {
     id: 35,
     person: "Yusuf Collins",
     team: "Team Shijo",
     category: "Rushil",
     date: "2025-10-04",
     count: 3,
   },
   {
     id: 36,
     person: "Zoe Edwards",
     team: "Team Shijo",
     category: "Ready for Vinod",
     date: "2025-10-05",
     count: 2,
   },

   // Team Amira - 18 users covering all categories
   {
     id: 37,
     person: "Aaron Morgan",
     team: "Team Amira",
     category: "Vinod's Open",
     date: "2025-10-01",
     count: 2,
   },
   {
     id: 38,
     person: "Bella Rogers",
     team: "Team Amira",
     category: "Under QA",
     date: "2025-10-02",
     count: 5,
   },
   {
     id: 39,
     person: "Cody Sanders",
     team: "Team Amira",
     category: "Ready for Vinod",
     date: "2025-10-03",
     count: 3,
   },
   {
     id: 40,
     person: "Diana Hunt",
     team: "Team Amira",
     category: "Pre-Coding Review",
     date: "2025-10-03",
     count: 3,
   },
   {
     id: 41,
     person: "Ethan Cole",
     team: "Team Amira",
     category: "Rushil",
     date: "2025-10-04",
     count: 1,
   },
   {
     id: 42,
     person: "Fiona Price",
     team: "Team Amira",
     category: "Need NOC",
     date: "2025-10-05",
     count: 4,
   },
   {
     id: 43,
     person: "George Foster",
     team: "Team Amira",
     category: "Coding Completed",
     date: "2025-10-03",
     count: 2,
   },
   {
     id: 44,
     person: "Hannah Bell",
     team: "Team Amira",
     category: "Need Eval",
     date: "2025-10-05",
     count: 5,
   },
   {
     id: 45,
     person: "Ian Cooper",
     team: "Team Amira",
     category: "High Priority",
     date: "2025-10-02",
     count: 2,
   },
   {
     id: 46,
     person: "Julia Gray",
     team: "Team Amira",
     category: "Dx Verify",
     date: "2025-10-04",
     count: 3,
   },
   {
     id: 47,
     person: "Kevin James",
     team: "Team Amira",
     category: "Medication Queries",
     date: "2025-10-02",
     count: 2,
   },
   {
     id: 48,
     person: "Laura Knight",
     team: "Team Amira",
     category: "Missing Chart Info",
     date: "2025-10-05",
     count: 3,
   },
   {
     id: 49,
     person: "Michael Ross",
     team: "Team Amira",
     category: "Clerical Follow up",
     date: "2025-10-04",
     count: 3,
   },
   {
     id: 50,
     person: "Nina Perez",
     team: "Team Amira",
     category: "Orders/Foley and Other Notes",
     date: "2025-10-05",
     count: 4,
   },
   {
     id: 51,
     person: "Oscar Diaz",
     team: "Team Amira",
     category: "Patient Discharged",
     date: "2025-10-02",
     count: 2,
   },
   {
     id: 52,
     person: "Paula Hall",
     team: "Team Amira",
     category: "Vinod's Open",
     date: "2025-10-03",
     count: 1,
   },
   {
     id: 53,
     person: "Quentin Lee",
     team: "Team Amira",
     category: "Rushil",
     date: "2025-10-04",
     count: 3,
   },
   {
     id: 54,
     person: "Rachel White",
     team: "Team Amira",
     category: "Ready for Vinod",
     date: "2025-10-05",
     count: 2,
   },
 ];





  const [startDate, setStartDate] = useState("2025-10-01");
  const [endDate, setEndDate] = useState("2025-10-08");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const viewMode = useMemo((): "person" | "team" => {
    return selectedTeam ? "person" : "team";
  }, [selectedTeam]);

  const teamOptions = useMemo(() => {
    const teams = [...new Set(rawData.map((item) => item.team))];
    return teams.map((team) => ({
      label: team,
      value: team,
    })) as SelectOption[];
  }, [rawData]);

  const categoryOptions = useMemo(() => {
    const categories = [...new Set(rawData.map((item) => item.category))];
    return categories.map((category) => ({
      label: category,
      value: category,
    })) as SelectOption[];
  }, [rawData]);

  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const itemDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateMatch = itemDate >= start && itemDate <= end;
      const categoryMatch =
        !selectedCategory || item.category === selectedCategory;
      const teamMatch = !selectedTeam || item.team === selectedTeam;
      return dateMatch && categoryMatch && teamMatch;
    });
  }, [rawData, startDate, endDate, selectedCategory, selectedTeam]);

  const allCategories = useMemo(() => {
    return [...new Set(filteredData.map((item) => item.category))];
  }, [filteredData]);

  const personData = useMemo(() => {
    const aggregated: { [key: string]: RowData } = {};

    filteredData.forEach((item) => {
      if (!aggregated[item.person]) {
        aggregated[item.person] = {
          name: item.person,
          team: item.team,
          total: 0,
        };
      }
      aggregated[item.person].total += item.count;

      if (!aggregated[item.person][item.category]) {
        aggregated[item.person][item.category] = 0;
      }
      aggregated[item.person][item.category] =
        (aggregated[item.person][item.category] as number) + item.count;
    });

    return Object.values(aggregated).sort(
      (a, b) => (b.total as number) - (a.total as number)
    ) as RowData[];
  }, [filteredData]);

  const teamData = useMemo(() => {
    const aggregated: { [key: string]: RowData } = {};

    filteredData.forEach((item) => {
      if (!aggregated[item.team]) {
        aggregated[item.team] = {
          name: item.team,
          total: 0,
        };
      }
      aggregated[item.team].total += item.count;

      if (!aggregated[item.team][item.category]) {
        aggregated[item.team][item.category] = 0;
      }
      aggregated[item.team][item.category] =
        (aggregated[item.team][item.category] as number) + item.count;
    });

    return Object.values(aggregated).sort(
      (a, b) => (b.total as number) - (a.total as number)
    ) as RowData[];
  }, [filteredData]);

  const currentData = viewMode === "person" ? personData : teamData;

  const getHeatClass = (value: number) => {
    if (value === 0) return "bg-gray-50 dark:bg-gray-800";
    if (value <= 1) return "bg-brand-50 dark:bg-brand-400";
    if (value <= 2) return "bg-brand-300 dark:bg-brand-500";
    if (value <= 3) return "bg-brand-400 dark:bg-brand-600";
    if (value <= 5) return "bg-brand-500 dark:bg-brand-700";
    return "bg-brand-600 dark:bg-brand-800";
  };

  const heatTextClass = "text-gray-900 dark:text-gray-100";

  return (
    <div>
      <div className="space-y-6">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-full">
              <SearchableSelect
                dataProps={{
                  optionData: teamOptions?.map((opt) => ({
                    _id: opt.value,
                    name: opt.label,
                  })) as SelectItem[],
                }}
                selectionProps={{
                  selectedValue: selectedTeam
                    ? { _id: selectedTeam, name: selectedTeam }
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
                  onChange: (selected: SelectItem | null) => {
                    setSelectedTeam(selected ? selected._id : null);
                  },
                }}
              />
            </div>

            <div className="w-full">
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

            <div className="w-full">
              <SearchableSelect
                dataProps={{
                  optionData: categoryOptions?.map((opt) => ({
                    _id: opt.value,
                    name: opt.label,
                  })) as SelectItem[],
                }}
                selectionProps={{
                  selectedValue: selectedCategory
                    ? { _id: selectedCategory, name: selectedCategory }
                    : null,
                }}
                displayProps={{
                  placeholder: "Select category...",
                  id: "category",
                  isClearable: true,
                  layoutProps: {
                    className: "w-full",
                  },
                }}
                eventHandlers={{
                  onChange: (selected: SelectItem | null) => {
                    setSelectedCategory(selected ? selected._id : null);
                  },
                }}
              />
            </div>

            <Button variant="outline" className="md:w-full max-w-[200px]">
              Download Data
              <DownloadIcon />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white  dark:bg-white/[0.03] rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Total Errors
            </h3>
            <p className="text-3xl font-bold text-brand-600">
              {filteredData.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="bg-white dark:bg-white/[0.03] rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              {viewMode === "person" ? "People Tracked" : "Teams Tracked"}
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {currentData.length}
            </p>
          </div>
          <div className="bg-white dark:bg-white/[0.03] rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Error Categories
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {allCategories.length}
            </p>
          </div>
          <div className="bg-white dark:bg-white/[0.03] rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              Avg Errors/Entity
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {currentData.length > 0
                ? Math.round(
                    filteredData.reduce((sum, item) => sum + item.count, 0) /
                      currentData.length
                  )
                : 0}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Grid3x3 className="w-6 h-6" />
            Heatmap: Hold Reason Intensity by Category
          </h2>

          <div className="overflow-x-auto">
            <div className="min-w-max relative pb-3">
              <div className="flex mb-2 sticky top-0 bg-white dark:bg-gray-800 z-20 border-b border-gray-200 dark:border-gray-600">
                <div className="w-40 sticky left-0 bg-white dark:bg-gray-800 z-20 pr-2 flex items-center border-r border-gray-200 dark:border-gray-600"></div>
                {allCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="ml-3 w-24 text-xs font-medium text-gray-900 dark:text-gray-100 text-center truncate px-1 py-2">
                    {cat}
                  </div>
                ))}
              </div>
              {currentData.map((item: RowData, rowIdx: number) => (
                <div key={rowIdx} className="flex mb-1">
                  <div className="pl-3 w-40 text-sm font-medium text-gray-900 dark:text-gray-100 pr-2 truncate flex items-center sticky left-0 z-10 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600">
                    {item.name}
                  </div>
                  {allCategories.map((cat, colIdx) => {
                    const value = (item[cat] as number) || 0;
                    return (
                      <div
                        key={colIdx}
                        className={`ml-3 w-24 h-12 mx-px flex items-center justify-center text-sm font-bold rounded ${heatTextClass}`}
                        title={`${item.name} - ${cat}: ${value}`}>
                        <div
                          className={`w-full h-full rounded ${getHeatClass(
                            value
                          )} flex items-center justify-center`}>
                          {value > 0 ? value : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <CategoryDistribution data={filteredData} />
      </div>
    </div>
  );
}
