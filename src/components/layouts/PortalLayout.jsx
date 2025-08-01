// src/components/layouts/PortalLayout.jsx
import React from "react";
import { Link } from "react-router-dom";

const PortalLayout = ({ children }) => {
  // Mengambil sesi pengguna dari localStorage
  const session = localStorage.getItem("userSession");
  const user = session ? JSON.parse(session) : null;

  // Menentukan link tujuan dashboard berdasarkan role pengguna
  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "perusahaan":
        return "/perusahaan/dashboard";
      case "mahasiswa":
        return "/mahasiswa/dashboard";
      default:
        return "/";
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6">
          {/* Brand Logo/Name */}
          <Link to="/">
            <h1 className="text-xl font-bold text-gray-800">
              MRF.<span className="text-blue-600">kemdikbud</span>
            </h1>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center space-x-6 text-sm font-medium text-gray-600 md:flex">
            <Link to="/" className="transition-colors hover:text-blue-600">
              Home
            </Link>
            <Link
              to="/lowongan"
              className="transition-colors hover:text-blue-600"
            >
              Cari Lowongan
            </Link>
            <Link
              to="/perusahaan"
              className="transition-colors hover:text-blue-600"
            >
              Perusahaan
            </Link>
            {/* Link 'About' yang dikembalikan */}
            <Link to="/about" className="transition-colors hover:text-blue-600">
              About
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                to={dashboardLink}
                className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} MRF.kemdikbud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;
