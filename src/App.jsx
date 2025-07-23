import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Portal
import Portal from "./pages/Portal";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageLowongan from "./pages/admin/ManageLowongan";
import ManageUsers from "./pages/admin/ManageUsers";
import Statistics from "./pages/admin/Statistics";

// Perusahaan Pages
import PerusahaanDashboard from "./pages/perusahaan/Dashboard";
import KelolaLowongan from "./pages/perusahaan/KelolaLowongan";
import TambahLowongan from "./pages/perusahaan/TambahLowongan";
import EditLowongan from "./pages/perusahaan/EditLowongan";
import StatistikPerusahaan from "./pages/perusahaan/StatistikPerusahaan";
import DetailLowongan from "./pages/perusahaan/DetailLowongan";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Portal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/events" element={<ManageLowongan />} />
      <Route path="/admin/members" element={<ManageUsers />} />
      <Route path="/admin/statistics" element={<Statistics />} />

      {/* Perusahaan */}
      <Route path="/perusahaan/dashboard" element={<PerusahaanDashboard />} />
      <Route path="/perusahaan/kelolalowongan" element={<KelolaLowongan />} />
      <Route path="/perusahaan/lowongan/tambah" element={<TambahLowongan />} />
      <Route path="/perusahaan/lowongan/edit/:id" element={<EditLowongan />} />
      <Route path="/perusahaan/statistik" element={<StatistikPerusahaan />} />
      <Route path="/perusahaan/lowongan/:id" element={<DetailLowongan />} />
    </Routes>
  );
}

export default App;
