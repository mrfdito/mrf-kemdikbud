import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const MahasiswaLayout = ({ children }) => {
  const navigate = useNavigate();

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("userSession"); // hapus session
    navigate("/login"); // kembali ke login
  };

  // Proteksi halaman khusus mahasiswa
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (!session) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(session);

    if (user.role !== "mahasiswa") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white p-4">
        <h2 className="text-lg font-bold mb-6">Mahasiswa Panel</h2>
        <nav className="space-y-2">
          <Link to="/mahasiswa/dashboard" className="block hover:underline">
            Dashboard
          </Link>
          <Link to="/mahasiswa/lowongan" className="block hover:underline">
            Cari Lowongan
          </Link>
          {/* <Link to="/mahasiswa/lamaran" className="block hover:underline">
            Lamaran Saya
          </Link> */}
          <button
            onClick={handleLogout}
            className="block text-left w-full mt-4 text-red-300 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default MahasiswaLayout;
