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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center px-4">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group"
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
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Masuk ke Akun Anda
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Akses peluang magang terbaik
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 text-sm rounded-md">
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
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
                <span>Memproses...</span>
              </div>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
