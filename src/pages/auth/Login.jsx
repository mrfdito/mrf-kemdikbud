import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function LoginPage() {
  // --- FUNGSI DAN LOGIKA JAVASCRIPT TIDAK DIUBAH SAMA SEKALI ---
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) {
      const user = JSON.parse(session);
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "perusahaan") {
        navigate("/perusahaan/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      setErrorMsg("Username atau password salah.");
      setLoading(false);
      return;
    }

    const { id, role, status } = data;
    localStorage.setItem("userSession", JSON.stringify({ id, role, status }));
    localStorage.setItem("user_id", id);

    if (role === "mahasiswa") {
      if (status === "processing") {
        alert("Akun Anda masih dalam proses verifikasi oleh admin.");
        setLoading(false);
        return;
      }
      if (status === "rejected") {
        alert("Akun Anda ditolak. Silakan hubungi admin.");
        setLoading(false);
        return;
      }
      navigate("/mahasiswa/dashboard");
    } else if (role === "perusahaan") {
      if (status === "processing") {
        alert("Akun perusahaan Anda masih dalam proses verifikasi oleh admin.");
        setLoading(false);
        return;
      }
      if (status === "rejected") {
        alert("Akun perusahaan Anda ditolak. Silakan hubungi admin.");
        setLoading(false);
        return;
      }
      if (status === "waiting") {
        alert("Akun perusahaan Anda masih menunggu persetujuan admin.");
        setLoading(false);
        return;
      }
      if (status === "approved") {
        navigate("/perusahaan/dashboard");
      }
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      setErrorMsg("Role tidak dikenali.");
    }
    setLoading(false);
  };

  // --- PERUBAHAN HANYA PADA BAGIAN TAMPILAN (JSX) DI BAWAH INI ---
  return (
    <div className="min-h-screen w-full bg-slate-400 flex items-center justify-center p-4">
      {/* Tombol Kembali ke Portal */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-200 hover:text-blue-600 transition-colors group z-20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transition-transform group-hover:-translate-x-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Kembali ke Portal
      </Link>

      {/* Kontainer "Melayang" */}
      <div className="w-full max-w-4xl lg:grid lg:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden">
        {/* Sisi Kiri (Glassmorphism) */}
        <div className="hidden lg:flex relative flex-col items-center justify-center bg-blue-600/30 backdrop-blur-lg border border-white/20 p-12 text-center text-white">
          {/* Dekorasi Latar */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/50 rounded-full filter blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-400/50 rounded-full filter blur-2xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold tracking-tight">MRF.kemdikbud</h1>
            <p className="mt-4 text-lg text-blue-100 max-w-sm">
              Gerbang Anda menuju ribuan peluang magang terbaik di seluruh
              Indonesia.
            </p>
          </div>
        </div>

        {/* Sisi Kanan (Form Login Solid) */}
        <div className="bg-white p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full">
            <div className="text-left mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Selamat Datang!
              </h2>
              <p className="mt-2 text-gray-600">
                Silakan masuk untuk melanjutkan.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {errorMsg && (
                <div
                  className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 text-sm"
                  role="alert"
                >
                  <p>{errorMsg}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Belum punya akun? </span>
              <Link
                to="/auth/register"
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Daftar di sini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
