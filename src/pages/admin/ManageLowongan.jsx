import React from "react";
import AdminLayout from "../../components/layouts/AdminLayout";
import MagangListTable from "../../components/admin/MagangListTable";

const ManageLowongan = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Kelola Lowongan Magang
          </h1>
          <p className="mt-1 text-gray-600">
            Halaman ini menampilkan semua lowongan magang yang ada di platform.
            Anda dapat memfilter daftar berdasarkan kategori dan melihat status
            setiap lowongan.
          </p>
        </div>
        <MagangListTable />
      </div>
    </AdminLayout>
  );
};

export default ManageLowongan;
