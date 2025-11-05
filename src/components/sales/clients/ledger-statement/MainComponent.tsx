"use client";

import CommonTable from "@/components/common/CommonTable";
import TableFooter from "@/components/common/TableFooter";
import React, { useState, useMemo } from "react";
import Button from "@/components/ui/button/Button";
import { convertINRtoUSD, formatINR, formatUSD } from "@/utils/formatCurrency";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactDatePicker from "@/components/common/DateRangePicker";
import SearchableSelect from "@/components/form/SearchableSelect";
import Label from "@/components/form/Label";

// Mock client data
const mockClientData = {
  _id: "CLT001",
  clientName: "MERCEDES IVONNET GALBAN",
  addressLine1: "1702 fern st Tampa FL 33604",
  country: "United States of America (USA)",
};

// Financial years
const financialYears = [
  { _id: "FY2025-2026", name: "FY 2025-2026", value: "FY2025-2026" },
  { _id: "FY2024-2025", name: "FY 2024-2025", value: "FY2024-2025" },
  { _id: "FY2023-2024", name: "FY 2023-2024", value: "FY2023-2024" },
];

// Mock ledger transactions
const mockLedgerTransactions = [
  {
    _id: "TXN001",
    date: "2025-04-01",
    transaction: "Opening Balance",
    remarks: "-",
    credit: 0,
    debit: 0,
    balance: 0,
    balanceType: "CR",
  },
  {
    _id: "TXN002",
    date: "2025-10-17",
    transaction: "Invoice Voucher Book",
    remarks: "Invoice A00074 - Invoice A00074 for MERCEDES IVONNET GALBAN .",
    credit: 0,
    debit: 53938.67,
    balance: 53938.67,
    balanceType: "Dr",
  },
  {
    _id: "TXN003",
    date: "2025-03-31",
    transaction: "Closing Balance",
    remarks: "-",
    credit: 0,
    debit: 53938.67,
    balance: 53938.67,
    balanceType: "Dr",
  },
];

export default function MainComponent() {
  const params = useParams();
  const clientId = params?.id;

  const [clientData] = useState<any>(mockClientData);
  const [ledgerData, setLedgerData] = useState<any>({
    totalRecords: mockLedgerTransactions.length,
    Transactions: mockLedgerTransactions,
  });
  console.log("🚀 ~ MainComponent ~ setLedgerData:", setLedgerData);

  const initParams = {
    dateStart: null,
    dateEnd: null,
    financialYear: "FY2025-2026",
    page: 1,
    limit: 10,
  };

  const [filterParams, setFilterParams] = useState<any>(initParams);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(ledgerData?.totalRecords / filterParams?.limit);
  const startIndex = (filterParams?.page - 1) * filterParams?.limit;
  const endIndex = Math.min(
    startIndex + filterParams?.limit,
    ledgerData?.totalRecords
  );

  // Calculate opening and closing balance
  const { openingBalance, closingBalance } = useMemo(() => {
    const transactions = ledgerData?.Transactions || [];
    const opening =
      transactions.find((t: any) => t.transaction === "Opening Balance") || {};
    const closing =
      transactions.find((t: any) => t.transaction === "Closing Balance") || {};

    return {
      openingBalance: {
        amount: opening.balance || 0,
        type: opening.balanceType || "CR",
      },
      closingBalance: {
        amount: closing.balance || 0,
        type: closing.balanceType || "Dr",
      },
    };
  }, [ledgerData]);

  const getLedgerData = async (params?: {
    page?: number;
    limit?: number;
    dateStart?: string;
    dateEnd?: string;
    financialYear?: string;
  }) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const res = await {
        page: params?.page ?? filterParams?.page,
        limit: params?.limit ?? filterParams?.limit,
        dateStart: params?.dateStart ?? filterParams?.dateStart,
        dateEnd: params?.dateEnd ?? filterParams?.dateEnd,
        financialYear: params?.financialYear ?? filterParams?.financialYear,
      };
      console.log("🚀 ~ getLedgerData ~ res:", res);

      // setLedgerData(res);
    } catch (err) {
      console.error("Failed to fetch ledger data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setFilterParams((prev: any) => ({ ...prev, page: page }));
    await getLedgerData({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setFilterParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getLedgerData({ page: 1, limit: newRowsPerPage });
  };

  const handleApplyFilters = () => {
    getLedgerData({
      dateStart: filterParams.dateStart,
      dateEnd: filterParams.dateEnd,
      financialYear: filterParams.financialYear,
      page: 1,
    });
  };

  const headers = [
    {
      label: "Date",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200 font-medium">
          {new Date(item?.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      ),
    },
    {
      label: "Transaction",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200 font-medium">
          {item?.transaction}
        </p>
      ),
    },
    {
      label: "Remarks",
      render: (item: any) => (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {item?.remarks}
        </p>
      ),
    },
    {
      label: "Credit",
      render: (item: any) => (
        <div className="text-gray-800 dark:text-gray-200">
          {item?.credit > 0 ? (
            <p className="font-semibold">{formatINR(item.credit)}</p>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      label: "Debit",
      render: (item: any) => (
        <div className="text-red-600 dark:text-red-400">
          {item?.debit ? (
            <>
              <p className="font-semibold">{formatINR(item.debit)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ({formatUSD(convertINRtoUSD(item.debit))})
              </p>
            </>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      label: "Balance",
      render: (item: any) => (
        <div className="text-gray-800 dark:text-gray-200">
          <p className="font-bold">
            {formatINR(item?.balance)}{" "}
            {/* <span
              className={`text-xs font-semibold ml-1 ${
                item?.balanceType === "Dr"
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {item?.balanceType}
            </span> */}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Link href={`/clients/${clientId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-700 dark:bg-gray-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {clientData?.clientName?.charAt(0) || "M"}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
                  {clientData?.clientName}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {clientData?.addressLine1} {clientData?.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label>Select Financial Year</Label>
            <SearchableSelect
              dataProps={{
                optionData: financialYears.map((fy) => ({
                  _id: fy._id,
                  name: fy.name,
                })),
              }}
              selectionProps={{
                selectedValue: filterParams.financialYear
                  ? {
                      _id: filterParams.financialYear,
                      value: filterParams.financialYear,
                      label:
                        financialYears.find(
                          (fy) => fy.value === filterParams.financialYear
                        )?.name || "",
                    }
                  : null,
              }}
              displayProps={{
                placeholder: "Select Financial Year",
                isClearable: false,
              }}
              eventHandlers={{
                onChange: (option: any) => {
                  setFilterParams((prev: any) => ({
                    ...prev,
                    financialYear: option?.value || "",
                  }));
                },
                onDropdownClose: () => {},
              }}
            />
          </div>

          <div>
            <Label>Select Date Range</Label>
            <ReactDatePicker
              formData={filterParams}
              setFormData={setFilterParams}
              isFilter={true}
            />
          </div>

          <div>
            <Button
              onClick={handleApplyFilters}
              className="w-full md:w-auto px-8"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Summary{" "}
            <span className="text-xs text-gray-500">Figures are in INR</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Opening Balance
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {formatINR(openingBalance.amount)}{" "}
                {/* <Badge
                  variant="light"
                  color={openingBalance.type === "Dr" ? "error" : "success"}
                  className="ml-2"
                >
                  {openingBalance.type}
                </Badge> */}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <svg
                className="h-6 w-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Closing Balance
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {formatINR(closingBalance.amount)}{" "}
                {/* <Badge
                  variant="light"
                  color={closingBalance.type === "Dr" ? "error" : "success"}
                  className="ml-2"
                >
                  {closingBalance.type}
                </Badge> */}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Count */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {Math.min(endIndex, ledgerData?.totalRecords)}
            </span>{" "}
            Lineitems of{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {ledgerData?.totalRecords}
            </span>{" "}
            Lineitems
          </p>
        </div>

        <CommonTable
          headers={headers}
          data={ledgerData?.Transactions || []}
          loading={loading}
        />

        <TableFooter
          rowsPerPage={filterParams?.limit}
          handleRowsPerPageChange={handleRowsPerPageChange}
          currentPage={filterParams?.page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          totalEntries={ledgerData?.totalRecords}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>
    </div>
  );
}
