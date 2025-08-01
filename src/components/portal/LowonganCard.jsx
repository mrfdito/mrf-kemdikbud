import React from "react";
import { Link } from "react-router-dom";

const LowonganCard = ({ lowongan }) => {
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md">
      <h2 className="text-lg font-bold text-blue-700">{lowongan.judul}</h2>
      <p className="text-sm text-gray-600 mb-1">
        {lowongan.perusahaan?.nama} • {lowongan.kategori?.nama}
      </p>
      <p className="text-gray-700">Lokasi: {lowongan.lokasi}</p>
      <p className="text-sm text-gray-500">
        Deadline: {lowongan.deadline || "Tidak ditentukan"}
      </p>

      <div className="mt-4 text-right">
        <Link
          to={`/portal/lowongan/${lowongan.id}`}
          className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition"
        >
          Cek Detail
        </Link>
      </div>
    </div>
  );
};

export default LowonganCard;
