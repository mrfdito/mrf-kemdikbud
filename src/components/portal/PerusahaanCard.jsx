import React from "react";

// Helper function untuk mengambil inisial dari nama perusahaan
const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  if (words.length > 1) {
    return words[0].charAt(0) + words[1].charAt(0);
  }
  return name.substring(0, 2);
};

const PerusahaanCard = ({ perusahaan }) => {
  const initials = getInitials(perusahaan.nama);

  return (
    // Kartu dengan efek "Glassmorphism"
    <div className="relative h-full rounded-2xl border border-white/40 bg-white/30 p-6 shadow-lg backdrop-blur-xl transition-all duration-300">
      {/* Monogram Inisial sebagai dekorasi halus di latar belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px] font-black text-gray-900/5 select-none z-0">
        {initials}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-grow">
          {/* Nama Perusahaan dengan tipografi yang bersih dan tajam */}
          <h2 className="text-2xl font-bold text-slate-800">
            {perusahaan.nama}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-sky-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Mitra Terverifikasi</span>
        </div>
      </div>
    </div>
  );
};

export default PerusahaanCard;
