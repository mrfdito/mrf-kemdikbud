import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import PortalLayout from "../../components/layouts/PortalLayout";
import PerusahaanCard from "../../components/portal/PerusahaanCard";

const PerusahaanList = () => {
  // --- FUNGSI DAN LOGIKA JAVASCRIPT TIDAK DIUBAH SAMA SEKALI ---
  const [perusahaanList, setPerusahaanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerusahaan = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, nama, identitas, status")
        .eq("role", "perusahaan");

      if (error) {
        console.error("Gagal mengambil data perusahaan:", error.message);
        return;
      }

      setPerusahaanList(data);
      setLoading(false);
    };

    fetchPerusahaan();
  }, []);

  // --- PERUBAHAN HANYA PADA BAGIAN TAMPILAN (JSX) DI BAWAH INI ---
  return (
    <PortalLayout>
      {/* 1. Header Halaman Dibuat Lebih Menarik */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Mitra Perusahaan Kami
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
          Jelajahi profil perusahaan-perusahaan hebat yang menyediakan peluang
          magang untuk Anda.
        </p>
      </div>

      {loading ? (
        // 2. Tampilan Loading Dibuat Lebih Baik
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center gap-3 text-gray-500">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-lg font-medium">
              Memuat data perusahaan...
            </span>
          </div>
        </div>
      ) : perusahaanList.length === 0 ? (
        // 3. Tampilan Data Kosong Dibuat Lebih Informatif
        <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-gray-800">
              Belum Ada Perusahaan
            </h3>
            <p className="mt-1 text-gray-500">
              Saat ini belum ada perusahaan yang terdaftar. Silakan kembali lagi
              nanti.
            </p>
          </div>
        </div>
      ) : (
        // 4. Layout Grid Diberi Tambahan Kolom untuk Layar Lebih Besar
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {perusahaanList.map((perusahaan) => (
            <PerusahaanCard key={perusahaan.id} perusahaan={perusahaan} />
          ))}
        </div>
      )}
    </PortalLayout>
  );
};

export default PerusahaanList;
