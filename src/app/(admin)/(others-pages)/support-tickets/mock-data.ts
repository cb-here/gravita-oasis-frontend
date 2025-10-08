// Updated mock data to include missing fields for full compatibility
export const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "support-agent",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@company.com",
    role: "engineer",
  },
  {
    id: "3",
    name: "Alex Rodriguez",
    email: "alex@company.com",
    role: "admin",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@customer.com",
    role: "support-agent",
  },
];

export const mockTickets = [
  {
    _id: "TKT-001", // Added for consistency in href
    id: "TKT-001",
    subject: "Payment failed for Pro subscription",
    description:
      "I'm trying to upgrade to Pro but my payment keeps failing. I've tried multiple cards and they all decline. Please help!",
    category: "billing-subscription",
    priority: "high",
    status: "open",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    submittedBy: mockUsers[3],
    assignedTo: mockUsers[0],
    hasUnreadReplies: false,
    totalComments: 2,
    hasAttachments: true,
    rating: {
      id: "rating-001",
      ticketId: "TKT-001",
      rating: 4,
      feedback: "Quick response and helpful solution. Thank you!",
      createdAt: "2024-01-16T12:00:00Z",
      submittedBy: mockUsers[3],
    },
  },
  {
    _id: "TKT-002",
    id: "TKT-002",
    subject: "API webhooks not firing consistently",
    description:
      "Our webhooks are missing about 30% of events. This is causing major issues with our integration. Started happening since yesterday.",
    category: "technical-issue",
    priority: "critical",
    status: "in-progress",
    createdAt: "2024-01-14T14:15:00Z",
    updatedAt: "2024-01-15T09:22:00Z",
    submittedBy: mockUsers[3],
    assignedTo: mockUsers[1],
    hasUnreadReplies: true,
    totalComments: 3,
    hasAttachments: false,
    slaBreachAt: "2024-01-15T15:15:00Z",
  },
  {
    _id: "TKT-003",
    id: "TKT-003",
    subject: "Cannot access dashboard after password reset",
    description:
      "I reset my password but now I can't log in. The system says my credentials are invalid.",
    category: "account-access",
    priority: "medium",
    status: "resolved",
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-14T11:30:00Z",
    submittedBy: mockUsers[3],
    assignedTo: mockUsers[0],
    hasUnreadReplies: false,
    totalComments: 1,
    hasAttachments: false,
    conversationEnded: true,
    conversationEndedAt: "2024-01-14T11:30:00Z",
    rating: {
      id: "rating-003",
      ticketId: "TKT-003",
      rating: 5,
      feedback:
        "Excellent support! The agent was very patient and walked me through everything step by step.",
      createdAt: "2024-01-14T11:45:00Z",
      submittedBy: mockUsers[3],
    },
  },
  {
    _id: "TKT-004",
    id: "TKT-004",
    subject: "Add dark mode to the dashboard",
    description:
      "It would be great to have a dark mode option for the dashboard. Many users have requested this feature.",
    category: "feature-request",
    priority: "suggestion",
    status: "open",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-12T09:00:00Z",
    submittedBy: mockUsers[3],
    hasUnreadReplies: false,
    totalComments: 0,
    hasAttachments: false,
  },
  {
    _id: "TKT-005",
    id: "TKT-005",
    subject: "Need help connecting to Slack integration",
    description:
      "I'm following the setup guide but getting stuck on the OAuth flow. The redirect doesn't seem to work correctly.",
    category: "integration",
    priority: "medium",
    status: "awaiting-user",
    createdAt: "2024-01-11T13:20:00Z",
    updatedAt: "2024-01-14T10:15:00Z",
    submittedBy: mockUsers[3],
    assignedTo: mockUsers[0],
    hasUnreadReplies: true,
    totalComments: 4,
    hasAttachments: true,
  },
  {
    _id: "TKT-006",
    id: "TKT-006",
    subject: "Dashboard loading very slowly",
    description:
      "The main dashboard takes 10-15 seconds to load. This started happening after the recent update.",
    category: "technical-issue",
    priority: "high",
    status: "in-progress",
    createdAt: "2024-01-10T11:30:00Z",
    updatedAt: "2024-01-15T08:45:00Z",
    submittedBy: mockUsers[3],
    assignedTo: mockUsers[1],
    hasUnreadReplies: false,
    totalComments: 5,
    hasAttachments: false,
    rating: {
      id: "rating-006",
      ticketId: "TKT-006",
      rating: 2,
      feedback:
        "Issue took too long to resolve and communication could have been better.",
      createdAt: "2024-01-15T14:00:00Z",
      submittedBy: mockUsers[3],
    },
  },
];

export const mockComments: any[] = [
  {
    id: "comment-1",
    ticketId: "TKT-002",
    comment:
      "Thank you for reporting this issue. I've escalated this to our engineering team and we're looking into the API connectivity problem. We'll have an update within 2 hours.",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: mockUsers[0], // Sarah Johnson
    isInternal: false,
  },
  {
    id: "comment-2",
    ticketId: "TKT-002",
    comment:
      "Engineering confirmed this is related to the recent deployment. Rolling back now.",
    createdAt: "2024-01-15T11:15:00Z",
    createdBy: mockUsers[1], // Mike Chen
    isInternal: true,
  },
  {
    id: "comment-3",
    ticketId: "TKT-002",
    comment:
      "The issue has been resolved. The API connectivity should be working normally now. Please test on your end and let us know if you're still experiencing problems.",
    createdAt: "2024-01-15T12:00:00Z",
    createdBy: mockUsers[0], // Sarah Johnson
    isInternal: false,
  },
  {
    id: "comment-4",
    ticketId: "TKT-001",
    comment:
      "I've checked your account and can see the billing cycle discrepancy. I'm processing a refund for the overcharge right now. You should see the credit within 3-5 business days.",
    createdAt: "2024-01-14T14:20:00Z",
    createdBy: mockUsers[0], // Sarah Johnson
    isInternal: false,
  },
  {
    id: "comment-5",
    ticketId: "TKT-003",
    comment:
      "I've reset your password and sent new login credentials to your email. Please check your inbox and spam folder. Let me know if you need any further assistance.",
    createdAt: "2024-01-13T16:45:00Z",
    createdBy: mockUsers[0], // Sarah Johnson
    isInternal: false,
  },
];
