// src/pages/admin/Dashboard.jsx
import React from "react";
import UserApprovalTable from "../../components/UserApprovalTable";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <UserApprovalTable />
    </div>
  );
};

export default Dashboard;
