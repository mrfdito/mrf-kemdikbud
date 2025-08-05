import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";
import { supabase } from "../../services/supabase";

// Komponen Ikon
const Icon = ({ path, className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// Komponen Badge Status Lamaran
const LamaranStatusBadge = ({ status }) => {
  let styles = {
    proses: "bg-yellow-100 text-yellow-800",
    diterima: "bg-green-100 text-green-800",
    ditolak: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const DashboardMahasiswa = () => {
  const [user, setUser] = useState(null);
  const [lamaranList, setLamaranList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const session = localStorage.getItem("userSession");
      if (!session) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(session);

      // Ambil detail user (termasuk nama) dan semua lamarannya secara bersamaan
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select(
          `
          *,
          lamaran (
            id,
            status,
            tanggal_lamar,
            lowongan (
              judul,
              perusahaan:users ( nama )
            )
          )
        `
        )
        .eq("id", parsedUser.id)
        .single();

      if (userError) {
        console.error("Gagal mengambil data user dan lamaran:", userError);
      } else {
        setUser(userData);
        // Urutkan lamaran dari yang terbaru
        const sortedLamaran = userData.lamaran.sort(
          (a, b) => new Date(b.tanggal_lamar) - new Date(a.tanggal_lamar)
        );
        setLamaranList(sortedLamaran);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Hitung statistik lamaran
  const stats = useMemo(() => {
    const total = lamaranList.length;
    const diterima = lamaranList.filter((l) => l.status === "diterima").length;
    const ditolak = lamaranList.filter((l) => l.status === "ditolak").length;
    const proses = total - diterima - ditolak;
    return { total, diterima, ditolak, proses };
  }, [lamaranList]);

  if (loading) {
    return (
      <MahasiswaLayout>
        <div className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded-xl"></div>
            <div className="h-16 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </MahasiswaLayout>
    );
  }

  return (
    <MahasiswaLayout>
      <div className="space-y-8">
        {/* Kartu Dasbor Utama */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">
                Halo, {user?.nama || "Mahasiswa"}!
              </h1>
              <p className="mt-1 text-blue-100">
                Selamat datang kembali di dasbor Anda.
              </p>
            </div>
            <span
              className={`mt-4 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                user?.status === "aktif" || user?.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              Status Akun: {user?.status}
            </span>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-4xl font-bold">{stats.total}</p>
              <p className="text-sm text-blue-100">Total Lamaran</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-4xl font-bold">{stats.diterima}</p>
              <p className="text-sm text-blue-100">Diterima</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-4xl font-bold">{stats.ditolak}</p>
              <p className="text-sm text-blue-100">Ditolak</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="text-4xl font-bold">{stats.proses}</p>
              <p className="text-sm text-blue-100">Dalam Proses</p>
            </div>
          </div>
        </div>

        {/* Daftar Lamaran Terbaru */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Lamaran Terbaru</h2>
            <Link
              to="/mahasiswa/lamaran"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Lihat Semua
            </Link>
          </div>
          {lamaranList.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold text-gray-800">
                Anda Belum Melamar Lowongan Apapun
              </h3>
              <p className="mt-1 text-gray-500 mb-4">
                Ayo mulai cari peluang magang terbaik untukmu!
              </p>
              <Link
                to="/mahasiswa/lowongan"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:bg-blue-700"
              >
                Cari Lowongan
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {lamaranList.slice(0, 2).map((lamaran) => (
                <li
                  key={lamaran.id}
                  className="py-4 flex flex-col sm:flex-row justify-between items-start"
                >
                  <div>
                    <p className="text-md font-semibold text-gray-900">
                      {lamaran.lowongan?.judul || "Lowongan Dihapus"}
                    </p>
                    <p className="text-sm text-gray-500">
                      di {lamaran.lowongan?.perusahaan?.nama || "Perusahaan"}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <LamaranStatusBadge status={lamaran.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MahasiswaLayout>
  );
};

export default DashboardMahasiswa;
