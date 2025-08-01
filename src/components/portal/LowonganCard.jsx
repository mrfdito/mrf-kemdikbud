import React from "react";
import { Link } from "react-router-dom";

// Helper function untuk menghitung sisa hari
const calculateRemainingDays = (deadline) => {
  if (!deadline) return { text: "Tidak ditentukan", color: "text-gray-500" };
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.setHours(23, 59, 59, 999) - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return { text: "Telah Berakhir", color: "text-gray-500 font-medium" };
  if (diffDays <= 1)
    return { text: "Berakhir Hari Ini", color: "text-red-600 font-bold" };
  return {
    text: `Sisa ${diffDays} hari`,
    color: "text-yellow-600 font-medium",
  };
};

const LowonganCard = ({ lowongan }) => {
  const deadlineInfo = calculateRemainingDays(lowongan.deadline);

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300">
      <div className="p-5 flex-grow">
        <p className="text-sm font-semibold text-blue-700 mb-2">
          {lowongan.perusahaan?.nama}
        </p>
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          <Link to={`/lowongan/${lowongan.id}`} className="hover:underline">
            {lowongan.judul}
          </Link>
        </h3>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{lowongan.lokasi}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v-3a2 2 0 012-2z"
              />
            </svg>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
              {lowongan.kategori?.nama}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <svg
            className={`h-4 w-4 shrink-0 ${deadlineInfo.color}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={`text-xs ${deadlineInfo.color}`}>
            {deadlineInfo.text}
          </span>
        </div>
        <Link
          to={`/portal/lowongan/${lowongan.id}`}
          className="block w-30 text-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default LowonganCard;
