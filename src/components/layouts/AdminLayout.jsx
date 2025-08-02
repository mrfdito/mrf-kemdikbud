// src/components/layouts/AdminLayout.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("userSession"); // hapus session
    navigate("/login"); // kembali ke login
  };

  // Proteksi halaman khusus admin
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (!session) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(session);

    if (user.role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  return (
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
          <button
            onClick={handleLogout}
            className="block text-left w-full mt-4 text-red-300 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default AdminLayout;
