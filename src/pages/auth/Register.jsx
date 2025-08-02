import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function Register() {
  // --- FUNGSI DAN LOGIKA JAVASCRIPT TIDAK DIUBAH SAMA SEKALI ---
  const [form, setForm] = useState({
    nama: "",
    identitas: "",
    username: "",
    password: "",
    role: "mahasiswa",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // State baru untuk mengelola langkah form
  const [step, setStep] = useState(1);

  const handleRoleChange = (selectedRole) => {
    setForm((prev) => ({ ...prev, role: selectedRole, identitas: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username" && /\s/.test(value)) {
      setError("Username tidak boleh mengandung spasi.");
    } else {
      setError("");
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (/\s/.test(form.username)) {
      setError("Username tidak boleh mengandung spasi.");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");

    const { error: insertError } = await supabase.from("users").insert({
      nama: form.nama,
      identitas: form.identitas,
      username: form.username,
      password: form.password,
      role: form.role,
      status: "processing",
    });

    if (insertError) {
      setError(`Gagal mendaftar: ${insertError.message}`);
    } else {
      setMessage("Pendaftaran berhasil! Akun Anda sedang ditinjau oleh admin.");
      setTimeout(() => navigate("/login"), 3000);
    }
    setLoading(false);
  };

  // --- PERUBAHAN HANYA PADA BAGIAN TAMPILAN (JSX) DI BAWAH INI ---
  return (
    <div className="min-h-screen bg-slate-400 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
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

      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Satu langkah lagi menuju ribuan peluang karier.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Notifikasi */}
            {message && (
              <div
                className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 text-sm"
                role="alert"
              >
                <p>{message}</p>
              </div>
            )}
            {error && (
              <div
                className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 text-sm"
                role="alert"
              >
                <p>{error}</p>
              </div>
            )}

            {/* Stepper */}
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span
                  className={`font-medium ${
                    step === 1 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Detail Pengguna
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span
                  className={`font-medium ${
                    step === 2 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  Info Akun
                </span>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Saya mendaftar sebagai
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRoleChange("mahasiswa")}
                      className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors border ${
                        form.role === "mahasiswa"
                          ? "bg-blue-600 text-white border-blue-600 shadow"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Mahasiswa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange("perusahaan")}
                      className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors border ${
                        form.role === "perusahaan"
                          ? "bg-blue-600 text-white border-blue-600 shadow"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Perusahaan
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    placeholder="Masukkan nama lengkap Anda"
                    value={form.nama}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {form.role === "mahasiswa"
                      ? "NIM (Nomor Induk Mahasiswa)"
                      : "NIB (Nomor Induk Berusaha)"}
                  </label>
                  <input
                    type="text"
                    name="identitas"
                    placeholder={`Masukkan ${
                      form.role === "mahasiswa" ? "NIM" : "NIB"
                    }`}
                    value={form.identitas}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex justify-center bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-gray-800 transition-all"
                >
                  Selanjutnya
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Buat username (tanpa spasi)"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className={`mt-1 w-full border px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      /\s/.test(form.username)
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 flex justify-center bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 flex justify-center bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all disabled:bg-blue-400"
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
                      "Daftar Sekarang"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-600">Sudah punya akun? </span>
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
