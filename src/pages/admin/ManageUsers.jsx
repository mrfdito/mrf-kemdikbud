import React, { useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import MemberListTable from "../../components/admin/MemberListTable";

const ManageUsers = () => {
  const [selectedRole, setSelectedRole] = useState("mahasiswa");

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Kelola Pengguna</h1>

        {/* Tab / Toggle */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              selectedRole === "mahasiswa"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedRole("mahasiswa")}
          >
            Mahasiswa
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedRole === "perusahaan"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
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
