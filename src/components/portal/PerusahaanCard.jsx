// src/components/portal/PerusahaanCard.jsx
import React from "react";

const PerusahaanCard = ({ perusahaan }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-bold text-gray-800">{perusahaan.nama}</h2>
      <p className="text-sm text-gray-600">NIB: {perusahaan.identitas}</p>
      <p className="text-sm text-gray-500 mt-1">Status: {perusahaan.status}</p>
    </div>
  );
};

export default PerusahaanCard;
