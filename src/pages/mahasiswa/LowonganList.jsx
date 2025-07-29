import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";
import { supabase } from "../../services/supabase";

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
        console.error("Gagal ambil lowongan:", error.message);
        return;
      }

      // Filter hanya perusahaan approved
      const approvedLowongan = data.filter(
        (l) => l.perusahaan && l.perusahaan.status === "approved"
      );

      setLowongan(approvedLowongan);
      setLoading(false);
    };

    fetchLowongan();
  }, []);

  return (
    <MahasiswaLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Cari Lowongan Magang</h1>

        {loading ? (
          <p>Loading...</p>
        ) : lowongan.length === 0 ? (
          <p>Tidak ada lowongan yang tersedia saat ini.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lowongan.map((item) => (
              <Link
                to={`/mahasiswa/lowongan/${item.id}`}
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-md bg-white"
              >
                <h2 className="text-xl font-semibold">{item.judul}</h2>
                <p className="text-sm text-gray-600">
                  {item.perusahaan?.nama} • {item.kategori?.nama}
                </p>
                <p className="mt-2 text-gray-700">Lokasi: {item.lokasi}</p>
                <p className="text-sm text-gray-500">
                  Deadline: {item.deadline || "Tidak ditentukan"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MahasiswaLayout>
  );
};

export default LowonganList;
