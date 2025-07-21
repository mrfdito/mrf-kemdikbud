import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

const KelolaLowongan = () => {
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLowongan = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    const { data, error } = await supabase
      .from("lowongan")
      .select("*, kategori(nama)")
      .eq("perusahaan_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.error("Gagal fetch:", error);
    else setLowongan(data);

    setLoading(false);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "aktif" ? "nonaktif" : "aktif";
    const { error } = await supabase
      .from("lowongan")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) fetchLowongan();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Yakin ingin menghapus lowongan?");
    if (confirmed) {
      await supabase.from("lowongan").delete().eq("id", id);
      fetchLowongan();
    }
  };

  useEffect(() => {
    fetchLowongan();
  }, []);

  return (
    <PerusahaanLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Kelola Lowongan</h2>
        <Link
          to="/perusahaan/lowongan/tambah"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Lowongan
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : lowongan.length === 0 ? (
        <p>Tidak ada lowongan.</p>
      ) : (
        <ul className="space-y-4">
          {lowongan.map((item) => (
            <li
              key={item.id}
              className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-xl font-bold">{item.judul}</h3>
                <p className="text-gray-600 text-sm">
                  {item.kategori?.nama} | {item.status}
                </p>
              </div>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <Link
                  to={`/perusahaan/lowongan/edit/${item.id}`}
                  className="px-3 py-1 bg-yellow-400 rounded text-white text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleStatus(item.id, item.status)}
                  className={`px-3 py-1 rounded text-sm ${
                    item.status === "aktif" ? "bg-gray-500" : "bg-green-600"
                  } text-white`}
                >
                  {item.status === "aktif" ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-600 rounded text-white text-sm"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PerusahaanLayout>
  );
};

export default KelolaLowongan;
