import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabase";

// Komponen Badge untuk Status
const StatusBadge = ({ status }) => {
  const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full capitalize";
  let style = "";

  switch (status) {
    case "aktif":
      style = `bg-green-100 text-green-800 ${baseStyle}`;
      break;
    case "nonaktif":
      style = `bg-gray-100 text-gray-800 ${baseStyle}`;
      break;
    case "pending":
      style = `bg-yellow-100 text-yellow-800 ${baseStyle}`;
      break;
    default:
      style = `bg-purple-100 text-purple-800 ${baseStyle}`;
  }
  return <span className={style}>{status}</span>;
};

const MagangListTable = () => {
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const kategoriOptions = [
    "Semua",
    "IT",
    "Hukum",
    "Akuntansi",
    "Desain",
    "Pemasaran",
    "Teknik",
  ];

  useEffect(() => {
    const fetchLowongan = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("lowongan")
        .select(
          "id, judul, lokasi, deadline, status, created_at, users(nama), kategori(nama)"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data lowongan:", error.message);
      } else {
        setLowongan(data || []);
      }
      setLoading(false);
    };
    fetchLowongan();
  }, []);

  const isInactiveOrExpired = (item) => {
    const deadlineDate = new Date(item.deadline);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return (
      item.status === "nonaktif" || (item.deadline && deadlineDate < today)
    );
  };

  const filteredAndSortedLowongan = useMemo(() => {
    return lowongan
      .filter((item) => {
        const matchesKategori =
          selectedKategori === "Semua" ||
          item.kategori?.nama === selectedKategori;
        const matchesSearch = item.judul
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchesKategori && matchesSearch;
      })
      .sort((a, b) => {
        const aIsOld = isInactiveOrExpired(a);
        const bIsOld = isInactiveOrExpired(b);
        if (aIsOld === bIsOld) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return aIsOld ? 1 : -1;
      });
  }, [lowongan, selectedKategori, search]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedLowongan.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedLowongan.length / itemsPerPage);

  const handleFilterChange = (e) => {
    setSelectedKategori(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      {/* Header dan Filter/Search */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Semua Lowongan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total {filteredAndSortedLowongan.length} lowongan ditemukan.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Cari berdasarkan judul..."
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            value={search}
            onChange={handleSearchChange}
          />
          <select
            id="kategori-filter"
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
            value={selectedKategori}
            onChange={handleFilterChange}
          >
            {kategoriOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "Semua" ? "Semua Kategori" : opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-slate-50 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 text-left">Judul</th>
              <th className="py-3 px-4 text-left">Perusahaan</th>
              <th className="py-3 px-4 text-left">Lokasi</th>
              <th className="py-3 px-4 text-left">Deadline</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Kategori</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Tidak ada lowongan yang cocok dengan filter atau pencarian.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50 ${
                    isInactiveOrExpired(item) ? "opacity-60" : ""
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {item.judul}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {item.users?.nama || "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {item.lokasi || "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {item.deadline
                      ? new Date(item.deadline).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {item.kategori?.nama || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .reduce((acc, page, idx, arr) => {
              if (idx > 0 && page - arr[idx - 1] > 1) {
                acc.push("...");
              }
              acc.push(page);
              return acc;
            }, [])
            .map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white text-gray-700 border hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}
        </div>
      )}
    </div>
  );
};

export default MagangListTable;
