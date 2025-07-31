// src/components/layouts/PortalLayout.jsx
import React from "react";
import { Link } from "react-router-dom";

const PortalLayout = ({ children }) => {
  const session = localStorage.getItem("userSession");
  const user = session ? JSON.parse(session) : null;

  // Tentukan link tujuan dashboard berdasarkan role
  const dashboardLink =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "perusahaan"
      ? "/perusahaan/dashboard"
      : user?.role === "mahasiswa"
      ? "/mahasiswa/dashboard"
      : "/";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Portal</h1>
          <nav className="space-x-6 text-sm md:text-base">
            <Link to="/" className="text-gray-700 hover:text-blue-500">
              Home
            </Link>
            <Link to="/lowongan" className="text-gray-700 hover:text-blue-500">
              Lowongan
            </Link>
            <Link
              to="/perusahaan"
              className="text-gray-700 hover:text-blue-500"
            >
              Perusahaan
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-500">
              About
            </Link>
            {user ? (
              <Link
                to={dashboardLink}
                className="text-blue-600 font-semibold hover:underline"
              >
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-500">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 px-6 py-10 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default PortalLayout;
