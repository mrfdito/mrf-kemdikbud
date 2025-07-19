import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

const UserApprovalTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchProcessingUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("status", "processing");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchProcessingUsers();
  }, []);

  const handleApprove = async (user) => {
    let updatedStatus = "waiting"; // default untuk semua role

    // mahasiswa: waiting → agar bisa apply nanti
    // perusahaan: waiting → agar bisa login (belum bisa upload lowongan)

    const { error } = await supabase
      .from("users")
      .update({ status: updatedStatus })
      .eq("id", user.id);

    if (error) {
      console.error("Failed to approve:", error);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
  };

  const handleReject = async (user) => {
    const { error } = await supabase
      .from("users")
      .update({ status: "rejected" })
      .eq("id", user.id);

    if (error) {
      console.error("Failed to reject:", error);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Persetujuan User Pending</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Identitas</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.nama || "Tidak Ada Nama"}</td>
              <td className="border p-2">{user.identitas}</td>
              <td className="border p-2 capitalize">{user.role}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleApprove(user)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
          {users?.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                Tidak ada user processing
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserApprovalTable;
