import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Portal
import Portal from "./pages/portal/Portal";
import LowonganListPortal from "./pages/portal/LowonganList";
// import PerusahaanListPortal from "./pages/portal/PerusahaanList";
// import AboutPortal from "./pages/portal/About";

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
import ProsesLamaran from "./pages/perusahaan/ProsesLamaran";

// Mahasiswa Pages
import DashboardMahasiswa from "./pages/mahasiswa/DashboardMahasiswa";
import LowonganList from "./pages/mahasiswa/LowonganList";
import LowonganDetail from "./pages/mahasiswa/LowonganDetail";
import LamaranSaya from "./pages/mahasiswa/LamaranSaya";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Portal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/lowongan" element={<LowonganListPortal />} />
      {/* <Route path="/perusahaan" element={<PerusahaanListPortal />} /> */}
      {/* <Route path="/about" element={<AboutPortal />} /> */}

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
      <Route path="/perusahaan/proseslamaran" element={<ProsesLamaran />} />

      {/* Mahasiswa */}
      <Route path="/mahasiswa/dashboard" element={<DashboardMahasiswa />} />
      <Route path="/mahasiswa/lowongan" element={<LowonganList />} />
      <Route path="/mahasiswa/lowongan/:id" element={<LowonganDetail />} />
      <Route path="/mahasiswa/lamaran" element={<LamaranSaya />} />
    </Routes>
  );
}

export default App;
