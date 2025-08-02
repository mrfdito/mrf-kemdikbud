// src/pages/admin/Dashboard.jsx
import React from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import UserApprovalTable from "../../components/admin/UserApprovalTable";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Selamat Datang, Admin!
        </h1>
        <p className="text-gray-600 mt-2">
          Anda dapat mengelola akun pengguna baru di bawah ini. Silakan tinjau
          dan setujui pengguna{" "}
          <span className="font-semibold text-blue-600">mahasiswa</span> atau{" "}
          <span className="font-semibold text-green-600">perusahaan</span> yang
          sedang menunggu verifikasi.
        </p>
      </div>

      <UserApprovalTable />
    </AdminLayout>
  );
};

export default Dashboard;
