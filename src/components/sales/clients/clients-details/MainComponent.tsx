"use client";

import CommonTable from "@/components/common/CommonTable";
import TableFooter from "@/components/common/TableFooter";
import { useModal } from "@/hooks/useModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import React, { useState, useMemo } from "react";
import Button from "@/components/ui/button/Button";
import { formatINR, formatUSD, convertINRtoUSD } from "@/utils/formatCurrency";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ClientModal from "../modals/ClientModal";

// Mock client data - replace with actual API call
const mockClientData = {
  _id: "CLT001",
  clientName: "Acme Corporation",
  businessName: "Acme Corp Ltd.",
  industry: "Technology",
  countryCode: "US",
  country: "🇺🇸 United States",
  cityTown: "San Francisco",
  email: "contact@acmecorp.com",
  phone: "+1 (555) 123-4567",
  website: "www.acmecorp.com",
  status: "Active",
  vatNumber: "US123456789",
  addressLine1: "123 Tech Street",
  addressLine2: "Suite 500",
  state: "California",
  zipCode: "94105",
  clientType: "company",
  logo: null,
};

// Mock transactions data
const mockTransactions = [
  {
    _id: "TXN001",
    date: "2025-01-15",
    reason: "Invoice #INV-2025-001 Payment",
    debitAmount: null,
    creditAmount: 5000.0,
    updatedBalance: 5000.0,
  },
  {
    _id: "TXN002",
    date: "2025-01-20",
    reason: "Service Charge - January 2025",
    debitAmount: 1200.0,
    creditAmount: null,
    updatedBalance: 3800.0,
  },
  {
    _id: "TXN003",
    date: "2025-01-25",
    reason: "Invoice #INV-2025-002 Payment",
    debitAmount: null,
    creditAmount: 3500.0,
    updatedBalance: 7300.0,
  },
  {
    _id: "TXN004",
    date: "2025-02-01",
    reason: "Refund for Invoice #INV-2025-001",
    debitAmount: 500.0,
    creditAmount: null,
    updatedBalance: 6800.0,
  },
  {
    _id: "TXN005",
    date: "2025-02-05",
    reason: "Invoice #INV-2025-003 Payment",
    debitAmount: null,
    creditAmount: 2200.0,
    updatedBalance: 9000.0,
  },
];

export default function MainComponent() {
  const params = useParams();
  const clientId = params?.id;

  const [clientData] = useState<any>(mockClientData);
  const [transactionsData] = useState<any>({
    totalRecords: mockTransactions.length,
    Transactions: mockTransactions,
  });

  const initParams = {
    search: "",
    page: 1,
    limit: 10,
  };

  const [transactionParams, setTransactionParams] = useState<any>(initParams);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [modalType, setModalType] = useState<any>("");

  const mainModal = useModal();

  const totalPages = Math.ceil(
    transactionsData?.totalRecords / transactionParams?.limit
  );
  const startIndex = (transactionParams?.page - 1) * transactionParams?.limit;
  const endIndex = Math.min(
    startIndex + transactionParams?.limit,
    transactionsData?.totalRecords
  );

  // Calculate totals
  const totals = useMemo(() => {
    const transactions = transactionsData?.Transactions || [];
    const totalDebit = transactions.reduce(
      (sum: number, item: any) => sum + (item.debitAmount || 0),
      0
    );
    const totalCredit = transactions.reduce(
      (sum: number, item: any) => sum + (item.creditAmount || 0),
      0
    );
    const finalBalance = totalCredit - totalDebit;

    return {
      totalDebit: totalDebit.toFixed(2),
      totalCredit: totalCredit.toFixed(2),
      finalBalance: finalBalance.toFixed(2),
    };
  }, [transactionsData]);

  const getTransactions = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const res = await {
        page: params?.page ?? transactionParams?.page,
        limit: params?.limit ?? transactionParams?.limit,
        search: params?.search ?? transactionParams?.search,
      };
      console.log("🚀 ~ getTransactions ~ res:", res);

      // setTransactionsData(res);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setTransactionParams((prev: any) => ({ ...prev, page: page }));
    await getTransactions({ page });
  };

  const handleRowsPerPageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setTransactionParams((prev: any) => ({
      ...prev,
      page: 1,
      limit: newRowsPerPage,
    }));
    await getTransactions({ page: 1, limit: newRowsPerPage });
  };

  const formatCurrencyDisplay = (amount: number | null) => {
    if (amount === null || amount === undefined) return "-";
    return formatINR(amount);
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
      label: "Reason",
      render: (item: any) => (
        <p className="text-gray-800 dark:text-gray-200">{item?.reason}</p>
      ),
    },
    {
      label: "Debit (-)",
      render: (item: any) => (
        <div className="text-red-600 dark:text-red-400">
          {item?.debitAmount ? (
            <>
              <p className="font-semibold">{formatINR(item.debitAmount)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ({formatUSD(convertINRtoUSD(item.debitAmount))})
              </p>
            </>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      label: "Credit (+)",
      render: (item: any) => (
        <div className="text-green-600 dark:text-green-400">
          {item?.creditAmount ? (
            <>
              <p className="font-semibold">{formatINR(item.creditAmount)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ({formatUSD(convertINRtoUSD(item.creditAmount))})
              </p>
            </>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      label: "Updated Balance",
      render: (item: any) => (
        <p
          className={`font-bold ${
            item?.updatedBalance >= 0
              ? "text-gray-800 dark:text-gray-200"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatCurrencyDisplay(item?.updatedBalance)}
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {clientData?.clientName || clientData?.businessName}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/clients/${clientId}/ledger`}>
              <Button size="sm" variant="gradient">
                <ExternalLink className="h-5 w-5 text-gray-200 shrink-0" />
                View Ledger Statement
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedClient(null);
                setModalType("edit");
                mainModal.openModal();
              }}
            >
              <PencilIcon />
              Edit Client
            </Button>
            <Button
              size="sm"
              variant="error"
              onClick={() => {
                setSelectedClient(mockClientData);
                setModalType("delete");
                mainModal.openModal();
              }}
            >
              <TrashBinIcon />
              Delete Client
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 p-4">
        <CommonTable
          headers={headers}
          data={transactionsData?.Transactions || []}
          loading={loading}
        />

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Balance:
              </p>
              <p
                className={`text-3xl font-bold mb-1 ${
                  parseFloat(totals.finalBalance) >= 0
                    ? "text-gray-800 dark:text-gray-200"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatINR(parseFloat(totals.finalBalance))}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ({formatUSD(convertINRtoUSD(parseFloat(totals.finalBalance)))})
              </p>
            </div>
          </div>
        </div>

        <TableFooter
          rowsPerPage={transactionParams?.limit}
          handleRowsPerPageChange={handleRowsPerPageChange}
          currentPage={transactionParams?.page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          totalEntries={transactionsData?.totalRecords}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>
      <ClientModal
        isOpen={mainModal.isOpen}
        closeModal={mainModal.closeModal}
        modelType={modalType}
        setModelType={setModalType}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
      />
    </div>
  );
}
