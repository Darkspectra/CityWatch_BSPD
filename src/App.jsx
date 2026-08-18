import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import RoleRoute from "./components/RoleRoute";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import CitizenLogin from "./pages/CitizenLogin";
import CitizenSignup from "./pages/CitizenSignup";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerSignup from "./pages/PartnerSignup";
import GovLogin from "./pages/GovLogin";
import PartnerRedirect from "./pages/PartnerRedirect";
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/Submit";
import Verify from "./pages/Verify";
import Solve from "./pages/Solve";
import GovDashboard from "./pages/GovDashboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import ParticleNetwork from "./components/ParticleNetwork";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ParticleNetwork />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/start" element={<Landing />} />
            <Route path="/citizen/login" element={<CitizenLogin />} />
            <Route path="/citizen/signup" element={<CitizenSignup />} />
            <Route path="/partner/login" element={<PartnerLogin />} />
            <Route path="/partner/signup" element={<PartnerSignup />} />
            <Route path="/partner/redirect" element={<PartnerRedirect />} />
            <Route path="/gov/login" element={<GovLogin />} />

            <Route path="/dashboard" element={<RoleRoute allowed={["citizen"]}><Dashboard /></RoleRoute>} />
            <Route path="/submit" element={<RoleRoute allowed={["citizen"]}><Submit /></RoleRoute>} />
            <Route path="/verify" element={<RoleRoute allowed={["industrial"]}><Verify /></RoleRoute>} />
            <Route path="/solve" element={<RoleRoute allowed={["academia"]}><Solve /></RoleRoute>} />
            <Route path="/gov" element={<RoleRoute allowed={["government"]}><GovDashboard /></RoleRoute>} />
            <Route path="/notifications" element={<RoleRoute allowed={["citizen", "industrial", "academia"]}><Notifications /></RoleRoute>} />
            <Route path="/profile" element={<RoleRoute allowed={["citizen", "industrial", "academia", "government"]}><Profile /></RoleRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}