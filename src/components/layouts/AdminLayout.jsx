// src/components/layouts/AdminLayout.jsx
import React from "react";
import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="block hover:underline">
              Dashboard
            </Link>
            <Link to="/admin/events" className="block hover:underline">
              Kelola Lowongan
            </Link>
            <Link to="/admin/members" className="block hover:underline">
              Kelola Pengguna
            </Link>
            <Link to="/admin/statistics" className="block hover:underline">
              Statistik
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </>
  );
};

export default AdminLayout;
