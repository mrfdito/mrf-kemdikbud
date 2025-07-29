import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";
import { supabase } from "../../services/supabase";

const LowonganDetail = () => {
  const { id } = useParams();
  const [lowongan, setLowongan] = useState(null);
  const [statusLamaran, setStatusLamaran] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const session = JSON.parse(localStorage.getItem("userSession"));
      if (!session) return;

      const { data: l, error } = await supabase
        .from("lowongan")
        .select(
          `
          *,
          perusahaan:users (nama),
          kategori:kategori (nama)
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Gagal ambil detail:", error.message);
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
    const session = JSON.parse(localStorage.getItem("userSession"));
    if (!session || !cvFile) return;

    const fileExt = cvFile.name.split(".").pop();
    const fileName = `${session.id}_${Date.now()}.${fileExt}`;
    const filePath = `cv/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("cv") // pastikan bucket storage 'cv' sudah dibuat
      .upload(filePath, cvFile);

    if (uploadError) {
      alert("Gagal upload CV: " + uploadError.message);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("cv")
      .getPublicUrl(filePath);

    const { error } = await supabase.from("lamaran").insert([
      {
        user_id: session.id,
        lowongan_id: id,
        cv_url: publicUrl.publicUrl,
        status: "proses",
      },
    ]);

    if (!error) {
      alert("Lamaran berhasil dikirim!");
      setStatusLamaran("proses");
    }
  };

  if (loading) return <MahasiswaLayout>Loading...</MahasiswaLayout>;
  if (!lowongan)
    return <MahasiswaLayout>Lowongan tidak ditemukan.</MahasiswaLayout>;

  return (
    <MahasiswaLayout>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">{lowongan.judul}</h1>
        <p className="text-gray-600">
          {lowongan.perusahaan?.nama} • {lowongan.kategori?.nama}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Lokasi: {lowongan.lokasi || "-"} | Deadline:{" "}
          {lowongan.deadline || "-"} <br />
          Status: {lowongan.status} | Dibuat:{" "}
          {new Date(lowongan.created_at).toLocaleDateString()}
        </p>

        <div className="space-y-4 text-gray-700">
          <div>
            <strong>Deskripsi:</strong>
            <p>{lowongan.deskripsi}</p>
          </div>
          {lowongan.rincian_penugasan && (
            <div>
              <strong>Rincian Penugasan:</strong>
              <p>{lowongan.rincian_penugasan}</p>
            </div>
          )}
          {lowongan.latar_belakang_pendidikan && (
            <div>
              <strong>Latar Belakang Pendidikan:</strong>
              <p>{lowongan.latar_belakang_pendidikan}</p>
            </div>
          )}
          {lowongan.kompetensi_teknis && (
            <div>
              <strong>Kompetensi Teknis:</strong>
              <p>{lowongan.kompetensi_teknis}</p>
            </div>
          )}
          {lowongan.soft_skill && (
            <div>
              <strong>Soft Skill:</strong>
              <p>{lowongan.soft_skill}</p>
            </div>
          )}
          {lowongan.persyaratan_khusus && (
            <div>
              <strong>Persyaratan Khusus:</strong>
              <p>{lowongan.persyaratan_khusus}</p>
            </div>
          )}
          {lowongan.capaian_pembelajaran && (
            <div>
              <strong>Capaian Pembelajaran:</strong>
              <p>{lowongan.capaian_pembelajaran}</p>
            </div>
          )}
        </div>

        {/* Upload CV dan Tombol Apply */}
        <div className="mt-6">
          {statusLamaran ? (
            <p className="text-blue-600 font-semibold">
              Kamu sudah melamar. Status: {statusLamaran}
            </p>
          ) : (
            <>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload CV (PDF):
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-4"
              />
              <button
                onClick={handleApply}
                disabled={!cvFile}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                Lamar Sekarang
              </button>
            </>
          )}
        </div>
      </div>
    </MahasiswaLayout>
  );
};

export default LowonganDetail;
