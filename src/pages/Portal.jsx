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
    </div>
  );
}
