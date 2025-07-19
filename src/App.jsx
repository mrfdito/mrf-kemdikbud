import { Routes, Route } from "react-router-dom";

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
    </Routes>
  );
}

export default App;
