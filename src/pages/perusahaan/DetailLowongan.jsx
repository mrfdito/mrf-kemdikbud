import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

const DetailLowongan = () => {
  const { id } = useParams();
  const [lowongan, setLowongan] = useState(null);

  useEffect(() => {
    const fetchLowongan = async () => {
      const { data, error } = await supabase
        .from("lowongan")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return console.error(error);
      setLowongan(data);
    };

    if (id) fetchLowongan();
  }, [id]);

  if (!lowongan) return <p>Loading...</p>;

  return (
    <PerusahaanLayout>
      <h2 className="text-2xl font-semibold mb-4">Detail Lowongan</h2>
      <div className="bg-white p-6 shadow rounded-xl space-y-2">
        <h3 className="text-xl font-bold mb-2">{lowongan.judul}</h3>
        <p className="text-gray-700 mb-2">{lowongan.deskripsi}</p>
        <p className="text-sm text-gray-500">
          <strong>Lokasi:</strong> {lowongan.lokasi || "-"}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Deadline:</strong> {lowongan.deadline}
        </p>
        <p className="text-sm text-gray-500">
          <strong>Status:</strong> {lowongan.status}
        </p>

        {/* Tambahan Field */}
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            <strong>Rincian Penugasan:</strong>
            <br />
            {lowongan.rincian_penugasan || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Latar Belakang Pendidikan:</strong>
            <br />
            {lowongan.latar_belakang_pendidikan || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Kompetensi Teknis:</strong>
            <br />
            {lowongan.kompetensi_teknis || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Soft Skill:</strong>
            <br />
            {lowongan.soft_skill || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Persyaratan Khusus:</strong>
            <br />
            {lowongan.persyaratan_khusus || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Capaian Pembelajaran:</strong>
            <br />
            {lowongan.capaian_pembelajaran || "-"}
          </p>
        </div>
      </div>
    </PerusahaanLayout>
  );
};

export default DetailLowongan;
