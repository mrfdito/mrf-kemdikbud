import React from "react";

export default function LowonganTable({ lowongan, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Judul</th>
            <th className="px-4 py-2">Kategori</th>
            <th className="px-4 py-2">Lokasi</th>
            <th className="px-4 py-2">Deadline</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {lowongan.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Belum ada lowongan
              </td>
            </tr>
          ) : (
            lowongan.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.judul}</td>
                <td className="px-4 py-2">{item.kategori?.nama || "-"}</td>
                <td className="px-4 py-2">{item.lokasi || "-"}</td>
                <td className="px-4 py-2">{item.deadline || "-"}</td>
                <td className="px-4 py-2 capitalize">{item.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="text-blue-600 hover:underline text-xs"
                    // onClick={() => onEdit(item)}  // nanti kalau mau edit
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline text-xs"
                    onClick={() => onDelete(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
