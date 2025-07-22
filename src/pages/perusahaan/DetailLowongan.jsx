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
      <div className="bg-white p-6 shadow rounded-xl">
        <h3 className="text-xl font-bold mb-2">{lowongan.judul}</h3>
        <p className="text-gray-700 mb-4">{lowongan.deskripsi}</p>
        <p className="text-sm text-gray-500">
          Lokasi: {lowongan.lokasi || "-"}
        </p>
        <p className="text-sm text-gray-500">Deadline: {lowongan.deadline}</p>
        <p className="text-sm text-gray-500">Status: {lowongan.status}</p>
      </div>
    </PerusahaanLayout>
  );
};

export default DetailLowongan;
