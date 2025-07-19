import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

const MagangListTable = () => {
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowongan();
  }, []);

  const fetchLowongan = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lowongan")
      .select(
        "id, judul, lokasi, deadline, status, users(nama), kategori(nama)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data lowongan:", error.message);
    } else {
      setLowongan(data);
    }
    setLoading(false);
  };

  if (loading) return <p>Memuat data lowongan...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Judul</th>
            <th className="py-2 px-4 border-b text-left">Perusahaan</th>
            <th className="py-2 px-4 border-b text-left">Lokasi</th>
            <th className="py-2 px-4 border-b text-left">Deadline</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Kategori</th>
          </tr>
        </thead>
        <tbody>
          {lowongan.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{item.judul}</td>
              <td className="py-2 px-4 border-b">{item.users?.nama || "-"}</td>
              <td className="py-2 px-4 border-b">{item.lokasi || "-"}</td>
              <td className="py-2 px-4 border-b">
                {item.deadline
                  ? new Date(item.deadline).toLocaleDateString("id-ID")
                  : "-"}
              </td>
              <td className="py-2 px-4 border-b capitalize">{item.status}</td>
              <td className="py-2 px-4 border-b">
                {item.kategori?.nama || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MagangListTable;
