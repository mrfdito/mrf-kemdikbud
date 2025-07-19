import React, { useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    nama: "",
    identitas: "",
    username: "",
    password: "",
    role: "mahasiswa",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validasi spasi di username
    if (name === "username" && /\s/.test(value)) {
      setError("Username tidak boleh mengandung spasi");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setError(""); // reset error saat diketik ulang
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi spasi
    if (/\s/.test(form.username)) {
      setError("Username tidak boleh mengandung spasi");
      return;
    }

    // Insert ke Supabase
    const { error: insertError } = await supabase.from("users").insert({
      nama: form.nama,
      identitas: form.identitas,
      username: form.username,
      password: form.password, // ⚠️ password harus di-hash di produksi!
      role: form.role,
      status: "processing", // perubahan dari 'pending' ke 'processing'
    });

    if (insertError) {
      setMessage("");
      setError(`Gagal mendaftar: ${insertError.message}`);
    } else {
      setError("");
      setMessage("Berhasil mendaftar! Akun sedang diproses oleh admin.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      {/* LOGO */}
      <div className="flex justify-center mb-4">
        <img src="/logo.png" alt="Logo MRF" className="h-12" />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">Form Registrasi</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nama"
          placeholder="Nama Lengkap"
          value={form.nama}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="identitas"
          placeholder="NIM / NIB"
          value={form.identitas}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="username"
          placeholder="Username (tanpa spasi)"
          value={form.username}
          onChange={handleChange}
          required
          className={`w-full p-2 border rounded ${
            /\s/.test(form.username) ? "border-red-500" : ""
          }`}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="mahasiswa">Mahasiswa</option>
          <option value="perusahaan">Perusahaan</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Daftar
        </button>
      </form>

      {error && (
        <p className="mt-4 text-center text-sm text-red-600 font-medium">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-4 text-center text-sm text-green-700 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default Register;
