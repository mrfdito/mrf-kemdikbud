import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const PerusahaanLayout = ({ children }) => {
  const navigate = useNavigate();

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("userSession"); // Hapus session
    navigate("/login"); // Arahkan ke halaman login
  };

  // Proteksi akses halaman khusus perusahaan
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (!session) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(session);

    if (user.role !== "perusahaan") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Perusahaan Panel</h2>
        <nav className="space-y-2">
          <Link to="/perusahaan/dashboard" className="block hover:underline">
            Dashboard
          </Link>
          <Link to="/perusahaan/statistik" className="block hover:underline">
            Statistik Perusahaan
          </Link>
          <Link
            to="/perusahaan/kelolalowongan"
            className="block hover:underline"
          >
            Kelola Lowongan
          </Link>
          <Link
            to="/perusahaan/proseslamaran"
            className="block hover:underline"
          >
            Proses Lamaran
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
