import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import RoleRoute from "./components/RoleRoute";
import Home from "./pages/Home";
=======
import { AuthProvider } from "./context/AuthContext";
import RoleRoute from "./components/RoleRoute";
>>>>>>> 36f17f78c5fce32c9eddd775c3ebd3c8642d91a9
import Landing from "./pages/Landing";
import CitizenLogin from "./pages/CitizenLogin";
import CitizenSignup from "./pages/CitizenSignup";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerSignup from "./pages/PartnerSignup";
import GovLogin from "./pages/GovLogin";
<<<<<<< HEAD
import PartnerRedirect from "./pages/PartnerRedirect";
=======
>>>>>>> 36f17f78c5fce32c9eddd775c3ebd3c8642d91a9
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/Submit";
import Verify from "./pages/Verify";
import Solve from "./pages/Solve";
import GovDashboard from "./pages/GovDashboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
<<<<<<< HEAD
import ParticleNetwork from "./components/ParticleNetwork";
=======
import { ToastProvider } from "./context/ToastContext";
import PartnerRedirect from "./pages/PartnerRedirect";
>>>>>>> 36f17f78c5fce32c9eddd775c3ebd3c8642d91a9

export default function App() {
  return (
    <ToastProvider>
<<<<<<< HEAD
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
=======
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/citizen/signup" element={<CitizenSignup />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/partner/signup" element={<PartnerSignup />} />
          <Route path="/gov/login" element={<GovLogin />} />

          <Route path="/dashboard" element={<RoleRoute allowed={["citizen"]}><Dashboard /></RoleRoute>} />
          <Route path="/submit" element={<RoleRoute allowed={["citizen"]}><Submit /></RoleRoute>} />
          <Route path="/verify" element={<RoleRoute allowed={["industrial"]}><Verify /></RoleRoute>} />
          <Route path="/solve" element={<RoleRoute allowed={["academia"]}><Solve /></RoleRoute>} />
          <Route path="/gov" element={<RoleRoute allowed={["government"]}><GovDashboard /></RoleRoute>} />
          <Route path="/notifications" element={<RoleRoute allowed={["citizen", "industrial", "academia"]}><Notifications /></RoleRoute>} />
          <Route path="/profile" element={<RoleRoute allowed={["citizen", "industrial", "academia", "government"]}><Profile /></RoleRoute>} />
          <Route path="/partner/redirect" element={<PartnerRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
>>>>>>> 36f17f78c5fce32c9eddd775c3ebd3c8642d91a9
    </ToastProvider>
  );
}