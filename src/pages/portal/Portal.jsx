// src/pages/portal/Portal.jsx
import React from "react";
import PortalLayout from "../../components/layouts/PortalLayout";

const Portal = () => {
  return (
    <PortalLayout>
      <section className="text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">
          Selamat Datang di Portal Lowongan
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Temukan peluang karier terbaikmu di sini. Jelajahi berbagai lowongan
          dari perusahaan terverifikasi dan segera kirimkan lamaranmu!
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/lowongan"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Lihat Lowongan
          </a>
          <a
            href="/perusahaan"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Perusahaan
          </a>
        </div>
      </section>
    </PortalLayout>
  );
};

export default Portal;
