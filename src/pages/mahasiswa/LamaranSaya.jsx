import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";
import { supabase } from "../../services/supabase";

// Komponen Ikon untuk Timeline
const TimelineIcon = ({ status }) => {
  let config = {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    color: "bg-yellow-500",
  };
  switch (status) {
    case "diterima":
      config = {
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        ),
        color: "bg-green-500",
      };
      break;
    case "ditolak":
      config = {
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        ),
        color: "bg-red-500",
      };
      break;
  }
  return (
    <span
      className={`absolute -left-3 flex items-center justify-center w-6 h-6 ${config.color} rounded-full ring-8 ring-white`}
    >
      <svg
        className="w-3 h-3 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="3"
      >
        {config.icon}
      </svg>
    </span>
  );
};

// Komponen Badge Status
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Riwayat Lamaran Saya
        </h1>
        <p className="mt-1 text-gray-600">
          Pantau semua status lamaran yang telah Anda kirimkan di sini.
        </p>
      </div>

      {loading ? (
        // Tampilan Loading dengan Skeleton
        <div className="animate-pulse space-y-8">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
      ) : lamaran.length === 0 ? (
        // Tampilan Jika Data Kosong
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed">
          <h3 className="text-xl font-semibold text-gray-800">
            Anda Belum Melamar Lowongan
          </h3>
          <p className="text-gray-500 mt-2 mb-6">
            Semua lowongan yang Anda lamar akan muncul di sini.
          </p>
          <Link
            to="/mahasiswa/lowongan"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:bg-blue-700"
          >
            Cari Lowongan Sekarang
          </Link>
        </div>
      ) : (
        // Tampilan Timeline Lamaran
        <ol className="relative border-l border-gray-200 ml-3">
          {lamaran.map((item) => (
            <li key={item.id} className="mb-10 ml-6">
              <TimelineIcon status={item.status} />
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.lowongan?.judul || "Judul tidak tersedia"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      di{" "}
                      {item.lowongan?.perusahaan?.nama ||
                        "Perusahaan tidak tersedia"}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <StatusBadge status={item.status} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Tanggal Melamar:{" "}
                    {new Date(item.tanggal_lamar).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <Link
                    to={`/mahasiswa/lowongan/${item.lowongan?.id}`}
                    className="w-full sm:w-auto text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </MahasiswaLayout>
  );
};

export default LamaranSaya;
