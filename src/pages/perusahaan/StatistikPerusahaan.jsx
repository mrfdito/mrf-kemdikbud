import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const StatistikPerusahaan = () => {
  const [stats, setStats] = useState({
    totalLowongan: 0,
    totalPelamar: 0,
    diterima: 0,
    ditolak: 0,
    pelamarPerLowongan: {},
  });

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchStats = async () => {
      const { data: lowongan, error: lowonganError } = await supabase
        .from("lowongan")
        .select("id, judul")
        .eq("perusahaan_id", userId);

      if (lowonganError) return console.error(lowonganError);

      const lowonganIds = lowongan.map((l) => l.id);

      const { data: lamaran } = await supabase
        .from("lamaran")
        .select("*")
        .in("lowongan_id", lowonganIds);

      const pelamarPerLowongan = {};
      lowongan.forEach((l) => {
        pelamarPerLowongan[l.judul] = lamaran.filter(
          (lm) => lm.lowongan_id === l.id
        ).length;
      });

      setStats({
        totalLowongan: lowongan.length,
        totalPelamar: lamaran.length,
        diterima: lamaran.filter((l) => l.status === "diterima").length,
        ditolak: lamaran.filter((l) => l.status === "ditolak").length,
        pelamarPerLowongan,
      });
    };

    if (userId) fetchStats();
  }, [userId]);

  const pieData = {
    labels: ["Diterima", "Ditolak"],
    datasets: [
      {
        label: "Status Lamaran",
        data: [stats.diterima, stats.ditolak],
        backgroundColor: ["#34d399", "#f87171"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(stats.pelamarPerLowongan),
    datasets: [
      {
        label: "Jumlah Pelamar",
        data: Object.values(stats.pelamarPerLowongan),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  return (
    <PerusahaanLayout>
      <h2 className="text-2xl font-semibold mb-6">Statistik Perusahaan</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-600">Total Lowongan</p>
          <p className="text-xl font-bold">{stats.totalLowongan}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-600">Total Pelamar</p>
          <p className="text-xl font-bold">{stats.totalPelamar}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-600">Diterima</p>
          <p className="text-xl font-bold">{stats.diterima}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-600">Ditolak</p>
          <p className="text-xl font-bold">{stats.ditolak}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Status Pelamar</h3>
          <Pie data={pieData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4">Pelamar per Lowongan</h3>
          <Bar data={barData} />
        </div>
      </div>
    </PerusahaanLayout>
  );
};

export default StatistikPerusahaan;
