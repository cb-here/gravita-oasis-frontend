import { useState } from "react";
import { AlertTriangleIcon, DownloadIcon, FilterIcon, SearchIcon, XCircleIcon } from "lucide-react";

// Error data interface
interface BulkError {
  row?: number;
  row_number?: number;
  mrn_no?: string;
  patient_name?: string;
  failed_field?: string;
  column?: string;
  failed_reason?: string;
  reason?: string;
  [key: string]: any; // Allow for additional fields
}

interface BulkLogErrorDetailsProps {
  errors: BulkError[];
  isLoading?: boolean;
  onExportErrors?: (filteredErrors: BulkError[]) => void;
}

// Sample error data for demonstration
export const sampleErrorData: BulkError[] = [
  {
    row: 1,
    mrn_no: "MRN001",
    patient_name: "John Smith",
    failed_field: "date_of_birth",
    failed_reason: "Invalid date format. Expected YYYY-MM-DD"
  },
  {
    row: 2,
    mrn_no: "MRN002",
    patient_name: "Sarah Johnson",
    failed_field: "email",
    failed_reason: "Email address is required"
  },
  {
    row: 3,
    mrn_no: "MRN003",
    patient_name: "Michael Brown",
    failed_field: "phone_number",
    failed_reason: "Phone number must be 10 digits"
  },
  {
    row: 4,
    mrn_no: "MRN004",
    patient_name: "Emily Davis",
    failed_field: "insurance_id",
    failed_reason: "Insurance ID not found in system"
  },
  {
    row: 5,
    mrn_no: "MRN005",
    patient_name: "Robert Wilson",
    failed_field: "date_of_birth",
    failed_reason: "Patient must be at least 18 years old"
  },
  {
    row: 6,
    mrn_no: "MRN006",
    patient_name: "Lisa Anderson",
    failed_field: "email",
    failed_reason: "Email domain not recognized"
  },
  {
    row: 7,
    mrn_no: "MRN007",
    patient_name: "David Miller",
    failed_field: "phone_number",
    failed_reason: "Duplicate phone number found"
  },
  {
    row: 8,
    mrn_no: "MRN008",
    patient_name: "Jennifer Taylor",
    failed_field: "insurance_id",
    failed_reason: "Insurance plan is expired"
  },
  {
    row: 9,
    mrn_no: "MRN009",
    patient_name: "James Martinez",
    failed_field: "date_of_birth",
    failed_reason: "Future date not allowed"
  },
  {
    row: 10,
    mrn_no: "MRN010",
    patient_name: "Amanda White",
    failed_field: "email",
    failed_reason: "Invalid email format"
  },
  {
    row: 11,
    mrn_no: "MRN011",
    patient_name: "Christopher Lee",
    failed_field: "phone_number",
    failed_reason: "International numbers not supported"
  },
  {
    row: 12,
    mrn_no: "MRN012",
    patient_name: "Michelle Harris",
    failed_field: "insurance_id",
    failed_reason: "Required field missing"
  }
];

// Common error field mappings for consistent display
const errorFieldMappings: Record<string, string> = {
  date_of_birth: "Date of Birth",
  email: "Email Address",
  phone_number: "Phone Number",
  insurance_id: "Insurance ID",
  mrn_no: "MRN Number",
  patient_name: "Patient Name",
  address: "Address",
  gender: "Gender",
  emergency_contact: "Emergency Contact"
};

export default function BulkLogErrorDetails({ 
  errors, 
  isLoading = false, 
  onExportErrors 
}: BulkLogErrorDetailsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique failed fields for filter options
  const uniqueFields = Array.from(new Set(errors.map(error => 
    error.failed_field || error.column || 'Unknown'
  ))).filter(Boolean).sort();

  // Filter errors based on search and field filter
  const filteredErrors = errors.filter(error => {
    const searchMatch = searchTerm === "" || 
      (error.mrn_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (error.failed_reason || error.reason || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (error.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const fieldMatch = filterField === "all" || 
      (error.failed_field || error.column) === filterField;

    return searchMatch && fieldMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredErrors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedErrors = filteredErrors.slice(startIndex, startIndex + itemsPerPage);

  // Error statistics
  const errorStats = {
    total: errors.length,
    filtered: filteredErrors.length,
    byField: uniqueFields.reduce((acc, field) => {
      acc[field] = errors.filter(error => 
        (error.failed_field || error.column) === field
      ).length;
      return acc;
    }, {} as Record<string, number>)
  };

  // Handle export
  const handleExport = () => {
    if (onExportErrors) {
      onExportErrors(filteredErrors);
    }
  };

  // Get display name for field
  const getFieldDisplayName = (field: string): string => {
    return errorFieldMappings[field] || field.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterField("all");
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading error details...</p>
        </div>
      </div>
    );
  }

  if (!errors || errors.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-900 rounded-lg border border-amber-200 dark:border-amber-700 p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center">
                <AlertTriangleIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Error Details Not Available
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                The system indicates there are failed tasks, but detailed error information is not available. 
                This could be due to:
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 list-disc list-inside space-y-1">
                <li>Backend not storing detailed error information</li>
                <li>API response missing error details field</li>
                <li>Data processing incomplete during upload</li>
                <li>Legacy upload format without error tracking</li>
              </ul>
              
              <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-800 rounded-md">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Technical Details:
                </p>
                <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                  <div>Errors array: {errors ? `empty (length: ${errors.length})` : 'null/undefined'}</div>
                  <div>Expected fields: row, column, reason, failed_field, failed_reason, mrn_no, patient_name</div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Recommended Actions:
                </p>
                <ul className="text-sm text-amber-700 dark:text-amber-300 mt-1 list-disc list-inside space-y-1">
                  <li>Check the Raw Data tab for complete upload information</li>
                  <li>Re-upload the file if detailed error information is needed</li>
                  <li>Contact system administrator if this issue persists</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Compact Header with Error Summary */}
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 rounded-lg border border-red-200/50 dark:border-red-800/30 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangleIcon className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                {errorStats.total} Error{errorStats.total !== 1 ? 's' : ''} Detected
              </h3>
              <div className="flex gap-1.5">
                {(searchTerm || filterField !== "all") && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 px-2 py-1 bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium transition-colors"
                  >
                    <XCircleIcon className="w-3 h-3" />
                    Reset
                  </button>
                )}
                {onExportErrors && (
                  <button
                    onClick={handleExport}
                    disabled={filteredErrors.length === 0}
                    className="flex items-center gap-1 px-2 py-1 bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700 text-red-900 dark:text-red-200 rounded text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    <DownloadIcon className="w-3 h-3" />
                    Export
                  </button>
                )}
              </div>
            </div>

            {/* Compact Error Summary by Field */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {Object.entries(errorStats.byField).map(([field, count]) => (
                <span
                  key={field}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  title={`${count} error${count !== 1 ? 's' : ''} in ${getFieldDisplayName(field)}`}
                >
                  {getFieldDisplayName(field)}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search errors..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Field Filter */}
          <div className="sm:w-40">
            <div className="relative">
              <FilterIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterField}
                onChange={(e) => {
                  setFilterField(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Fields</option>
                {uniqueFields.map(field => (
                  <option key={field} value={field}>
                    {getFieldDisplayName(field)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Compact Results Info */}
        {(searchTerm || filterField !== "all") && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              {filteredErrors.length} of {errorStats.total} shown
            </span>
          </div>
        )}
      </div>

      {/* Compact Error Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredErrors.length === 0 ? (
          <div className="p-6 text-center">
            <XCircleIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              No matching errors
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Row
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      MRN
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Field
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Error Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedErrors.map((error, index) => (
                    <tr
                      key={`${error.row || error.row_number}-${index}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-gray-900 dark:text-gray-100">
                        {error.row || error.row_number || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-gray-900 dark:text-gray-100">
                        {error.mrn_no || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                        {error.patient_name || '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          title={`Field: ${error.failed_field || error.column || 'Unknown'}`}
                        >
                          {getFieldDisplayName(error.failed_field || error.column || 'Unknown')}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900 dark:text-gray-100">
                        <div className="max-w-md">
                          <p className="break-words line-clamp-2" title={error.failed_reason || error.reason}>
                            {error.failed_reason || error.reason || 'No reason provided'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Compact Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredErrors.length)} of {filteredErrors.length}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Prev
                    </button>
                    <span className="text-xs text-gray-700 dark:text-gray-300 px-2">
                      {currentPage}/{totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
