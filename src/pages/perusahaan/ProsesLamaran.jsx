import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

const ProsesLamaran = () => {
  const [lamaranList, setLamaranList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lowonganList, setLowonganList] = useState([]);
  const [selectedLowonganId, setSelectedLowonganId] = useState("all");

  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const perusahaanId = userSession?.id;

  const fetchLowongan = async () => {
    const { data, error } = await supabase
      .from("lowongan")
      .select("id, judul")
      .eq("perusahaan_id", perusahaanId);

    if (error) {
      console.error("Gagal fetch lowongan:", error);
    } else {
      setLowonganList(data);
    }
  };

  const fetchLamaran = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("lamaran")
      .select(
        `
        id,
        user_id,
        lowongan_id,
        cv_url,
        status,
        tanggal_lamar,
        users ( nama ),
        lowongan ( judul, perusahaan_id )
      `
      )
      .order("tanggal_lamar", { ascending: false });

    if (error) {
      console.error("Gagal fetch lamaran:", error);
      setLoading(false);
      return;
    }

    // Filter berdasarkan perusahaan
    const filtered = data.filter(
      (item) => item.lowongan?.perusahaan_id === perusahaanId
    );

    // Jika lowongan dipilih
    const finalList =
      selectedLowonganId === "all"
        ? filtered
        : filtered.filter((item) => item.lowongan_id === selectedLowonganId);

    setLamaranList(finalList);
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("lamaran")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      fetchLamaran(); // refresh list
    } else {
      console.error("Gagal update status:", error);
    }
  };

  useEffect(() => {
    if (perusahaanId) {
      fetchLowongan();
      fetchLamaran();
    }
  }, [perusahaanId]);

  useEffect(() => {
    fetchLamaran(); // refresh jika filter diganti
  }, [selectedLowonganId]);

  return (
    <PerusahaanLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Proses Lamaran Masuk</h2>

        {/* 🔽 Filter lowongan */}
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">
            Filter berdasarkan lowongan:
          </label>
          <select
            value={selectedLowonganId}
            onChange={(e) => setSelectedLowonganId(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">Semua Lowongan</option>
            {lowonganList.map((lowongan) => (
              <option key={lowongan.id} value={lowongan.id}>
                {lowongan.judul}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : lamaranList.length === 0 ? (
          <p>Tidak ada lamaran masuk.</p>
        ) : (
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Pelamar</th>
                <th className="border px-3 py-2">Lowongan</th>
                <th className="border px-3 py-2">Tanggal Lamar</th>
                <th className="border px-3 py-2">CV</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lamaranList.map((lamaran) => (
                <tr key={lamaran.id}>
                  <td className="border px-3 py-2">
                    {lamaran.users?.nama || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {lamaran.lowongan?.judul || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(lamaran.tanggal_lamar).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2">
                    <a
                      href={lamaran.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Lihat CV
                    </a>
                  </td>
                  <td className="border px-3 py-2 capitalize">
                    {lamaran.status}
                  </td>
                  <td className="border px-3 py-2 space-x-2">
                    <button
                      onClick={() => updateStatus(lamaran.id, "diterima")}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => updateStatus(lamaran.id, "ditolak")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Tolak
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PerusahaanLayout>
  );
};

export default ProsesLamaran;
