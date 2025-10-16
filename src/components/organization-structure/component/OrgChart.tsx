import React from "react";
import { OrganizationChart } from "primereact/organizationchart";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import AvatarText from "@/components/ui/avatar/AvatarText";

const OrgChartDemo = () => {
  const data = [
    {
      label: "Swarnima",
      role: "Super Admin",
      type: "superadmin",
      image: "/images/user/owner.jpg",
      expanded: true,
      children: [
        {
          label: "Joe Dohn",
          role: "Admin",
          type: "admin",
          image: "/images/user/user-08.jpg",
          expanded: true,
          children: [
            {
              label: "Team Pramod",
              type: "team",
              expanded: true,
              children: [
                {
                  label: "Ravi",
                  role: "Coder",
                  image: "/images/user/user-01.jpg",
                },
                {
                  label: "Avesh",
                  role: "QA",
                  image: "/images/user/user-02.jpg",
                },
                {
                  label: "Srusti",
                  role: "Coder/QA",
                  image: "/images/user/user-03.jpg",
                },
              ],
            },
            {
              label: "Team Shijo",
              type: "team",
              expanded: true,
              children: [
                {
                  label: "Member 1",
                  role: "Coder",
                  image: "/images/user/user-04.jpg",
                },
                {
                  label: "Member 2",
                  role: "QA",
                  image: "/images/user/user-05.jpg",
                },
              ],
            },
            {
              label: "Team Amira",
              type: "team",
              expanded: true,
              children: [
                {
                  label: "Member 1",
                  role: "Coder",
                  image: "/images/user/user-06.jpg",
                },
                {
                  label: "Member 2",
                  role: "Coder/QA",
                  image: "/images/user/user-07.jpg",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const nodeTemplate = (node: any) => {
    // Determine color based on role
    const getRoleColor = (role: string) => {
      if (role === "Coder") return "rgb(34, 197, 94)"; // success/green
      if (role === "QA") return "rgb(168, 85, 247)"; // purple
      if (role === "Coder/QA") return "rgb(59, 130, 246)"; // brand/blue
      if (role === "Admin") return "rgb(249, 115, 22)"; // orange
      if (role === "Super Admin") return "rgb(239, 68, 68)"; // red
      return "#666"; // default
    };

    const roleColor = node.role ? getRoleColor(node.role) : "#666";

    return (
      <div style={{ textAlign: "center", padding: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        {/* Show image for members with images, otherwise show AvatarText */}
        {node.image ? (
          <img
            src={node.image}
            alt={node.label}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${roleColor}`,
            }}
          />
        ) : node.role ? (
          <AvatarText name={node.label} />
        ) : null}

        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
            {node.label}
          </div>
          {node.role && (
            <div style={{
              fontSize: "12px",
              color: "white",
              backgroundColor: roleColor,
              padding: "4px 12px",
              borderRadius: "12px",
              fontWeight: "500"
            }}>
              {node.role}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", padding: "20px", overflow: "auto" }}>
      <OrganizationChart
        value={data}
        nodeTemplate={nodeTemplate}
        selectionMode="single"
      />
    </div>
  );
};

export default OrgChartDemo;
