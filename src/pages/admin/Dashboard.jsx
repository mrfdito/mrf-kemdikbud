// src/pages/admin/Dashboard.jsx
import React from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import UserApprovalTable from "../../components/admin/UserApprovalTable";

const Dashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <UserApprovalTable />
    </AdminLayout>
  );
};

export default Dashboard;
