import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";
import { supabase } from "../../services/supabase";

// Komponen Badge Status (tidak diubah)
const StatusBadge = ({ status }) => {
  let styles = "bg-yellow-100 text-yellow-800";
  if (status === "diterima") styles = "bg-green-100 text-green-800";
  if (status === "ditolak") styles = "bg-red-100 text-red-800";
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${styles}`}
    >
      {status}
    </span>
  );
};

const LamaranSaya = () => {
  // --- FUNGSI DAN LOGIKA TIDAK DIUBAH SAMA SEKALI ---
  const [lamaran, setLamaran] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLamaran = async () => {
      const session = JSON.parse(localStorage.getItem("userSession"));
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("lamaran")
        .select(
          `id, status, tanggal_lamar, lowongan(id, judul, perusahaan:users(nama))`
        )
        .eq("user_id", session.id)
        .order("tanggal_lamar", { ascending: false });

      if (error) console.error("Gagal mengambil data lamaran:", error.message);
      else setLamaran(data);

      setLoading(false);
    };
    fetchLamaran();
  }, []);

  // --- PERUBAHAN VISUAL HANYA PADA BAGIAN JSX DI BAWAH INI ---
  return (
    <MahasiswaLayout>
      {/* Header Halaman */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Riwayat Lamaran Saya
        </h1>
        <p className="mt-1 text-gray-600">
          Pantau semua status lamaran yang telah Anda kirimkan di sini.
        </p>
      </div>

      {/* Kontainer Tabel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lowongan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Lamar
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
                    Memuat data lamaran...
                  </td>
                </tr>
              ) : lamaran.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Anda Belum Melamar
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Semua lamaran Anda akan muncul di sini.
                    </p>
                    <Link
                      to="/mahasiswa/lowongan"
                      className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-blue-700"
                    >
                      Cari Lowongan
                    </Link>
                  </td>
                </tr>
              ) : (
                lamaran.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.lowongan?.judul || "Judul tidak tersedia"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.lowongan?.perusahaan?.nama ||
                          "Perusahaan tidak tersedia"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.tanggal_lamar).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/mahasiswa/lowongan/${item.lowongan?.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MahasiswaLayout>
  );
};

export default LamaranSaya;
