import React from "react";
import PortalLayout from "../../components/layouts/PortalLayout";

// Komponen Ikon minimalis
const MinimalistIcon = ({ children }) => (
  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
    {children}
  </div>
);

// Komponen Kartu Timeline
const TimelineItem = ({ year, title, children, isLast = false }) => (
  <div className="relative pl-8 sm:pl-32 py-6 group">
    {/* Garis vertikal timeline */}
    {!isLast && (
      <div className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-slate-200 group-hover:bg-blue-300 transition-colors duration-300"></div>
    )}
    {/* Titik pada timeline */}
    <div className="absolute top-5 left-4 -ml-px h-4 w-4 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors duration-300"></div>
    <div className="pl-4">
      <p className="text-sm font-semibold text-blue-600 tracking-wider">
        {year}
      </p>
      <h4 className="mt-2 text-xl font-bold text-slate-900">{title}</h4>
      <p className="mt-1 text-slate-600">{children}</p>
    </div>
  </div>
);

const About = () => {
  return (
    <PortalLayout>
      <div className="bg-white">
        {/* 1. Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tighter">
                Kami Percaya Setiap Mahasiswa Berhak Mendapat Awal Terbaik.
              </h1>
              <p className="mt-6 text-xl text-slate-600">
                Di MRF Group, kami tidak hanya membangun platform. Kami
                membangun jembatan—menghubungkan ambisi talenta muda Indonesia
                dengan dunia industri yang dinamis untuk menciptakan masa depan
                karier yang cemerlang.
              </p>
            </div>
            <div className="lg:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop"
                alt="Tim profesional muda sedang berdiskusi"
                className="rounded-2xl shadow-2xl w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 2. Cerita Kami: Visi & Misi */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Cerita Kami: Visi & Misi yang Menggerakkan
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Berawal dari sebuah ide sederhana untuk memecahkan masalah
              nyata—kesulitan mahasiswa menemukan magang berkualitas dan
              kesulitan perusahaan merekrut talenta yang tepat—MRF Group lahir.
              Misi kami adalah untuk menyederhanakan dan men-demokratisasi akses
              ke peluang karier. Visi kami adalah melihat Indonesia yang
              ditenagai oleh generasi muda yang kompeten, berpengalaman, dan
              siap menghadapi tantangan global.
            </p>
          </div>
        </section>

        {/* 3. Dampak Kami dalam Angka */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Dampak Kami dalam Angka
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Kami mengukur kesuksesan dari dampak nyata yang kami ciptakan.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="border-b-4 border-blue-200 p-8">
                <p className="text-5xl font-extrabold text-blue-600">10,000+</p>
                <p className="mt-2 text-base text-slate-600">
                  Mahasiswa Terhubung
                </p>
              </div>
              <div className="border-b-4 border-blue-200 p-8">
                <p className="text-5xl font-extrabold text-blue-600">500+</p>
                <p className="mt-2 text-base text-slate-600">
                  Mitra Perusahaan Aktif
                </p>
              </div>
              <div className="border-b-4 border-blue-200 p-8">
                <p className="text-5xl font-extrabold text-blue-600">95%</p>
                <p className="mt-2 text-base text-slate-600">
                  Tingkat Kepuasan Pengguna
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Perjalanan Kami (Timeline Historis) */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Perjalanan Kami Hingga Kini
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Setiap langkah adalah bukti komitmen kami untuk terus tumbuh dan
                berinovasi.
              </p>
            </div>
            <div>
              <TimelineItem year="2022" title="Kelahiran Sebuah Ide">
                MRF Group didirikan oleh sekelompok visioner dengan satu tujuan:
                memecahkan masalah fundamental dalam ekosistem magang di
                Indonesia. Fase riset dan pengembangan dimulai.
              </TimelineItem>
              <TimelineItem
                year="2023"
                title="Peluncuran Platform & 100 Mitra Pertama"
              >
                Versi beta platform kami diluncurkan ke publik. Dalam enam
                bulan, kami berhasil menjalin kemitraan dengan 100 perusahaan
                pertama yang visioner.
              </TimelineItem>
              <TimelineItem
                year="2024"
                title="Pencapaian 10,000 Mahasiswa & Penghargaan Awal"
              >
                Platform kami menghubungkan lebih dari 10,000 mahasiswa dengan
                peluang magang. Kami juga menerima penghargaan pertama kami
                sebagai 'Social Impact of the Year'.
              </TimelineItem>
              <TimelineItem
                year="2025"
                title="Inovasi & Ekspansi"
                isLast={true}
              >
                Meluncurkan fitur analitik untuk perusahaan dan bimbingan karier
                untuk mahasiswa. Visi kami berkembang untuk menjadi pusat
                pengembangan karier terlengkap di Asia Tenggara.
              </TimelineItem>
            </div>
          </div>
        </section>

        {/* 5. Penghargaan & Pengakuan */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Penghargaan & Pengakuan
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Dedikasi kami diakui oleh para ahli di industri.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
                <h3 className="text-xl font-semibold text-blue-600">
                  Platform Edu-Tech Terbaik
                </h3>
                <p className="mt-1 text-slate-600">
                  Tech Innovators Award 2025
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
                <h3 className="text-xl font-semibold text-blue-600">
                  Social Impact of the Year
                </h3>
                <p className="mt-1 text-slate-600">
                  Indonesia Digital Awards 2024
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
                <h3 className="text-xl font-semibold text-blue-600">
                  Top 10 Startup to Watch
                </h3>
                <p className="mt-1 text-slate-600">Startup Weekly Magazine</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PortalLayout>
  );
};

export default About;
