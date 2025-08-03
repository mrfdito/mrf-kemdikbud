import React, { useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import MemberListTable from "../../components/admin/MemberListTable";

const ManageUsers = () => {
  const [selectedRole, setSelectedRole] = useState("mahasiswa");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Pengguna</h1>
          <p className="mt-1 text-gray-600">
            Atur dan kelola semua pengguna terdaftar di platform, termasuk
            mahasiswa dan perusahaan.
          </p>
        </div>

        {/* Tab / Toggle yang Lebih Modern */}
        <div className="inline-flex rounded-lg shadow-sm">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ${
              selectedRole === "mahasiswa"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-l-lg"
            }`}
            onClick={() => setSelectedRole("mahasiswa")}
          >
            Mahasiswa
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ${
              selectedRole === "perusahaan"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-r border-gray-300 rounded-r-lg"
            }`}
            onClick={() => setSelectedRole("perusahaan")}
          >
            Perusahaan
          </button>
        </div>

        {/* Tampilkan tabel berdasarkan role */}
        <MemberListTable role={selectedRole} />
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
