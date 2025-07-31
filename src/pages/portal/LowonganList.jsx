// src/pages/portal/LowonganList.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import PortalLayout from "../../components/layouts/PortalLayout";
import LowonganCard from "../../components/portal/LowonganCard";

const LowonganList = () => {
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowongan = async () => {
      const { data, error } = await supabase
        .from("lowongan")
        .select(
          `
          id,
          judul,
          lokasi,
          deadline,
          perusahaan:users (id, nama, status),
          kategori:kategori (nama)
        `
        )
        .eq("status", "aktif");

      if (error) {
        console.error("Gagal ambil data:", error.message);
        return;
      }

      const approved = data.filter(
        (l) => l.perusahaan && l.perusahaan.status === "approved"
      );

      setLowongan(approved);
      setLoading(false);
    };

    fetchLowongan();
  }, []);

  return (
    <PortalLayout>
      <h1 className="text-2xl font-bold mb-6">Daftar Lowongan Magang</h1>

      {loading ? (
        <p>Memuat lowongan...</p>
      ) : lowongan.length === 0 ? (
        <p>Belum ada lowongan yang tersedia.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lowongan.map((item) => (
            <LowonganCard key={item.id} lowongan={item} />
          ))}
        </div>
      )}
    </PortalLayout>
  );
};

export default LowonganList;
