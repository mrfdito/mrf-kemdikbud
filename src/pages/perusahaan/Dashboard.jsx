import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

const Dashboard = () => {
  const [lowongan, setLowongan] = useState([]);
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const [perusahaanRes, lowonganRes] = await Promise.all([
        supabase.from("users").select("nama").eq("id", userId).single(),
        supabase
          .from("lowongan")
          .select("*, lamaran(*)")
          .eq("perusahaan_id", userId)
          .order("created_at", { ascending: false }),
      ]);

      if (perusahaanRes.error)
        console.error("Error fetching nama:", perusahaanRes.error);
      else setNamaPerusahaan(perusahaanRes.data.nama);

      if (lowonganRes.error)
        console.error("Error fetching lowongan:", lowonganRes.error);
      else setLowongan(lowonganRes.data || []);

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const filteredLowongan = lowongan.filter((item) =>
    item.judul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLowongan.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLowongan = filteredLowongan.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <PerusahaanLayout>
      {/* Header Dashboard dengan Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Perusahaan
          </h1>
          <p className="text-gray-600 mt-1">
            Selamat datang, {namaPerusahaan}! Pantau aktivitas lowongan Anda di
            sini.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari lowongan..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Daftar Lowongan */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Lowongan Anda
        </h2>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-1/2 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ) : filteredLowongan.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-semibold text-gray-800">
              {searchQuery
                ? "Tidak ditemukan lowongan"
                : "Anda Belum Membuat Lowongan"}
            </h3>
            <p className="text-gray-500 mt-2 mb-6">
              {searchQuery
                ? "Coba cari dengan kata kunci lain."
                : "Ayo buat lowongan pertama Anda dan temukan talenta terbaik!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/perusahaan/tambah-lowongan")}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:bg-blue-700"
              >
                Buat Lowongan
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedLowongan.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/perusahaan/lowongan/${item.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.judul}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        item.status === "aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {item.deskripsi}
                  </p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 004.773-9.773"
                        />
                      </svg>
                      <span>{item.lamaran?.length || 0} Pelamar</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Deadline:{" "}
                      {item.deadline
                        ? new Date(item.deadline).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border text-sm font-medium bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border text-sm font-medium bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PerusahaanLayout>
  );
};

export default Dashboard;
