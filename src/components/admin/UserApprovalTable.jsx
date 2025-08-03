import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

const UserApprovalTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("mahasiswa");

  useEffect(() => {
    const fetchProcessingUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("status", "processing")
        .eq("role", selectedRole);

      if (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    fetchProcessingUsers();
  }, [selectedRole]);

  const handleApprove = async (user) => {
    let updatedStatus = "waiting";
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

  const RoleBadge = ({ role }) => {
    const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full capitalize";
    const styles = {
      mahasiswa: `bg-blue-100 text-blue-800 ${baseStyle}`,
      perusahaan: `bg-green-100 text-green-800 ${baseStyle}`,
      default: `bg-gray-100 text-gray-800 ${baseStyle}`,
    };
    return <span className={styles[role] || styles.default}>{role}</span>;
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Persetujuan Pengguna Baru
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 sm:p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setSelectedRole("mahasiswa")}
            className={`w-full sm:w-auto px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              selectedRole === "mahasiswa"
                ? "bg-white text-blue-600 shadow"
                : "bg-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Mahasiswa
          </button>
          <button
            onClick={() => setSelectedRole("perusahaan")}
            className={`w-full sm:w-auto px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              selectedRole === "perusahaan"
                ? "bg-white text-blue-600 shadow"
                : "bg-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Perusahaan
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-50 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="min-w-[140px] p-3">Nama</th>
              <th className="min-w-[160px] p-3">Identitas (NIM/NIB)</th>
              <th className="min-w-[100px] p-3">Peran</th>
              <th className="min-w-[120px] p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-6 text-gray-500 capitalize"
                >
                  Tidak ada {selectedRole} yang membutuhkan persetujuan.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-gray-900">
                    {user.nama || "-"}
                  </td>
                  <td className="p-4 text-gray-600">{user.identitas}</td>
                  <td className="p-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="p-4 space-x-2 text-center">
                    <button
                      onClick={() => handleApprove(user)}
                      className="bg-green-100 text-green-800 px-3 py-1.5 rounded-md font-semibold hover:bg-green-200 transition-colors"
                    >
                      Setujui
                    </button>
                    <button
                      onClick={() => handleReject(user)}
                      className="bg-red-100 text-red-800 px-3 py-1.5 rounded-md font-semibold hover:bg-red-200 transition-colors"
                    >
                      Tolak
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserApprovalTable;
