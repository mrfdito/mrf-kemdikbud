import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

// Komponen Badge untuk Status
const StatusBadge = ({ status }) => {
  const baseStyle = "px-2.5 py-1 text-xs font-semibold rounded-full capitalize";
  let style = "";
  switch (status) {
    case "diterima":
      style = `bg-green-100 text-green-800 ${baseStyle}`;
      break;
    case "ditolak":
      style = `bg-red-100 text-red-800 ${baseStyle}`;
      break;
    case "proses":
    default:
      style = `bg-yellow-100 text-yellow-800 ${baseStyle}`;
  }
  return <span className={style}>{status}</span>;
};

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

    const filtered = data.filter(
      (item) => item.lowongan?.perusahaan_id === perusahaanId
    );

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
      setLamaranList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
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
    fetchLamaran();
  }, [selectedLowonganId]);

  return (
    <PerusahaanLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Proses Lamaran Masuk
          </h1>
          <p className="mt-1 text-gray-600">
            Tinjau dan kelola semua lamaran yang masuk untuk lowongan Anda.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <label
            htmlFor="lowongan-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter berdasarkan lowongan
          </label>
          <select
            id="lowongan-filter"
            value={selectedLowonganId}
            onChange={(e) => setSelectedLowonganId(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Semua Lowongan</option>
            {lowonganList.map((lowongan) => (
              <option key={lowongan.id} value={lowongan.id}>
                {lowongan.judul}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelamar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lowongan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Lamar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Memuat data lamaran...
                  </td>
                </tr>
              ) : lamaranList.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <h3 className="text-lg font-semibold">Tidak Ada Lamaran</h3>
                    <p className="mt-1">
                      Belum ada lamaran yang masuk untuk lowongan yang dipilih.
                    </p>
                  </td>
                </tr>
              ) : (
                lamaranList.map((lamaran) => (
                  <tr key={lamaran.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lamaran.users?.nama || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lamaran.lowongan?.judul || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(lamaran.tanggal_lamar).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={lamaran.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Lihat CV
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={lamaran.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => updateStatus(lamaran.id, "diterima")}
                        className="bg-green-100 text-green-800 px-3 py-1.5 rounded-md font-semibold hover:bg-green-200 transition-colors disabled:opacity-50"
                        disabled={lamaran.status === "diterima"}
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => updateStatus(lamaran.id, "ditolak")}
                        className="bg-red-100 text-red-800 px-3 py-1.5 rounded-md font-semibold hover:bg-red-200 transition-colors disabled:opacity-50"
                        disabled={lamaran.status === "ditolak"}
                      >
                        Tolak
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PerusahaanLayout>
  );
};

export default ProsesLamaran;
