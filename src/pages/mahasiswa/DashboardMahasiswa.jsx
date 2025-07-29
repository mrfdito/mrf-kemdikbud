import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MahasiswaLayout from "../../components/layouts/MahasiswaLayout";
import { supabase } from "../../services/supabase";

const DashboardMahasiswa = () => {
  const [jumlahLamaran, setJumlahLamaran] = useState(0);
  const [statusAkun, setStatusAkun] = useState("loading");

  useEffect(() => {
    const fetchData = async () => {
      const session = localStorage.getItem("userSession");

      if (!session) return;

      const user = JSON.parse(session);
      setStatusAkun(user.status); // status: approved, waiting, rejected

      // Ambil jumlah lamaran
      const { data, error } = await supabase
        .from("lamaran")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      if (!error) {
        setJumlahLamaran(data.length);
      }
    };

    fetchData();
  }, []);

  return (
    <MahasiswaLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard Mahasiswa</h1>

        {/* STATUS AKUN */}
        <div className="mb-6">
          <p className="text-lg">
            <span className="font-semibold">Status Akun:</span>{" "}
            <span
              className={`px-2 py-1 rounded ${
                statusAkun === "approved"
                  ? "bg-green-200 text-green-800"
                  : statusAkun === "waiting"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {statusAkun}
            </span>
          </p>
        </div>

        {/* RINGKASAN LAMARAN */}
        <div className="mb-6">
          <p className="text-lg">
            <span className="font-semibold">Total Lamaran:</span>{" "}
            {jumlahLamaran}
          </p>
        </div>

        {/* LINK NAVIGASI */}
        <div className="space-x-4">
          <Link
            to="/mahasiswa/lowongan"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cari Lowongan
          </Link>
          <Link
            to="/mahasiswa/lamaran"
            className="inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Lamaran Saya
          </Link>
        </div>
      </div>
    </MahasiswaLayout>
  );
};

export default DashboardMahasiswa;
