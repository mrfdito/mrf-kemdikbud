import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLowongan: 0,
    totalPelamar: 0,
    diterima: 0,
    ditolak: 0,
  });

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchStats = async () => {
      const { data: lowongan, error: lowonganError } = await supabase
        .from("lowongan")
        .select("id")
        .eq("perusahaan_id", userId);

      if (lowonganError) return console.error(lowonganError);

      const lowonganIds = lowongan.map((l) => l.id);

      const { data: lamaran } = await supabase
        .from("lamaran")
        .select("*")
        .in("lowongan_id", lowonganIds);

      setStats({
        totalLowongan: lowongan.length,
        totalPelamar: lamaran.length,
        diterima: lamaran.filter((l) => l.status === "diterima").length,
        ditolak: lamaran.filter((l) => l.status === "ditolak").length,
      });
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  return (
    <PerusahaanLayout>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Perusahaan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Total Lowongan</p>
          <p className="text-3xl font-bold">{stats.totalLowongan}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Total Pelamar</p>
          <p className="text-3xl font-bold">{stats.totalPelamar}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Diterima</p>
          <p className="text-3xl font-bold">{stats.diterima}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Ditolak</p>
          <p className="text-3xl font-bold">{stats.ditolak}</p>
        </div>
      </div>
    </PerusahaanLayout>
  );
};

export default Dashboard;
