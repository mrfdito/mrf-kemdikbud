import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      setErrorMsg("Username atau password salah.");
      return;
    }

    // ✅ Simpan data user ke localStorage
    localStorage.setItem("user_id", data.id);
    localStorage.setItem("role", data.role);
    localStorage.setItem("status", data.status);

    const { role, status } = data;

    // Role Mahasiswa
    if (role === "mahasiswa") {
      if (status === "processing") {
        alert("Akun Anda masih dalam proses verifikasi oleh admin.");
        return;
      }
      if (status === "rejected") {
        alert("Akun Anda ditolak. Silakan hubungi admin.");
        return;
      }
      if (status === "waiting" || status === "approved") {
        navigate("/#");
        return;
      }
    }

    // Role Perusahaan
    if (role === "perusahaan") {
      if (status === "processing") {
        alert("Akun perusahaan Anda masih dalam proses verifikasi oleh admin.");
        return;
      }
      if (status === "rejected") {
        alert("Akun perusahaan Anda ditolak. Silakan hubungi admin.");
        return;
      }
      if (status === "waiting") {
        alert("Akun perusahaan Anda masih menunggu persetujuan admin.");
        return;
      }
      if (status === "approved") {
        navigate("/perusahaan/dashboard");
        return;
      }
    }

    // Role Admin
    if (role === "admin") {
      navigate("/dashboard-admin");
      return;
    }

    setErrorMsg("Role tidak dikenali.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
