import { Routes, Route } from "react-router-dom";
import Portal from "./pages/Portal";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Register from "./pages/auth/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/admin/Dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
