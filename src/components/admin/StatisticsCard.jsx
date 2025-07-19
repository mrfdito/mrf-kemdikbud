// src/components/admin/StatisticsCard.jsx
import React from "react";

const StatisticsCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatisticsCard;
