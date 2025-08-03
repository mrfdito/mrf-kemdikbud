import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

// Komponen Badge untuk Status
const StatusBadge = ({ status }) => {
  const baseStyle = "px-2.5 py-1 text-xs font-semibold rounded-full capitalize";
  let style = "";
  switch (status) {
    case "aktif":
      style = `bg-green-100 text-green-800 ${baseStyle}`;
      break;
    case "nonaktif":
    default:
      style = `bg-gray-100 text-gray-800 ${baseStyle}`;
  }
  return <span className={style}>{status}</span>;
};

// Komponen Ikon
const Icon = ({ path, className = "h-4 w-4" }) => (
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

const KelolaLowongan = () => {
  // --- FUNGSI DAN LOGIKA TIDAK DIUBAH SAMA SEKALI ---
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLowongan = async () => {
    setLoading(true);
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("lowongan")
      .select("*, kategori(nama)")
      .eq("perusahaan_id", userId)
      .order("created_at", { ascending: false });
    if (error) console.error("Gagal fetch:", error);
    else setLowongan(data);
    setLoading(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "aktif" ? "nonaktif" : "aktif";
    const { error } = await supabase
      .from("lowongan")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) fetchLowongan();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Anda yakin ingin menghapus lowongan ini secara permanen?"
    );
    if (confirmed) {
      await supabase.from("lowongan").delete().eq("id", id);
      fetchLowongan();
    }
  };

  useEffect(() => {
    fetchLowongan();
  }, []);

  // --- PERUBAHAN VISUAL HANYA PADA BAGIAN JSX DI BAWAH INI ---
  return (
    <PerusahaanLayout>
      {/* Header Halaman Modern */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Lowongan</h1>
          <p className="mt-1 text-gray-600">
            Buat, edit, dan atur status lowongan magang yang Anda tawarkan.
          </p>
        </div>
        <Link
          to="/perusahaan/lowongan/tambah"
          className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          <Icon path="M12 4v16m8-8H4" className="h-5 w-5" />
          Tambah Lowongan
        </Link>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul Lowongan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
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
              ) : lowongan.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <h3 className="text-lg font-semibold">
                      Belum Ada Lowongan
                    </h3>
                    <p className="mt-1">
                      Klik tombol "+ Tambah Lowongan" untuk memulai.
                    </p>
                  </td>
                </tr>
              ) : (
                lowongan.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.judul}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.kategori?.nama || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link
                        to={`/perusahaan/lowongan/edit/${item.id}`}
                        className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-900 font-semibold"
                      >
                        <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        Edit
                      </Link>
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 font-semibold"
                      >
                        <Icon
                          path={
                            item.status === "aktif"
                              ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"
                              : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          }
                        />
                        {item.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 font-semibold"
                      >
                        <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PerusahaanLayout>
  );
};

export default KelolaLowongan;
