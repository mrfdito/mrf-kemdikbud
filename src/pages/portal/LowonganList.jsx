import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabase";
import PortalLayout from "../../components/layouts/PortalLayout";
import LowonganCard from "../../components/portal/LowonganCard";

const LowonganList = () => {
  // State yang sudah ada
  const [lowonganList, setLowonganList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Sesuai permintaan: 3x2 (HP) dan 2x3 (PC) sama-sama 6 item per halaman
  const itemsPerPage = 6;

  // Fetch data awal dari Supabase
  useEffect(() => {
    const fetchLowongan = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("lowongan")
        .select(
          `id, judul, lokasi, deadline, perusahaan:users (id, nama, status), kategori:kategori (nama)`
        )
        .eq("status", "aktif");
      if (error) {
        console.error("Gagal ambil data lowongan:", error.message);
        setLoading(false);
        return;
      }
      const approved = data.filter(
        (l) => l.perusahaan && l.perusahaan.status === "approved"
      );
      setLowonganList(approved);
      setLoading(false);
    };
    fetchLowongan();
  }, []);

  // Opsi filter (tetap sama)
  const kategoriOptions = useMemo(() => {
    const allKategori = lowonganList
      .map((item) => item.kategori?.nama)
      .filter(Boolean);
    return ["Semua", ...new Set(allKategori)];
  }, [lowonganList]);

  // Logika filter (tetap sama)
  const filteredLowongan = useMemo(() => {
    return lowonganList
      .filter(
        (item) =>
          selectedKategori === "Semua" ||
          item.kategori?.nama === selectedKategori
      )
      .filter((item) =>
        item.judul.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [lowonganList, searchTerm, selectedKategori]);

  // Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLowongan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredLowongan.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Kembali ke halaman 1 saat search
  };

  const handleKategoriChange = (e) => {
    setSelectedKategori(e.target.value);
    setCurrentPage(1); // Kembali ke halaman 1 saat filter
  };

  return (
    <PortalLayout>
      {/* Header Halaman dengan Kontrol */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm mb-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Temukan Peluang Magang
        </h1>
        <p className="text-gray-600 mt-2">
          Cari dan saring dari ratusan lowongan yang tersedia untuk memulai
          kariermu.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Cari judul lowongan..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-white"
              value={selectedKategori}
              onChange={handleKategoriChange}
            >
              {kategoriOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "Semua" ? "Semua Kategori" : opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tampilan Daftar Lowongan */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Memuat lowongan...</p>
        </div>
      ) : filteredLowongan.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-800">
            Lowongan Tidak Ditemukan
          </h3>
          <p className="text-gray-500 mt-2">
            Coba gunakan kata kunci atau filter yang berbeda.
          </p>
        </div>
      ) : (
        <>
          {/* --- PERUBAHAN GRID LAYOUT DI SINI --- */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <LowonganCard key={item.id} lowongan={item} />
            ))}
          </div>

          {/* Komponen Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${
                      currentPage === number
                        ? "bg-blue-600 text-white shadow"
                        : "bg-white text-gray-700 border hover:bg-gray-100"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </PortalLayout>
  );
};

export default LowonganList;
