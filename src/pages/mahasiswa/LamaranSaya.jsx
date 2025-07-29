import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";
import { supabase } from "../../services/supabase";

const LamaranSaya = () => {
  const [lamaran, setLamaran] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLamaran = async () => {
      const session = JSON.parse(localStorage.getItem("userSession"));
      if (!session) {
        console.error("User tidak login.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("lamaran")
        .select(
          `
          id,
          status,
          tanggal_lamar,
          lowongan (
            id,
            judul,
            perusahaan:users (nama)
          )
        `
        )
        .eq("user_id", session.id)
        .order("tanggal_lamar", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data lamaran:", error.message);
      } else {
        setLamaran(data);
      }

      setLoading(false);
    };

    fetchLamaran();
  }, []);

  return (
    <MahasiswaLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Lamaran Saya</h2>
        {loading ? (
          <p>Memuat lamaran saya...</p>
        ) : lamaran.length === 0 ? (
          <p>Belum ada lamaran yang diajukan.</p>
        ) : (
          <div className="space-y-4">
            {lamaran.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {item.lowongan?.judul || "Judul tidak tersedia"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.lowongan?.perusahaan?.nama ||
                      "Perusahaan tidak tersedia"}{" "}
                    | Status:{" "}
                    <span
                      className={`font-medium ${
                        item.status === "diterima"
                          ? "text-green-600"
                          : item.status === "ditolak"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>
                </div>
                <Link
                  to={`/mahasiswa/lowongan/${item.lowongan?.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Lihat Detail
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </MahasiswaLayout>
  );
};

export default LamaranSaya;
