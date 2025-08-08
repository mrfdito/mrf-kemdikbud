import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabase";
import PortalLayout from "../../components/layouts/PortalLayout";
import LowonganCard from "../../components/portal/LowonganCard";

const LowonganList = () => {
  const [lowonganList, setLowonganList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const kategoriOptions = useMemo(() => {
    const allKategori = lowonganList
      .map((item) => item.kategori?.nama)
      .filter(Boolean);
    return ["Semua", ...new Set(allKategori)];
  }, [lowonganList]);

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLowongan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredLowongan.length / itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleKategoriChange = (e) => {
    setSelectedKategori(e.target.value);
    setCurrentPage(1);
  };

  // Pagination condensed version with "..."
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisible = 1; // jumlah angka di kiri/kanan halaman aktif

    // Halaman pertama
    pageNumbers.push(1);

    // Titik-titik awal
    if (currentPage > maxVisible + 2) {
      pageNumbers.push("...");
    }

    // Halaman di sekitar currentPage
    for (
      let i = Math.max(2, currentPage - maxVisible);
      i <= Math.min(totalPages - 1, currentPage + maxVisible);
      i++
    ) {
      pageNumbers.push(i);
    }

    // Titik-titik akhir
    if (currentPage < totalPages - maxVisible - 1) {
      pageNumbers.push("...");
    }

    // Halaman terakhir
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <PortalLayout>
      {/* Header */}
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

      {/* List Lowongan */}
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <LowonganCard key={item.id} lowongan={item} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {renderPagination().map((number, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof number === "number" && setCurrentPage(number)
                  }
                  disabled={number === "..."}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                    ${
                      number === currentPage
                        ? "bg-blue-600 text-white shadow"
                        : number === "..."
                        ? "bg-transparent text-gray-500 cursor-default"
                        : "bg-white text-gray-700 border hover:bg-gray-100"
                    }`}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </PortalLayout>
  );
};

export default LowonganList;
