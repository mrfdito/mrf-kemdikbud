import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PortalLayout from "../../components/layouts/PortalLayout";
import { supabase } from "../../services/supabase";

// Komponen untuk setiap bagian detail agar lebih rapi
const DetailSection = ({ title, children }) => {
  if (!children) return null;
  return (
    <div className="py-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      {/* 'prose' class dari Tailwind Typography untuk format teks yang indah */}
      <div className="prose prose-sm max-w-none text-gray-600">{children}</div>
    </div>
  );
};

const DetailLowonganPortal = () => {
  const { id } = useParams();
  const [lowongan, setLowongan] = useState(null);
  const [loading, setLoading] = useState(true);

  const session = localStorage.getItem("userSession");
  const user = session ? JSON.parse(session) : null;

  // --- TIDAK ADA PERUBAHAN PADA LOGIKA FETCH DATA ---
  useEffect(() => {
    const fetchDetail = async () => {
      const { data, error } = await supabase
        .from("lowongan")
        .select(`*, perusahaan:users (nama), kategori:kategori (nama)`)
        .eq("id", id)
        .single();
      if (error) {
        console.error("Gagal ambil detail:", error.message);
      } else {
        setLowongan(data);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  // Tampilan loading yang lebih baik
  if (loading) {
    return (
      <PortalLayout>
        <div className="text-center py-20">
          <p className="text-gray-500">Memuat detail lowongan...</p>
        </div>
      </PortalLayout>
    );
  }

  // Tampilan lowongan tidak ditemukan yang lebih baik
  if (!lowongan) {
    return (
      <PortalLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">Lowongan Tidak Ditemukan</h2>
          <p className="text-gray-500 mt-2">
            Lowongan yang Anda cari mungkin sudah tidak tersedia.
          </p>
          <Link
            to="/lowongan"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Kembali ke Daftar Lowongan
          </Link>
        </div>
      </PortalLayout>
    );
  }

  // --- TIDAK ADA PERUBAHAN PADA LOGIKA LINK ---
  const applyLink = user
    ? `/mahasiswa/lowongan/${lowongan.id}`
    : `/login?redirect=/mahasiswa/lowongan/${lowongan.id}`;

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto py-10">
        {/* Layout Utama Dua Kolom */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* --- Kolom Utama (Kiri) --- */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              {/* Header Lowongan */}
              <div>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {lowongan.kategori?.nama || "Umum"}
                </span>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
                  {lowongan.judul}
                </h1>
                <p className="mt-2 text-lg font-semibold text-gray-700">
                  di {lowongan.perusahaan?.nama}
                </p>
              </div>

              {/* Detail Lowongan */}
              <div className="mt-6">
                <DetailSection title="Deskripsi Pekerjaan">
                  <p>{lowongan.deskripsi}</p>
                </DetailSection>
                <DetailSection title="Rincian Penugasan">
                  <p>{lowongan.rincian_penugasan}</p>
                </DetailSection>
                <DetailSection title="Latar Belakang Pendidikan">
                  <p>{lowongan.latar_belakang_pendidikan}</p>
                </DetailSection>
                <DetailSection title="Kompetensi Teknis">
                  <p>{lowongan.kompetensi_teknis}</p>
                </DetailSection>
                <DetailSection title="Soft Skill yang Dibutuhkan">
                  <p>{lowongan.soft_skill}</p>
                </DetailSection>
                <DetailSection title="Persyaratan Khusus">
                  <p>{lowongan.persyaratan_khusus}</p>
                </DetailSection>
                <DetailSection title="Capaian Pembelajaran">
                  <p>{lowongan.capaian_pembelajaran}</p>
                </DetailSection>
              </div>
            </div>
          </div>

          {/* --- Sidebar (Kanan) --- */}
          <div className="mt-8 lg:mt-0 lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Tombol Aksi Utama */}

              {/* Kartu Ringkasan */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-3">
                  Ringkasan Lowongan
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lokasi</span>
                    <span className="font-semibold text-gray-800">
                      {lowongan.lokasi || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline</span>
                    <span className="font-semibold text-gray-800">
                      {lowongan.deadline
                        ? new Date(lowongan.deadline).toLocaleDateString(
                            "id-ID",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {lowongan.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Diposting</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(lowongan.created_at).toLocaleDateString(
                        "id-ID",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to={applyLink}
                className="w-full text-center inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
              >
                Lamar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default DetailLowonganPortal;
