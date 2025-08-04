import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

const StatusBadge = ({ status }) => {
  const baseStyle = "px-2.5 py-1 text-xs font-semibold rounded-full capitalize";
  let style = "";
  switch (status) {
    case "diterima":
      style = `bg-green-100 text-green-800 ${baseStyle}`;
      break;
    case "ditolak":
      style = `bg-red-100 text-red-800 ${baseStyle}`;
      break;
    case "proses":
    default:
      style = `bg-yellow-100 text-yellow-800 ${baseStyle}`;
  }
  return <span className={style}>{status}</span>;
};

const ProsesLamaran = () => {
  const [lamaranList, setLamaranList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowonganList, setLowonganList] = useState([]);
  const [selectedLowonganId, setSelectedLowonganId] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const perusahaanId = userSession?.id;

  useEffect(() => {
    const fetchLowongan = async () => {
      const { data, error } = await supabase
        .from("lowongan")
        .select("id, judul")
        .eq("perusahaan_id", perusahaanId);

      if (!error) setLowonganList(data);
    };

    if (perusahaanId) fetchLowongan();
  }, [perusahaanId]);

  const fetchLamaran = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lamaran")
      .select(
        `id, user_id, lowongan_id, cv_url, status, tanggal_lamar, users(nama), lowongan(judul, perusahaan_id)`
      )
      .order("tanggal_lamar", { ascending: true });

    if (error) {
      console.error("Gagal fetch lamaran:", error);
      setLoading(false);
      return;
    }

    let filtered = data.filter(
      (item) => item.lowongan?.perusahaan_id === perusahaanId
    );

    if (selectedLowonganId !== "all") {
      filtered = filtered.filter(
        (item) => item.lowongan_id === selectedLowonganId
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.users?.nama?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const ordered = [...filtered].sort((a, b) => {
      const statusOrder = { proses: 0, diterima: 1, ditolak: 2 };
      const statusCompare = statusOrder[a.status] - statusOrder[b.status];
      if (statusCompare !== 0) return statusCompare;
      return new Date(a.tanggal_lamar) - new Date(b.tanggal_lamar);
    });

    setLamaranList(ordered);
    setLoading(false);
  };

  useEffect(() => {
    if (perusahaanId) fetchLamaran();
  }, [selectedLowonganId, statusFilter, searchQuery, perusahaanId]);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("lamaran")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) fetchLamaran();
  };

  const totalPages = Math.ceil(lamaranList.length / perPage);
  const paginatedList = lamaranList.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const renderPagination = () => {
    const pages = [];
    const totalNumbers = 5;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);
      const hasLeftEllipsis = leftBound > 2;
      const hasRightEllipsis = rightBound < totalPages - 1;

      pages.push(1);
      if (hasLeftEllipsis) pages.push("left-ellipsis");
      for (let i = leftBound; i <= rightBound; i++) pages.push(i);
      if (hasRightEllipsis) pages.push("right-ellipsis");
      pages.push(totalPages);
    }

    return (
      <div className="flex justify-end items-center gap-1 mt-6 text-sm">
        {pages.map((page, index) =>
          page === "left-ellipsis" || page === "right-ellipsis" ? (
            <span key={index} className="px-2 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 rounded-md font-medium border transition ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
    );
  };

  return (
    <PerusahaanLayout>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Proses Lamaran Masuk
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola semua lamaran untuk lowongan Anda.
          </p>
        </div>
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Cari pelamar..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter Lowongan
          </label>
          <select
            value={selectedLowonganId}
            onChange={(e) => {
              setSelectedLowonganId(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Lowongan</option>
            {lowonganList.map((lowongan) => (
              <option key={lowongan.id} value={lowongan.id}>
                {lowongan.judul}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="proses">Proses</option>
            <option value="diterima">Diterima</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pelamar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lowongan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tanggal Lamar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                CV
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Memuat data...
                </td>
              </tr>
            ) : paginatedList.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Tidak ada data lamaran.
                </td>
              </tr>
            ) : (
              paginatedList.map((lamaran) => (
                <tr key={lamaran.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lamaran.users?.nama || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {lamaran.lowongan?.judul || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(lamaran.tanggal_lamar).toLocaleDateString(
                      "id-ID"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={lamaran.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Lihat CV
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={lamaran.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => updateStatus(lamaran.id, "diterima")}
                      className="bg-green-100 text-green-800 px-3 py-1.5 rounded-md font-semibold hover:bg-green-200 transition disabled:opacity-50"
                      disabled={lamaran.status === "diterima"}
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => updateStatus(lamaran.id, "ditolak")}
                      className="bg-red-100 text-red-800 px-3 py-1.5 rounded-md font-semibold hover:bg-red-200 transition disabled:opacity-50"
                      disabled={lamaran.status === "ditolak"}
                    >
                      Tolak
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && renderPagination()}
    </PerusahaanLayout>
  );
};

export default ProsesLamaran;
