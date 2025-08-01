import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PortalLayout from "../../components/layouts/PortalLayout";
import { supabase } from "../../services/supabase";

const DetailLowonganPortal = () => {
  const { id } = useParams();
  const [lowongan, setLowongan] = useState(null);
  const [loading, setLoading] = useState(true);

  const session = localStorage.getItem("userSession");
  const user = session ? JSON.parse(session) : null;

  useEffect(() => {
    const fetchDetail = async () => {
      const { data, error } = await supabase
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
      } else {
        setLowongan(data);
      }

      setLoading(false);
    };

    fetchDetail();
  }, [id]);

  if (loading) return <PortalLayout>Loading...</PortalLayout>;
  if (!lowongan) return <PortalLayout>Lowongan tidak ditemukan.</PortalLayout>;

  // Tentukan ke mana tombol "Lamar Sekarang" mengarah
  const applyLink = user
    ? `/mahasiswa/lowongan/${lowongan.id}`
    : `/login?redirect=/mahasiswa/lowongan/${lowongan.id}`;

  return (
    <PortalLayout>
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

        {/* Tombol Lamar selalu tampil */}
        <div className="mt-6 text-right">
          <Link
            to={applyLink}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Lamar Sekarang
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
};

export default DetailLowonganPortal;
