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
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

// Komponen Kartu Statistik yang Diperbarui
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6">
    <div
      className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Komponen Ikon
const Icon = ({ path }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-7 w-7 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// Komponen Pembungkus Chart yang Diperbarui
const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="flex-grow flex items-center justify-center min-h-[320px]">
      {children}
    </div>
  </div>
);

const StatistikPerusahaan = () => {
  // --- TIDAK ADA PERUBAHAN PADA LOGIKA ATAU VARIABEL ---
  const [stats, setStats] = useState({
    totalLowongan: 0,
    totalPelamar: 0,
    diterima: 0,
    ditolak: 0,
    pelamarPerLowongan: {},
  });
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const { data: lowongan, error: lowonganError } = await supabase
        .from("lowongan")
        .select("id, judul")
        .eq("perusahaan_id", userId);
      if (lowonganError) {
        console.error(lowonganError);
        setLoading(false);
        return;
      }

      const lowonganIds = lowongan.map((l) => l.id);
      if (lowonganIds.length === 0) {
        setStats({
          totalLowongan: 0,
          totalPelamar: 0,
          diterima: 0,
          ditolak: 0,
          pelamarPerLowongan: {},
        });
        setLoading(false);
        return;
      }

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
      setLoading(false);
    };

    fetchStats();
  }, [userId]);

  const pieData = {
    labels: ["Diterima", "Ditolak", "Proses"],
    datasets: [
      {
        data: [
          stats.diterima,
          stats.ditolak,
          stats.totalPelamar - stats.diterima - stats.ditolak,
        ],
        backgroundColor: ["#34D399", "#F87171", "#FBBF24"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: Object.keys(stats.pelamarPerLowongan),
    datasets: [
      {
        label: "Jumlah Pelamar",
        data: Object.values(stats.pelamarPerLowongan),
        backgroundColor: "#60A5FA",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12, padding: 20 } },
    },
    scales: {
      y: { grid: { drawBorder: false } },
      x: { grid: { display: false } },
    },
  };

  // --- PERUBAHAN VISUAL PADA JSX ---
  if (loading) {
    return (
      <PerusahaanLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="h-28 bg-gray-200 rounded-xl"></div>
            <div className="h-28 bg-gray-200 rounded-xl"></div>
            <div className="h-28 bg-gray-200 rounded-xl"></div>
            <div className="h-28 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </PerusahaanLayout>
    );
  }

  return (
    <PerusahaanLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Statistik Perusahaan
          </h1>
          <p className="text-gray-600 mt-1">
            Analisis performa lowongan dan rekrutmen Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Lowongan"
            value={stats.totalLowongan}
            color="bg-indigo-500"
            icon={
              <Icon path="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            }
          />
          <StatCard
            title="Total Pelamar"
            value={stats.totalPelamar}
            color="bg-blue-500"
            icon={
              <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            }
          />
          <StatCard
            title="Diterima"
            value={stats.diterima}
            color="bg-green-500"
            icon={<Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
          />
          <StatCard
            title="Ditolak"
            value={stats.ditolak}
            color="bg-red-500"
            icon={
              <Icon path="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Distribusi Status Lamaran">
            <div className="w-full h-full">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </ChartContainer>
          <ChartContainer title="Jumlah Pelamar per Lowongan">
            <div className="w-full h-full">
              <Bar
                data={barData}
                options={{
                  ...chartOptions,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </ChartContainer>
        </div>
      </div>
    </PerusahaanLayout>
  );
};

export default StatistikPerusahaan;
