import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

const TambahLowongan = () => {
  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    lokasi: "",
    deadline: "",
    kategori_id: "",
    rincian_penugasan: "",
    latar_belakang_pendidikan: "",
    kompetensi_teknis: "",
    soft_skill: "",
    persyaratan_khusus: "",
    capaian_pembelajaran: "",
  });

  const [kategori, setKategori] = useState([]);
  const navigate = useNavigate();

  const fetchKategori = async () => {
    const { data, error } = await supabase.from("kategori").select("*");
    if (!error) setKategori(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("user_id");
    if (!userId) return alert("User tidak ditemukan");

    const { error } = await supabase.from("lowongan").insert([
      {
        ...form,
        perusahaan_id: userId,
      },
    ]);

    if (error) {
      alert("Gagal menambahkan lowongan.");
      console.error(error);
    } else {
      navigate("/perusahaan/kelolalowongan");
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  return (
    <PerusahaanLayout>
      <h2 className="text-2xl font-semibold mb-6">Tambah Lowongan</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow max-w-xl"
      >
        <input
          type="text"
          name="judul"
          placeholder="Judul Lowongan"
          className="w-full p-2 border rounded"
          value={form.judul}
          onChange={handleChange}
          required
        />
        <textarea
          name="deskripsi"
          placeholder="Deskripsi Lowongan"
          className="w-full p-2 border rounded"
          rows={4}
          value={form.deskripsi}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lokasi"
          placeholder="Lokasi"
          className="w-full p-2 border rounded"
          value={form.lokasi}
          onChange={handleChange}
        />
        <input
          type="date"
          name="deadline"
          className="w-full p-2 border rounded"
          value={form.deadline}
          onChange={handleChange}
        />
        <select
          name="kategori_id"
          className="w-full p-2 border rounded"
          value={form.kategori_id}
          onChange={handleChange}
          required
        >
          <option value="">Pilih Kategori</option>
          {kategori.map((kat) => (
            <option key={kat.id} value={kat.id}>
              {kat.nama}
            </option>
          ))}
        </select>

        {/* Tambahan Field Baru */}
        <textarea
          name="rincian_penugasan"
          placeholder="Rincian Penugasan"
          className="w-full p-2 border rounded"
          rows={3}
          value={form.rincian_penugasan}
          onChange={handleChange}
        />
        <textarea
          name="latar_belakang_pendidikan"
          placeholder="Latar Belakang Pendidikan"
          className="w-full p-2 border rounded"
          rows={2}
          value={form.latar_belakang_pendidikan}
          onChange={handleChange}
        />
        <textarea
          name="kompetensi_teknis"
          placeholder="Kompetensi Teknis"
          className="w-full p-2 border rounded"
          rows={2}
          value={form.kompetensi_teknis}
          onChange={handleChange}
        />
        <textarea
          name="soft_skill"
          placeholder="Soft Skill"
          className="w-full p-2 border rounded"
          rows={2}
          value={form.soft_skill}
          onChange={handleChange}
        />
        <textarea
          name="persyaratan_khusus"
          placeholder="Persyaratan Khusus"
          className="w-full p-2 border rounded"
          rows={2}
          value={form.persyaratan_khusus}
          onChange={handleChange}
        />
        <textarea
          name="capaian_pembelajaran"
          placeholder="Capaian Pembelajaran"
          className="w-full p-2 border rounded"
          rows={2}
          value={form.capaian_pembelajaran}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </form>
    </PerusahaanLayout>
  );
};

export default TambahLowongan;
