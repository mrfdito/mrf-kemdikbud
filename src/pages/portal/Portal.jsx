import React from "react";
import { Link } from "react-router-dom";
import PortalLayout from "../../components/layouts/PortalLayout";

// Komponen Ikon untuk clean code
const Icon = ({ path }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const Portal = () => {
  return (
    <PortalLayout>
      {/* Hero Section */}
      <section className="pt-20 pb-24 bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Gerbang Menuju Karier Impian.{" "}
              <span className="text-blue-600">Mulai dari Sini.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              MRF.kemdikbud adalah ekosistem yang dirancang untuk memberdayakan
              mahasiswa Indonesia dengan menghubungkan bakat Anda ke peluang
              magang terbaik di perusahaan inovatif.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to="/lowongan"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Jelajahi Peluang
              </Link>
              <Link
                to="#langkah-mudah"
                className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Lihat Cara Kerja
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            {/* Gambar Hero Section */}
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
              alt="Tim sedang berkolaborasi"
              className="rounded-xl shadow-2xl object-cover w-full h-96"
            />
          </div>
        </div>
      </section>

      {/* Mitra Perusahaan */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h3 className="font-semibold text-gray-600 tracking-wider">
            DIPERCAYA OLEH PERUSAHAAN KELAS DUNIA
          </h3>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-x-12 sm:gap-x-16 gap-y-8">
            {/* Logo Perusahaan Global */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png"
              alt="Logo Google"
              className="h-8 sm:h-9 filter grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png"
              alt="Logo Microsoft"
              className="h-8 sm:h-9 filter grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png"
              alt="Logo Amazon"
              className="h-9 sm:h-10 filter grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/1200px-Meta-Logo.png"
              alt="Logo Meta"
              className="h-8 sm:h-9 filter grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png"
              alt="Logo Apple"
              className="h-9 sm:h-11 filter grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* Langkah Mudah */}
      <section id="langkah-mudah" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Memulai Perjalanan Kariermu
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Hanya dengan beberapa langkah, Anda selangkah lebih dekat dengan
              magang impian.
            </p>
          </div>

          {/* Timeline Proses */}
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-4">
            {/* Kartu Langkah 1 */}
            <div className="flex-1 bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <span className="absolute top-0 right-0 text-9xl font-extrabold text-gray-100/80 -translate-y-4 translate-x-4 z-0">
                1
              </span>
              <div className="relative z-10">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                  <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Cari & Temukan
                </h3>
                <p className="text-gray-600">
                  Jelajahi ribuan lowongan dan gunakan filter untuk menemukan
                  yang paling cocok untuk Anda.
                </p>
              </div>
            </div>

            {/* Panah Penghubung (Hanya Desktop) */}
            <div className="hidden lg:flex items-center justify-center text-gray-300 px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>

            {/* Kartu Langkah 2 */}
            <div className="flex-1 bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <span className="absolute top-0 right-0 text-9xl font-extrabold text-gray-100/80 -translate-y-4 translate-x-4 z-0">
                2
              </span>
              <div className="relative z-10">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
                  <Icon path="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Lamar Posisi
                </h3>
                <p className="text-gray-600">
                  Siapkan CV terbaikmu dan kirim lamaran dengan mudah melalui
                  platform kami.
                </p>
              </div>
            </div>

            {/* Panah Penghubung (Hanya Desktop) */}
            <div className="hidden lg:flex items-center justify-center text-gray-300 px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>

            {/* Kartu Langkah 3 */}
            <div className="flex-1 bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <span className="absolute top-0 right-0 text-9xl font-extrabold text-gray-100/80 -translate-y-4 translate-x-4 z-0">
                3
              </span>
              <div className="relative z-10">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                  <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Diterima & Berkembang
                </h3>
                <p className="text-gray-600">
                  Terima tawaran, mulai magang, dan dapatkan pengalaman industri
                  yang tak ternilai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Apa Kata Mereka?
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Kisah sukses dari para mahasiswa dan mitra perusahaan kami.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-700 italic text-lg leading-relaxed">
                "Melalui MRF.kemdikbud, saya berhasil mendapatkan magang di
                startup impian saya. Platformnya sangat user-friendly dan
                prosesnya transparan. Pengalaman yang luar biasa!"
              </p>
              <div className="flex items-center mt-6">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="Profil"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Aisha Putri</p>
                  <p className="text-sm text-gray-500">
                    Mahasiswa Desain Komunikasi Visual
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-700 italic text-lg leading-relaxed">
                "Kami menemukan banyak talenta muda berbakat melalui portal ini.
                Proses rekrutmen magang menjadi jauh lebih efisien dan efektif.
                Sangat direkomendasikan untuk perusahaan."
              </p>
              <div className="flex items-center mt-6">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704e"
                  alt="Profil"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Budi Santoso</p>
                  <p className="text-sm text-gray-500">
                    HR Manager di TechCorp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            Sudah Siap Mengambil Langkah Selanjutnya?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Jangan tunda lagi. Ribuan peluang menanti Anda. Buat akun gratis dan
            jadilah bagian dari generasi penerus bangsa yang kompeten dan
            berdaya saing.
          </p>
          <div className="mt-8">
            <Link
              to="/auth/register"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Daftar Sekarang, Gratis!
            </Link>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
};

export default Portal;
