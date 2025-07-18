import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const UserApprovalTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUnapprovedUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUnapprovedUsers();
  }, []);

  const handleApprove = async (userId) => {
    const { error } = await supabase
      .from("users")
      .update({ status: "approved" })
      .eq("id", userId);

    if (error) {
      console.error("Failed to approve:", error);
    } else {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
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
              <td className="border p-2">
                <button
                  onClick={() => handleApprove(user.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
          {users?.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                Tidak ada user pending
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserApprovalTable;
