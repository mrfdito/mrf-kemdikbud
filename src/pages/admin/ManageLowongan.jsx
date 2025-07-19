import React from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import MagangListTable from "../../components/admin/MagangListTable";

const ManageLowongan = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Daftar Lowongan Magang</h1>
      <p className="mb-6 text-gray-600">
        Halaman ini menampilkan semua lowongan magang yang diajukan oleh
        perusahaan. Admin hanya dapat melihat daftar lowongan beserta statusnya.
      </p>
      <MagangListTable />
    </AdminLayout>
  );
};

export default ManageLowongan;
