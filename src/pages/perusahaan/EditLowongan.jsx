import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../services/supabase";
import PerusahaanLayout from "../../components/layouts/PerusahaanLayout";

// Komponen helper untuk setiap field form
const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const EditLowongan = () => {
  // --- FUNGSI & LOGIKA TIDAK DIUBAH SAMA SEKALI ---
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
  const [loading, setLoading] = useState(true); // Ditambahkan untuk UX
  const [saving, setSaving] = useState(false); // Ditambahkan untuk UX
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const lowonganPromise = supabase
        .from("lowongan")
        .select("*")
        .eq("id", id)
        .single();
      const kategoriPromise = supabase.from("kategori").select("*");

      const [lowonganRes, kategoriRes] = await Promise.all([
        lowonganPromise,
        kategoriPromise,
      ]);

      if (lowonganRes.error)
        console.error("Gagal ambil data lowongan:", lowonganRes.error);
      else setForm(lowonganRes.data);

      if (kategoriRes.error)
        console.error("Gagal ambil data kategori:", kategoriRes.error);
      else setKategori(kategoriRes.data);

      setLoading(false);
    };
    fetchAllData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("lowongan").update(form).eq("id", id);
    if (!error) {
      navigate("/perusahaan/kelolalowongan");
    } else {
      console.error("Update gagal:", error);
    }
    setSaving(false);
  };

  // --- PERUBAHAN VISUAL HANYA PADA BAGIAN JSX DI BAWAH INI ---
  if (loading) {
    return (
      <PerusahaanLayout>
        <div className="text-center p-10">Memuat data lowongan...</div>
      </PerusahaanLayout>
    );
  }

  return (
    <PerusahaanLayout>
      {/* Header Halaman */}
      <div>
        <Link
          to="/perusahaan/kelolalowongan"
          className="text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-2 mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Kembali ke Kelola Lowongan
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Lowongan</h1>
        <p className="mt-1 text-gray-600">
          Perbarui detail untuk lowongan "{form.judul}"
        </p>
      </div>

      {/* Form Kontainer */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="space-y-8 divide-y divide-gray-200">
          {/* Bagian 1: Informasi Utama */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Informasi Utama
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField label="Judul Lowongan">
                  <input
                    type="text"
                    name="judul"
                    value={form.judul}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </FormField>
              </div>
              <div className="md:col-span-2">
                <FormField label="Deskripsi Singkat">
                  <textarea
                    name="deskripsi"
                    rows={4}
                    value={form.deskripsi}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </FormField>
              </div>
              <FormField label="Kategori">
                <select
                  name="kategori_id"
                  value={form.kategori_id}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="">Pilih Kategori</option>
                  {kategori.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.nama}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Lokasi">
                <input
                  type="text"
                  name="lokasi"
                  value={form.lokasi}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </FormField>
              <FormField label="Deadline Pendaftaran">
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline ? form.deadline.split("T")[0] : ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </FormField>
            </div>
          </div>

          {/* Bagian 2: Kualifikasi & Persyaratan */}
          <div className="pt-8">
            <h3 className="text-lg font-semibold text-gray-900">
              Kualifikasi & Persyaratan
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Latar Belakang Pendidikan">
                <textarea
                  name="latar_belakang_pendidikan"
                  rows={3}
                  value={form.latar_belakang_pendidikan}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </FormField>
              <FormField label="Kompetensi Teknis">
                <textarea
                  name="kompetensi_teknis"
                  rows={3}
                  value={form.kompetensi_teknis}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </FormField>
              <FormField label="Soft Skill">
                <textarea
                  name="soft_skill"
                  rows={3}
                  value={form.soft_skill}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </FormField>
              <FormField label="Persyaratan Khusus">
                <textarea
                  name="persyaratan_khusus"
                  rows={3}
                  value={form.persyaratan_khusus}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </FormField>
            </div>
          </div>

          {/* Bagian 3: Detail Penugasan */}
          <div className="pt-8">
            <h3 className="text-lg font-semibold text-gray-900">
              Detail Penugasan & Pembelajaran
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Rincian Penugasan">
                <textarea
                  name="rincian_penugasan"
                  rows={4}
                  value={form.rincian_penugasan}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </FormField>
              <FormField label="Capaian Pembelajaran">
                <textarea
                  name="capaian_pembelajaran"
                  rows={4}
                  value={form.capaian_pembelajaran}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="pt-6 mt-6 border-t flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </PerusahaanLayout>
  );
};

export default EditLowongan;
