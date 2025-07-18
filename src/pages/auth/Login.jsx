import React, { useState } from "react";
import { supabase } from "../../services/supabase"; // pastikan path-nya sesuai
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password) // ⚠️ pastikan di backend sudah hashed, ini hanya demo
      .single();

    if (error || !data) {
      setErrorMsg("Username atau password salah.");
      return;
    }

    if (data.status === "pending") {
      alert("Akun sudah terdaftar tapi belum di-ACC Admin.");
      return;
    }

    if (data.status === "approved") {
      // simpan session jika perlu
      navigate("/portal");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <label className="block mb-2">Username</label>
        <input
          type="text"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && (
          <p className="text-red-500 text-sm mb-4 text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
