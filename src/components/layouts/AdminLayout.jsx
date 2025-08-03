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

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    if (parsedUser.role !== "admin") {
      navigate("/login");
    } else {
      setUser(parsedUser);
    }
  }, [navigate]);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  const NavItem = ({ to, iconPath, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
      onClick={() => {
        if (window.innerWidth < 1024) {
          setIsSidebarOpen(false);
        }
      }}
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
    <div className="relative flex h-screen bg-slate-100 overflow-hidden">
      {/* Backdrop Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-transparent bg-opacity-50 z-20  lg:hidden"
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white flex flex-col w-64 fixed inset-y-0 left-0 z-30
                   transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                   ${!isSidebarOpen && "lg:w-20"}`}
      >
        {/* Logo & Header Sidebar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <span
            className={`font-bold text-lg ${!isSidebarOpen && "lg:hidden"}`}
          >
            Admin Panel
          </span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-full hover:bg-gray-700 hidden lg:block"
          >
            <Icon path="M4 6h16M4 12h16M4 18h16" className="h-5 w-5" />
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            to="/admin/dashboard"
            iconPath="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            label="Dashboard"
          />
          <NavItem
            to="/admin/events"
            iconPath="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h9M7 16h6M7 8h6v4H7V8z"
            label="Kelola Lowongan"
          />
          <NavItem
            to="/admin/members"
            iconPath="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 004.773-9.773"
            label="Kelola Pengguna"
          />
          <NavItem
            to="/admin/statistics"
            iconPath="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            label="Statistik"
          />
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-700">
          <div
            className={`flex items-center gap-4 ${
              !isSidebarOpen && "lg:justify-center"
            }`}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.nama || "A"
              }&background=random`}
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div
              className={`transition-opacity duration-200 ${
                !isSidebarOpen && "lg:hidden"
              }`}
            >
              <p className="font-semibold text-sm">{user?.nama || "Admin"}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out 
                   lg:${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Header Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu for Mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-800 p-2 rounded-full hover:bg-gray-200 lg:hidden"
            >
              <Icon path="M4 6h16M4 12h16M4 18h16" className="h-5 w-5" />
            </button>
            <div className="text-lg font-semibold text-gray-800">
              Selamat Datang, {user?.nama || "Admin"}!
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
          >
            <Icon
              path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              className="h-5 w-5"
            />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
