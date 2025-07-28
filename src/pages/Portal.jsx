import { useNavigate } from "react-router-dom";

export default function Portal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 text-center">
      <main className="flex flex-col items-center justify-center flex-grow">
        {/* Hero Section */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Buka Pintu Karirmu
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl">
          Platform eksklusif yang menjembatani talenta mahasiswa dengan peluang
          magang terbaik di perusahaan mitra ternama.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
        >
          Jelajahi Peluang Sekarang
        </button>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-white p-8 border rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              🔍 Pencarian Cerdas
            </h3>
            <p className="text-gray-600">
              Filter lowongan magang berdasarkan jurusan, keahlian, dan lokasi
              perusahaan impianmu.
            </p>
          </div>
          <div className="bg-white p-8 border rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              📝 Proses Lamaran Terpadu
            </h3>
            <p className="text-gray-600">
              Satu profil lengkap untuk melamar ke berbagai posisi tanpa perlu
              mengisi formulir berulang kali.
            </p>
          </div>
          <div className="bg-white p-8 border rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              📊 Pantau Status Real-time
            </h3>
            <p className="text-gray-600">
              Dapatkan notifikasi dan lihat progres lamaranmu langsung dari
              dashboard akun pribadimu.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-16 py-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Website Magang Universitas. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}
