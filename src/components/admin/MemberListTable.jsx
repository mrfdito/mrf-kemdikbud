import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

const MemberListTable = ({ role }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, [role]);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", role)
      .in("status", ["waiting", "approved", "rejected"]);

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setMembers(data);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const { error } = await supabase
      .from("users")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Status update error:", error);
    } else {
      fetchMembers(); // Refresh data setelah update
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Nama</th>
            <th className="p-3 border">Identitas</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-t">
              <td className="p-3 border">{member.nama}</td>
              <td className="p-3 border">{member.identitas}</td>
              <td className="p-3 border capitalize">{member.status}</td>
              <td className="p-3 border space-x-2">
                {member.status === "waiting" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(member.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(member.id, "rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                {member.status === "approved" && (
                  <button
                    onClick={() => handleUpdateStatus(member.id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Tolak
                  </button>
                )}

                {member.status === "rejected" && (
                  <button
                    onClick={() => handleUpdateStatus(member.id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Setujui
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberListTable;
