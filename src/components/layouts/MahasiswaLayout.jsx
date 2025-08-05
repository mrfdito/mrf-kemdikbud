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

const MahasiswaLayout = ({ children }) => {
  // --- FUNGSI & LOGIKA TIDAK DIUBAH, HANYA DITAMBAH STATE UNTUK UI ---
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
    if (parsedUser.role !== "mahasiswa") {
      navigate("/login");
    } else {
      setUser(parsedUser);
    }
  }, [navigate]);

  // Komponen Navigasi Item untuk clean code
  const NavItem = ({ to, iconPath, label }) => (
    <NavLink
      to={to}
      end // Tambahkan 'end' untuk NavLink ke path root dashboard
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-200 hover:bg-gray-700 hover:text-white"
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

  // --- PERUBAHAN VISUAL PADA JSX DI BAWAH INI ---
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header Sidebar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <span
            className={`font-bold text-lg whitespace-nowrap ${
              !isSidebarOpen && "lg:hidden"
            }`}
          >
            Mahasiswa
          </span>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-full hover:bg-gray-700"
          >
            <Icon path="M4 6h16M4 12h16M4 18h16" className="h-5 w-5" />
          </button>
        </div>

        {/* Navigasi dengan Ikon & Status Aktif */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            to="/mahasiswa/dashboard"
            iconPath="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            label="Dashboard"
          />
          <NavItem
            to="/mahasiswa/lowongan"
            iconPath="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            label="Cari Lowongan"
          />
          <NavItem
            to="/mahasiswa/lamaran"
            iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            label="Lamaran Saya"
          />
        </nav>

        {/* Info Pengguna di Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <div
            className={`flex items-center gap-4 ${
              !isSidebarOpen && "lg:justify-center"
            }`}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.nama || "M"
              }&background=random`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div
              className={`transition-opacity duration-200 ${
                !isSidebarOpen && "lg:hidden"
              }`}
            >
              <p className="font-semibold text-sm whitespace-nowrap">
                {user?.nama || "Mahasiswa"}
              </p>
              <p className="text-xs text-gray-400">Mahasiswa Aktif</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Header Utama */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="text-lg font-semibold text-gray-800">
            {/* Judul halaman bisa ditampilkan di sini */}
          </div>
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

        {/* Konten Utama */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default MahasiswaLayout;
