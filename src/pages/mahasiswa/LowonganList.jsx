import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";
import { supabase } from "../../services/supabase";

const KATEGORI_LIST = [
  "IT",
  "Hukum",
  "Akuntansi",
  "Desain",
  "Pemasaran",
  "Teknik",
];

const LowonganCard = ({ item }) => {
  const calculateRemainingDays = (deadline) => {
    if (!deadline) return { text: "Tidak ditentukan", color: "text-gray-500" };
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.setHours(23, 59, 59, 999) - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { text: "Telah Berakhir", color: "text-gray-500 font-medium" };
    if (diffDays <= 1)
      return { text: "Berakhir Hari Ini", color: "text-red-600 font-bold" };
    return {
      text: `Sisa ${diffDays} hari`,
      color: "text-yellow-600 font-medium",
    };
  };

  const deadlineInfo = calculateRemainingDays(item.deadline);

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300">
      <div className="p-5 flex-grow">
        <p className="text-sm font-semibold text-blue-700">
          {item.perusahaan?.nama}
        </p>
        <h2 className="text-lg font-bold text-gray-900 leading-tight mt-1">
          {item.judul}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{item.lokasi}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v-3a2 2 0 012-2z"
              />
            </svg>
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-medium">
              {item.kategori?.nama}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 px-5 py-3 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold mt-auto gap-3">
        <span
          className={`w-full sm:w-auto text-center sm:text-left ${deadlineInfo.color}`}
        >
          {deadlineInfo.text}
        </span>
        <Link
          to={`/mahasiswa/lowongan/${item.id}`}
          className="w-full sm:w-auto text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 animate-pulse">
    <div className="mb-3">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="flex gap-4 mt-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
    <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
    </div>
  </div>
);

const LowonganList = () => {
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchLowongan = async () => {
      const { data, error } = await supabase
        .from("lowongan")
        .select(
          `id, judul, lokasi, deadline, perusahaan:users (id, nama, status), kategori:kategori (nama)`
        )
        .eq("status", "aktif");

      if (error) {
        console.error("Gagal ambil lowongan:", error.message);
        setLoading(false);
        return;
      }

      const approvedLowongan = data.filter(
        (l) => l.perusahaan && l.perusahaan.status === "approved"
      );

      setLowongan(approvedLowongan);
      setLoading(false);
    };
    fetchLowongan();
  }, []);

  const filtered = lowongan.filter(
    (item) =>
      item.judul.toLowerCase().includes(search.toLowerCase()) &&
      (filterKategori === "" ||
        item.kategori?.nama?.toLowerCase() === filterKategori.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 4) pages.push("...");

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      )
        pages.push(i);

      if (currentPage < totalPages - 3) pages.push("...");

      pages.push(totalPages);
    }

    return pages.map((page, idx) =>
      page === "..." ? (
        <span key={idx} className="px-2 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={page}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-white border text-gray-700"
          }`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <MahasiswaLayout>
      <div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Cari Lowongan Magang
          </h1>
          <p className="mt-1 text-gray-600">
            Temukan peluang terbaik untuk memulai kariermu di sini.
          </p>
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Cari berdasarkan judul..."
              className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200 transition"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200 transition"
              value={filterKategori}
              onChange={(e) => {
                setFilterKategori(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Semua Kategori</option>
              {KATEGORI_LIST.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-semibold text-gray-800">
              Tidak ada hasil
            </h3>
            <p className="text-gray-500 mt-2">
              Coba kata kunci atau kategori lain.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.map((item) => (
                <LowonganCard key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
              {renderPagination()}
            </div>
          </>
        )}
      </div>
    </MahasiswaLayout>
  );
};

export default LowonganList;
