export interface TeamMember {
  id: number;
  name: string;
  role: 'Coder' | 'QA' | 'Coder/QA';
  coding: number;
  qa: number;
  sampling: number;
  target: number;
  completed: number;
}

export interface SubmissionRecord {
  id: string;
  timestamp: Date;
  teamName: string;
  raisedBy: string;
  teamMembers: TeamMember[];
  metrics: {
    totalCodingTasks: number;
    totalQACapacity: number;
    totalTargets: number;
    totalCompleted: number;
    overallPerformance: number;
    samplingBalance: number;
    isBalanced: boolean;
  };
  status: 'pending' | 'approved' | 'rejected';
  adminApproval?: AdminApproval;
}

export interface AdminApproval {
  approvedBy: string;
  approvedAt: Date;
  comments?: string;
}

export type TimeFilter = 'day' | 'week' | 'month' | 'all';

export interface AnalyticsData {
  totalCodingCompleted: number;
  totalQACompleted: number;
  capacityUtilization: number;
  plannedVsAchieved: number;
  memberProductivity: Array<{
    name: string;
    percentage: number;
    role: string;
  }>;
}

export interface TeamComparisonData {
  teamName: string;
  totalSubmissions: number;
  averagePerformance: number;
  capacityUtilization: number;
  totalCompleted: number;
  totalTargets: number;
  status: 'pending' | 'approved' | 'rejected';
  lastSubmission: Date;
}

export type AdminTabType = 'approval' | 'analytics' | 'history';