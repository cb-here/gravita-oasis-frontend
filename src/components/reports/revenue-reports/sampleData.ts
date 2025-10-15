export const generateSampleData = () => {
  const teams = ["Team Pramod", "Team Shijo", "Team Amira"];
  const projects = [
    "Project J",
    "Origin",
    "Metropolitan",
    "Jacksonville",
    "Making Memories",
  ];

  const teamMembers: Record<string, string[]> = {
    "Team Pramod": ["Pramod", "Ravi", "Sneha", "Aarav", "Neha", "Kiran"],
    "Team Shijo": ["Shijo", "Anita", "Rahul", "Divya", "Manoj", "Fatima"],
    "Team Amira": ["Amira", "Khalid", "Sara", "Omar", "Layla", "Nadia"],
  };

  const data: any = [];
  const startDate = new Date("2024-01-01");

  for (let i = 0; i < 280; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    teams.forEach((team) => {
      projects.forEach((project) => {
        if (Math.random() > 0.3) {
          const members = teamMembers[team];
          const member =
            members[Math.floor(Math.random() * members.length)];

          data.push({
            date: currentDate.toISOString().split("T")[0],
            team,
            project,
            revenue: Math.floor(Math.random() * 50000) + 10000,
            projectedRevenue: Math.floor(Math.random() * 60000) + 15000,
            tasks: Math.floor(Math.random() * 5) + 1,
            member,
          });
        }
      });
    });
  }

  return data;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
