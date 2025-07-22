import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

const Dashboard = () => {
  const [lowongan, setLowongan] = useState([]);
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLowongan = async () => {
      const { data, error } = await supabase
        .from("lowongan")
        .select("*")
        .eq("perusahaan_id", userId);

      if (error) return console.error(error);
      setLowongan(data);
    };

    if (userId) fetchLowongan();
  }, [userId]);

  return (
    <PerusahaanLayout>
      <h2 className="text-2xl font-semibold mb-6">Lowongan yang Dibuat</h2>
      <div className="grid gap-4">
        {lowongan.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 shadow rounded-xl cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/perusahaan/lowongan/${item.id}`)}
          >
            <h3 className="text-lg font-bold">{item.judul}</h3>
            <p className="text-gray-600">{item.deskripsi}</p>
            <p className="text-sm text-gray-500 mt-2">
              Deadline: {item.batas_waktu}
            </p>
          </div>
        ))}
      </div>
    </PerusahaanLayout>
  );
};

export default Dashboard;
