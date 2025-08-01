// src/components/layouts/PortalLayout.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const PortalLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = localStorage.getItem("userSession");
  const user = session ? JSON.parse(session) : null;

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
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      {/* 1. Tambahkan 'relative' di sini agar menjadi acuan untuk menu dropdown */}
      <header className="relative sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6">
          <Link to="/" onClick={closeMenu}>
            <h1 className="text-xl font-bold text-gray-800">
              MRF.<span className="text-blue-600">kemdikbud</span>
            </h1>
          </Link>
          <div className="flex items-center">
            <div className="hidden items-center space-x-6 md:flex">
              <nav className="flex space-x-6 text-sm font-medium text-gray-600">
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
                <Link
                  to="/about"
                  className="transition-colors hover:text-blue-600"
                >
                  About
                </Link>
              </nav>
              <div className="h-6 w-px bg-gray-200"></div>
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
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-md p-2 text-gray-700 transition hover:bg-gray-100"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- Menu Mobile (Overlay) --- */}
        {/* 2. Kunci perubahan ada di sini */}
        {isMenuOpen && (
          <div className="absolute left-0 w-full bg-white shadow-lg md:hidden">
            <nav className="flex flex-col space-y-2 p-4">
              <Link
                to="/"
                className="rounded-md px-3 py-2 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/lowongan"
                className="rounded-md px-3 py-2 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Cari Lowongan
              </Link>
              <Link
                to="/perusahaan"
                className="rounded-md px-3 py-2 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Perusahaan
              </Link>
              <Link
                to="/about"
                className="rounded-md px-3 py-2 hover:bg-gray-100"
                onClick={closeMenu}
              >
                About
              </Link>
              <div className="pt-4 mt-4 border-t border-gray-100">
                {user ? (
                  <Link
                    to={dashboardLink}
                    className="block w-full text-center rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full text-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="w-full flex-1">
        <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
      </main>
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
