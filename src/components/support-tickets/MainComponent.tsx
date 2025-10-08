"use client";
import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Circle,
  Paperclip,
  ChevronRight,
  X,
} from "lucide-react";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import TableFooter from "../common/TableFooter";
import Link from "next/link";
import Search from "../common/Search";
import FilterModal from "../common/filter/FilterModal";
import FilterButton from "../common/filter/FilterButton";
import FilterAndSortPills from "../common/filter/FilterAndSortPills";
import { mockTickets } from "@/app/(admin)/(others-pages)/support-tickets/mock-data";

export function TicketList() {
  const [ticketsData] = useState<any>(mockTickets || null);
  const initParams = {
    search: "",
    page: 1,
    limit: 10,
    status: "",
    categoryId: "",
  };
  const [params, setParams] = useState(initParams);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const totalEntries = ticketsData?.length || 0;
  const startIndex = (params?.page - 1) * params?.limit;
  const endIndex = Math.min(startIndex + params?.limit, totalEntries);
  const totalPages = Math.ceil(totalEntries / params?.limit);

  const [categoriesList] = useState([]);

  const getCategoriesList = async () => {
    try {
      //   const res = await axios.get(`ticket-categories`, { adminURL: true });
      //   const data = res?.data?.Response?.Categories;
      //   setCategoriesList(data);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current === false) {
      initRef.current = true;
      getCategoriesList();
    }
  }, []);

  const handlePageChange = async (page: number) => {
    if (page >= 1 && page <= totalPages) {
      await setParams((p) => ({ ...p, page }));
      //   await getTasks({ page });
    }
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    await setParams((p) => ({ ...p, page: 1, limit: newRowsPerPage }));
    // await getTasks({ page: 1, limit: newRowsPerPage });
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    await setParams((p) => ({ ...p, search: value }));

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      //   getTasks({ page: 1, search: value });
      setParams((p) => ({ ...p, page: 1 }));
    }, 1000);
  };

  const hasActiveFilters = () => {
    const filters = {
      search: params?.search,
      status: params?.status,
      categoryId: params?.categoryId,
    };
    const isFilterActive = Object.values(filters).some((val) => !!val);
    const isPaginationChanged = params?.limit !== 10;

    return isFilterActive || isPaginationChanged;
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...params, [key]: "" };
    setParams(newFilters);
  };

  const handleRemoveAllFilters = async () => {
    setParams(initParams);
  };

  const handleApplyFilters = async (appliedFilters: any) => {
    await setParams(appliedFilters);
    setIsFilterModalOpen(false);
  };

  const formatLastReply = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Circle className="h-3 w-3" />;
      case "in-progress":
        return <AlertCircle className="h-3 w-3" />;
      case "resolved":
        return <CheckCircle2 className="h-3 w-3" />;
      case "closed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "Open":
        return <Circle className="h-3 w-3" />;
      case "In Progress":
        return <AlertCircle className="h-3 w-3" />;
      case "Resolved":
        return <CheckCircle2 className="h-3 w-3" />;
      case "Closed":
        return <CheckCircle2 className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "primary";
      case "in-progress":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "fog";
      case "Open":
        return "primary";
      case "In Progress":
        return "warning";
      case "Resolved":
        return "success";
      case "Closed":
        return "fog";
      default:
        return "dusk";
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b bg-white dark:bg-white/[0.03] dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            My Conversations
          </h2>
          <Badge variant="light" color="success">
            {ticketsData?.length} total
          </Badge>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
          <Search
            className="w-full md:w-[300px]"
            placeholder="Search tickets..."
            value={params?.search}
            onChange={handleSearch}
          />
          <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:gap-3 md:w-auto">
            {hasActiveFilters() && (
              <Button
                variant="outline"
                onClick={handleRemoveAllFilters}
                className="flex items-center gap-1 whitespace-nowrap">
                <X className="h-4 w-4" />
                <span>Clear all filters</span>
              </Button>
            )}
            <div className="flex flex-row items-center gap-2 w-full md:w-auto">
              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                title="Filter Support Tickets"
                description="Filter support tickets based on your criteria"
                filters={[
                  {
                    key: "status",
                    label: "Status",
                    options: [
                      { value: "open", label: "Open" },
                      { value: "in-progress", label: "In Progress" },
                      { value: "resolved", label: "Resolved" },
                    ],
                  },
                  {
                    key: "categoryId",
                    label: "Category",
                    options:
                      categoriesList?.map((item: any) => ({
                        value: item?._id,
                        label: item?.name,
                      })) || [],
                  },
                ]}
                filterValues={params as any}
                onFilterChange={(key, value) => {
                  setParams((prev) => ({ ...prev, [key]: value }));
                }}
                onApply={handleApplyFilters}
                className="max-w-[600px]"
              />
              <FilterButton
                onClick={() => setIsFilterModalOpen(true)}
                className="w-full md:w-auto"
              />
            </div>
          </div>
        </div>
        <FilterAndSortPills
          filters={params}
          onRemoveFilter={handleRemoveFilter}
        />
      </div>

      <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        {ticketsData?.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No conversations found</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {ticketsData?.map((ticket: any) => (
                <Link
                  key={ticket._id || ticket.id}
                  href={`/support-tickets/${ticket?._id || ticket.id}`}>
                  <div
                    className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 cursor-pointer group transition-all duration-200 hover:shadow-md hover:scale-[1.01] rounded-xl`}>
                    <div className="p-4 h-full">
                      <div className="text-gray-600 dark:text-white/70 h-full flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex flex-wrap gap-3">
                            <Badge
                              variant={"light"}
                              color={getStatusColor(ticket.status)}>
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1 capitalize">
                                {ticket.status.replace("-", " ")}
                              </span>
                            </Badge>
                            <Badge variant="light" color={"light"}>
                              {ticket?.category}
                            </Badge>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:!text-brand-500 group-hover:translate-x-1 transition-all duration-200" />
                        </div>

                        <div className="h-full min-w-0 flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <h3
                              className={`font-semibold text-xl text-black dark:text-foreground leading-tight group-hover:text-brand-500 dark:group-hover:text-brand-500 transition-colors duration-200`}>
                              {ticket.subject}
                            </h3>
                            {ticket.hasUnreadReplies && (
                              <div className="h-2 w-2 bg-brand-500 rounded-full animate-pulse-glow" />
                            )}
                          </div>
                          <p className="text-sm dark:text-foreground line-clamp-2">
                            {ticket?.description}
                          </p>

                          <div className="grow"></div>
                          <div className="flex items-center justify-between gap-2 mt-4 pt-2 text-xs border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="flex items-center">
                                {ticket.hasAttachments && (
                                  <Paperclip className="h-3 w-3 mr-2" />
                                )}
                                <MessageSquare className="h-3 w-3 mr-1" />
                                <span>{ticket.totalComments}</span>
                              </div>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatLastReply(ticket.updatedAt)}
                              </span>
                            </div>

                            <span className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
                              #{ticket.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <TableFooter
              rowsPerPage={params?.limit}
              handleRowsPerPageChange={handleRowsPerPageChange}
              currentPage={params?.page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              totalEntries={totalEntries}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          </>
        )}
      </div>
    </div>
  );
}
