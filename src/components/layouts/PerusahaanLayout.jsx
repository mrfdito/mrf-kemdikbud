import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PerusahaanLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userSession"); // hapus session
    navigate("/login"); // redirect ke halaman login
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Perusahaan Panel</h2>
        <nav className="space-y-2">
          <Link to="/perusahaan/dashboard" className="block hover:underline">
            Dashboard
          </Link>
          <Link
            to="/perusahaan/kelolalowongan"
            className="block hover:underline"
          >
            Kelola Lowongan
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

export default PerusahaanLayout;
