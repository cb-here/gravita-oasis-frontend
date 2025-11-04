export const permissions = [
  {
    feature: "Tasks",
    isAllowed: true,
    actions: [
      { _id: "6825a1706d47912a78107ba1", action: "READ" },
      { _id: "6825a1706d47912a78107ba2", action: "CREATE" },
      { _id: "6825a1706d47912a78107ba3", action: "UPDATE" },
      { _id: "6825a1706d47912a78107ba4", action: "DELETE" },
      { _id: "686e0213fd79e7c152a2043a", action: "EXPORT" },
    ],
  },
  {
    feature: "Inventory",
    isAllowed: true,
    actions: [
      { _id: "6825a1706d47912a78107bb1", action: "READ" },
      { _id: "6825a1706d47912a78107bb2", action: "CREATE" },
      { _id: "6825a1706d47912a78107bb3", action: "UPDATE" },
      { _id: "6825a1706d47912a78107bb4", action: "DELETE" },
      { _id: "686e0213fd79e7c152a2043b", action: "IMPORT" },
    ],
  },
  {
    feature: "Users",
    isAllowed: true,
    actions: [
      { _id: "6825a1706d47912a78107bc1", action: "READ" },
      { _id: "6825a1706d47912a78107bc2", action: "CREATE" },
      { _id: "6825a1706d47912a78107bc3", action: "UPDATE" },
      { _id: "6825a1706d47912a78107bc4", action: "DELETE" },
      { _id: "686e0213fd79e7c152a2043c", action: "ASSIGN_ROLE" },
    ],
  },
  {
    feature: "Reports",
    isAllowed: true,
    actions: [
      { _id: "6825a1706d47912a78107bd1", action: "READ" },
      { _id: "6825a1706d47912a78107bd2", action: "CREATE" },
      { _id: "6825a1706d47912a78107bd3", action: "UPDATE" },
      { _id: "6825a1706d47912a78107bd4", action: "DELETE" },
      { _id: "686e0213fd79e7c152a2043d", action: "GENERATE_PDF" },
    ],
  },
  {
    feature: "Billing",
    isAllowed: true,
    actions: [
      { _id: "6825a1706d47912a78107be1", action: "READ" },
      { _id: "6825a1706d47912a78107be2", action: "CREATE" },
      { _id: "6825a1706d47912a78107be3", action: "UPDATE" },
      { _id: "6825a1706d47912a78107be4", action: "DELETE" },
      { _id: "686e0213fd79e7c152a2043e", action: "REFUND" },
    ],
  },
  {
    feature: "Notifications",
    isAllowed: true,
    actions: [
      { _id: "6825a1706d47912a78107bf1", action: "READ" },
      { _id: "6825a1706d47912a78107bf2", action: "CREATE" },
      { _id: "6825a1706d47912a78107bf3", action: "UPDATE" },
      { _id: "6825a1706d47912a78107bf4", action: "DELETE" },
      { _id: "686e0213fd79e7c152a2043f", action: "MARK_AS_READ" },
    ],
  },
  {
    feature: "Analytics",
    isAllowed: true,
    actions: [
      { _id: "6825a1706d47912a78107bg1", action: "READ" },
      { _id: "6825a1706d47912a78107bg2", action: "CREATE" },
      { _id: "6825a1706d47912a78107bg3", action: "UPDATE" },
      { _id: "6825a1706d47912a78107bg4", action: "DELETE" },
      { _id: "686e0213fd79e7c152a20440", action: "EXPORT_CSV" },
    ],
  },
];
