// src/pages/admin/Statistics.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import AdminLayout from "../../components/layouts/AdminLayout";
import StatisticsCard from "../../components/admin/StatisticsCard";

// Import Chart.js components. Asumsi menggunakan react-chartjs-2
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

// Registrasi komponen Chart.js yang akan digunakan
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Komponen lokal untuk membungkus setiap chart agar rapi
const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
    <div className="flex-grow flex items-center justify-center">{children}</div>
  </div>
);

const Statistics = () => {
  const [stats, setStats] = useState({
    mahasiswa: 0,
    perusahaan: 0,
    lowongan: 0,
    lamaran: 0,
  });

  const [pieUserData, setPieUserData] = useState(null);
  const [barLamaranData, setBarLamaranData] = useState(null);
  const [barKategoriData, setBarKategoriData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi utilitas untuk mengambil count dari tabel
  const fetchCount = async (table, filter = {}) => {
    let query = supabase
      .from(table)
      .select("id", { count: "exact", head: true });
    for (const key in filter) {
      query = query.eq(key, filter[key]);
    }
    const { count } = await query;
    return count || 0;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch data statistik utama secara paralel
      const [mahasiswa, perusahaan, lowongan, lamaran] = await Promise.all([
        fetchCount("users", { role: "mahasiswa" }),
        fetchCount("users", { role: "perusahaan" }),
        fetchCount("lowongan", { status: "aktif" }),
        fetchCount("lamaran"),
      ]);
      setStats({ mahasiswa, perusahaan, lowongan, lamaran });

      // 2. Fetch data untuk chart status user secara paralel
      const userStatusLabels = [
        "waiting",
        "approved",
        "rejected",
        "processing",
      ];
      const userStatusPromises = userStatusLabels.map((status) =>
        fetchCount("users", { status })
      );
      const userStatusCounts = await Promise.all(userStatusPromises);
      setPieUserData({
        labels: userStatusLabels,
        datasets: [
          {
            data: userStatusCounts,
            backgroundColor: ["#FBBF24", "#34D399", "#EF4444", "#60A5FA"],
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      });

      // 3. Fetch data untuk chart status lamaran secara paralel
      const lamaranStatusLabels = ["proses", "diterima", "ditolak"];
      const lamaranStatusPromises = lamaranStatusLabels.map((s) =>
        fetchCount("lamaran", { status: s })
      );
      const lamaranStatusCounts = await Promise.all(lamaranStatusPromises);
      setBarLamaranData({
        labels: lamaranStatusLabels,
        datasets: [
          {
            label: "Jumlah Lamaran",
            data: lamaranStatusCounts,
            backgroundColor: "#3B82F6",
          },
        ],
      });

      // 4. Fetch data untuk chart lowongan per kategori
      const { data: kategoriData, error } = await supabase
        .from("kategori")
        .select("id, nama, lowongan(id)");
      if (error) throw error;

      const kategoriLabels = kategoriData?.map((item) => item.nama) || [];
      const kategoriCounts =
        kategoriData?.map((item) => item.lowongan.length) || [];
      setBarKategoriData({
        labels: kategoriLabels,
        datasets: [
          {
            label: "Lowongan per Kategori",
            data: kategoriCounts,
            backgroundColor: "#10B981",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      // Handle error, maybe show a notification to the user
    } finally {
      setLoading(false);
    }
  };

  // Opsi umum untuk charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Memuat data statistik...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Statistik Platform
      </h1>

      {/* Bagian Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatisticsCard title="Total Mahasiswa" value={stats.mahasiswa} />
        <StatisticsCard title="Total Perusahaan" value={stats.perusahaan} />
        <StatisticsCard title="Lowongan Aktif" value={stats.lowongan} />
        <StatisticsCard title="Total Lamaran" value={stats.lamaran} />
      </div>

      {/* Bagian Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {pieUserData && (
          <ChartContainer title="Status User">
            <div className="w-full h-64 md:h-80">
              <Pie data={pieUserData} options={chartOptions} />
            </div>
          </ChartContainer>
        )}
        {barLamaranData && (
          <ChartContainer title="Lamaran per Status">
            <div className="w-full h-64 md:h-80">
              <Bar data={barLamaranData} options={chartOptions} />
            </div>
          </ChartContainer>
        )}
        {barKategoriData && (
          <div className="lg:col-span-2">
            <ChartContainer title="Lowongan per Kategori">
              <div className="w-full h-64 md:h-80">
                <Bar data={barKategoriData} options={chartOptions} />
              </div>
            </ChartContainer>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Statistics;
