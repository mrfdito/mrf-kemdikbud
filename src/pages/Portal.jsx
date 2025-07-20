import { useNavigate } from "react-router-dom";

export default function Portal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold mb-4">
        Selamat Datang di Website Magang
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Platform yang menghubungkan mahasiswa dengan perusahaan mitra untuk
        program magang berdampak!
      </p>

      <button
        onClick={() => navigate("/login")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Mulai Magang
      </button>

      {/* Fitur tambahan */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">🔍 Cari Lowongan</h3>
          <p className="text-gray-600 text-sm">
            Temukan peluang magang sesuai minat dan jurusanmu.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">📝 Daftar Mudah</h3>
          <p className="text-gray-600 text-sm">
            Cukup satu akun untuk melamar ke berbagai perusahaan mitra.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">📊 Pantau Progres</h3>
          <p className="text-gray-600 text-sm">
            Lihat status lamaran dan update dari perusahaan langsung.
          </p>
        </div>
      </div>
    </div>
  );
}
