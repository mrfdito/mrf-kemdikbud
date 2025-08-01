// src/pages/portal/PerusahaanList.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import PortalLayout from "../../components/layouts/PortalLayout";
import PerusahaanCard from "../../components/portal/PerusahaanCard";

const PerusahaanList = () => {
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

  return (
    <PortalLayout>
      <h1 className="text-2xl font-bold mb-6">Daftar Perusahaan Terdaftar</h1>

      {loading ? (
        <p>Memuat data perusahaan...</p>
      ) : perusahaanList.length === 0 ? (
        <p>Belum ada perusahaan yang terdaftar.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perusahaanList.map((perusahaan) => (
            <PerusahaanCard key={perusahaan.id} perusahaan={perusahaan} />
          ))}
        </div>
      )}
    </PortalLayout>
  );
};

export default PerusahaanList;
