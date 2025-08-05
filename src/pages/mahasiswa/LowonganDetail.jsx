import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";
import { supabase } from "../../services/supabase";

// Komponen untuk setiap bagian detail agar lebih rapi
const DetailSection = ({ title, children }) => {
  if (!children) return null;
  return (
    <div className="py-6 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="prose prose-sm max-w-none text-gray-600">
        {/* Menggunakan 'dangerouslySetInnerHTML' jika deskripsi Anda berisi HTML, jika tidak, cukup <p>{children}</p> */}
        <p>{children}</p>
      </div>
    </div>
  );
};

const LowonganDetail = () => {
  // --- FUNGSI DAN LOGIKA TIDAK DIUBAH SAMA SEKALI ---
  const { id } = useParams();
  const [lowongan, setLowongan] = useState(null);
  const [statusLamaran, setStatusLamaran] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cvFile, setCvFile] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const session = JSON.parse(localStorage.getItem("userSession"));
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: l, error } = await supabase
        .from("lowongan")
        .select(`*, perusahaan:users (nama), kategori:kategori (nama)`)
        .eq("id", id)
        .single();
      if (error) {
        console.error("Gagal ambil detail:", error.message);
        setLoading(false);
        return;
      }
      setLowongan(l);

      const { data: lamaran } = await supabase
        .from("lamaran")
        .select("status")
        .eq("user_id", session.id)
        .eq("lowongan_id", id)
        .single();
      if (lamaran) {
        setStatusLamaran(lamaran.status);
      }

      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleApply = async () => {
    setIsApplying(true);
    const session = JSON.parse(localStorage.getItem("userSession"));
    if (!session || !cvFile) {
      setIsApplying(false);
      return;
    }

    const fileExt = cvFile.name.split(".").pop();
    const fileName = `${session.id}_${Date.now()}.${fileExt}`;
    const filePath = `cv/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("cv")
      .upload(filePath, cvFile);
    if (uploadError) {
      alert("Gagal upload CV: " + uploadError.message);
      setIsApplying(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("cv")
      .getPublicUrl(filePath);
    const { error } = await supabase
      .from("lamaran")
      .insert([
        {
          user_id: session.id,
          lowongan_id: id,
          cv_url: publicUrlData.publicUrl,
          status: "proses",
        },
      ]);

    if (!error) {
      alert("Lamaran berhasil dikirim!");
      setStatusLamaran("proses");
    }
    setIsApplying(false);
  };

  // --- PERUBAHAN VISUAL HANYA PADA BAGIAN JSX DI BAWAH INI ---
  if (loading) {
    return (
      <MahasiswaLayout>
        <div className="text-center p-10">Memuat detail lowongan...</div>
      </MahasiswaLayout>
    );
  }
  if (!lowongan) {
    return (
      <MahasiswaLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">Lowongan Tidak Ditemukan</h2>
          <p className="text-gray-500 mt-2">
            Lowongan yang Anda cari mungkin sudah tidak tersedia.
          </p>
          <Link
            to="/mahasiswa/lowongan"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Kembali Cari Lowongan
          </Link>
        </div>
      </MahasiswaLayout>
    );
  }

  return (
    <MahasiswaLayout>
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Kolom Utama (Kiri) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
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

          {/* Sidebar (Kanan) */}
          <div className="mt-8 lg:mt-0 lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Kotak Aksi Lamar */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                {statusLamaran ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Anda Sudah Melamar
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status lamaran Anda saat ini:
                    </p>
                    <span
                      className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                        statusLamaran === "diterima"
                          ? "bg-green-100 text-green-800"
                          : statusLamaran === "ditolak"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {statusLamaran}
                    </span>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Lamar Posisi Ini
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="cv-upload"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Upload CV (PDF)
                        </label>
                        <input
                          id="cv-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <button
                        onClick={handleApply}
                        disabled={!cvFile || isApplying}
                        className="w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isApplying ? "Mengirim..." : "Kirim Lamaran"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Kartu Ringkasan */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-3">
                  Ringkasan Lowongan
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lokasi</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {lowongan.lokasi || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {lowongan.deadline
                        ? new Date(lowongan.deadline).toLocaleDateString(
                            "id-ID",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Diposting</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {new Date(lowongan.created_at).toLocaleDateString(
                        "id-ID",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MahasiswaLayout>
  );
};

export default LowonganDetail;
