// src/components/admin/Charts.jsx
import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Charts = ({ pieData, barData, titlePie, titleBar }) => {
  const isPieValid = pieData?.datasets?.[0]?.data?.length > 0;
  const isBarValid = barData?.datasets?.[0]?.data?.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">{titlePie}</h3>
        {isPieValid ? <Pie data={pieData} /> : <p>Data tidak tersedia</p>}
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">{titleBar}</h3>
        {isBarValid ? <Bar data={barData} /> : <p>Data tidak tersedia</p>}
      </div>
    </div>
  );
};

export default Charts;
