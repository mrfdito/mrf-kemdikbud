import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

const EditLowongan = () => {
  const { id } = useParams();
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

  const fetchLowongan = async () => {
    const { data, error } = await supabase
      .from("lowongan")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) setForm(data);
    else console.error("Gagal ambil data:", error);
  };

  const fetchKategori = async () => {
    const { data, error } = await supabase.from("kategori").select("*");
    if (!error) setKategori(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("lowongan").update(form).eq("id", id);

    if (!error) navigate("/perusahaan/kelolalowongan");
    else console.error("Update gagal:", error);
  };

  useEffect(() => {
    fetchLowongan();
    fetchKategori();
  }, [id]);

  return (
    <PerusahaanLayout>
      <h2 className="text-2xl font-semibold mb-6">Edit Lowongan</h2>
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
          value={form.deadline ? form.deadline.split("T")[0] : ""}
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
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </PerusahaanLayout>
  );
};

export default EditLowongan;
