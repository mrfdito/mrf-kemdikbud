import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabase";

const MemberListTable = ({ role }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State baru untuk search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusOptions = ["Semua", "waiting", "approved", "rejected"];

  useEffect(() => {
    // Reset state saat role berubah
    setCurrentPage(1);
    setSearchTerm("");
    setSelectedStatus("Semua");
    fetchMembers();
  }, [role]);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", role)
      .in("status", ["waiting", "approved", "rejected", "aktif"]);

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id, status) => {
    const { error } = await supabase
      .from("users")
      .update({ status })
      .eq("id", id);
    if (error) {
      console.error("Status update error:", error);
    } else {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
    }
  };

  // Hook useMemo untuk melakukan filter & search, kini dengan sorting
  const filteredAndSortedMembers = useMemo(() => {
    // Definisikan urutan status yang diinginkan
    const statusOrder = {
      waiting: 1,
      approved: 2,
      aktif: 2, // 'aktif' dan 'approved' dianggap setara
      rejected: 3,
    };

    return (
      members
        .filter((member) => {
          if (selectedStatus === "Semua") return true;
          return member.status === selectedStatus;
        })
        .filter((member) => {
          const term = searchTerm.toLowerCase();
          return (
            member.nama.toLowerCase().includes(term) ||
            member.identitas.toLowerCase().includes(term)
          );
        })
        // --- LOGIKA SORTING BARU DITAMBAHKAN DI SINI ---
        .sort((a, b) => {
          const orderA = statusOrder[a.status] || 99; // Beri nilai besar jika status tidak terdefinisi
          const orderB = statusOrder[b.status] || 99;
          return orderA - orderB;
        })
    );
  }, [members, searchTerm, selectedStatus]);

  // Kalkulasi untuk pagination (sekarang menggunakan filteredAndSortedMembers)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredAndSortedMembers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedMembers.length / itemsPerPage);

  const paginationNumbers = useMemo(() => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage > totalPages - 4)
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }, [totalPages, currentPage]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          Daftar {role}
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Cari nama atau identitas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status === "Semua" ? "Semua Status" : status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Identitas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Memuat data...
                </td>
              </tr>
            ) : currentMembers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-10 text-center text-gray-500 capitalize"
                >
                  Tidak ada {role} yang ditemukan.
                </td>
              </tr>
            ) : (
              currentMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.nama}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.identitas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        member.status === "waiting"
                          ? "bg-yellow-100 text-yellow-800"
                          : member.status === "approved" ||
                            member.status === "aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status === "approved" ? "Aktif" : member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {member.status === "waiting" && (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(member.id, "approved")
                          }
                          className="text-green-600 hover:text-green-900 font-semibold"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(member.id, "rejected")
                          }
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                    {(member.status === "approved" ||
                      member.status === "aktif") && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(member.id, "rejected")
                        }
                        className="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Nonaktifkan
                      </button>
                    )}
                    {member.status === "rejected" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(member.id, "approved")
                        }
                        className="text-green-600 hover:text-green-900 font-semibold"
                      >
                        Aktifkan
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t flex justify-center items-center gap-2">
          {paginationNumbers.map((page, index) =>
            typeof page === "number" ? (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-gray-700 border hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-gray-500">
                ...
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MemberListTable;
