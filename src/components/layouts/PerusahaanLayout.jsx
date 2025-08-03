import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Komponen Ikon
const Icon = ({ path, className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const PerusahaanLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    navigate("/login");
  };

  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (!session) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(session);
    if (parsedUser.role !== "perusahaan") {
      navigate("/login");
    } else {
      setUser(parsedUser);
    }
  }, [navigate]);

  const NavItem = ({ to, iconPath, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-200 hover:bg-blue-700 hover:text-white"
        }`
      }
    >
      <Icon path={iconPath} />
      <span
        className={`transition-opacity duration-200 ${
          !isSidebarOpen && "lg:hidden"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-blue-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-700">
          <span
            className={`font-bold text-lg whitespace-nowrap ${
              !isSidebarOpen && "lg:hidden"
            }`}
          >
            Perusahaan Panel
          </span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-full hover:bg-blue-700"
          >
            <Icon path="M4 6h16M4 12h16M4 18h16" className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            to="/perusahaan/dashboard"
            iconPath="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            label="Dashboard"
          />
          <NavItem
            to="/perusahaan/statistik"
            iconPath="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            label="Statistik"
          />
          <NavItem
            to="/perusahaan/kelolalowongan"
            iconPath="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            label="Kelola Lowongan"
          />
          <NavItem
            to="/perusahaan/proseslamaran"
            iconPath="M3 19v-8.25A4.5 4.5 0 017.5 6.5H12a9 9 0 019 9v3h-3a2 2 0 00-2 2v1H3zM9 12a1 1 0 112 0 1 1 0 01-2 0z"
            label="Proses Lamaran"
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-blue-700">
          <div
            className={`flex items-center gap-4 ${
              !isSidebarOpen && "lg:justify-center"
            }`}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.nama || "P"
              }&background=random`}
              alt="Company Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div
              className={`transition-opacity duration-200 ${
                !isSidebarOpen && "lg:hidden"
              }`}
            >
              <p className="font-semibold text-sm whitespace-nowrap">
                {user?.nama || "Dashboard Perusahaan"}
              </p>
              <p className="text-xs text-blue-200">Perusahaan Mitra</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="text-lg font-semibold text-gray-800"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
          >
            <Icon
              path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              className="h-5 w-5"
            />
            Logout
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default PerusahaanLayout;
