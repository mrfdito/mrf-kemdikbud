import React from "react";
import PortalLayout from "../../components/layouts/PortalLayout";

const About = () => {
  return (
    <PortalLayout>
      <section className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Tentang MRF.Group
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          <strong>MRF.Group</strong> adalah platform digital yang dirancang
          untuk memudahkan mahasiswa dalam menemukan peluang magang yang sesuai
          dengan minat dan jurusan mereka. Kami mempertemukan mahasiswa dengan
          perusahaan dari berbagai sektor industri yang telah terverifikasi,
          dengan sistem yang transparan, aman, dan mudah digunakan.
        </p>

        <p className="text-gray-700 mb-4">
          Dengan MRF.Group, mahasiswa dapat menjelajahi berbagai lowongan magang
          aktif, melamar secara langsung, serta memantau status lamaran mereka.
          Di sisi lain, perusahaan juga dapat dengan mudah mengelola lowongan,
          menerima lamaran, dan merekrut talenta muda berbakat.
        </p>

        <p className="text-gray-700">
          Kami percaya bahwa pengalaman magang yang baik adalah jembatan menuju
          karier yang sukses. MRF.Group hadir untuk mendukung perjalanan itu.
        </p>
      </section>
    </PortalLayout>
  );
};

export default About;
