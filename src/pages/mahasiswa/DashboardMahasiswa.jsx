import React from "react";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";

const DashboardMahasiswa = () => {
  return (
    <MahasiswaLayout>
      <h1 className="text-2xl font-semibold mb-4">Selamat Datang!</h1>
      <p>Ini adalah dashboard mahasiswa.</p>
    </MahasiswaLayout>
  );
};

export default DashboardMahasiswa;
