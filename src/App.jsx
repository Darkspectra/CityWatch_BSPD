import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import RoleRoute from "./components/RoleRoute";
import LandingPage from "./pages/LandingPage";
import Landing from "./pages/Landing";
import CitizenLogin from "./pages/CitizenLogin";
import CitizenSignup from "./pages/CitizenSignup";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerSignup from "./pages/PartnerSignup";
import PartnerRedirect from "./pages/PartnerRedirect";
import GovLogin from "./pages/GovLogin";
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/Submit";
import Verify from "./pages/Verify";
import Solve from "./pages/Solve";
import GovDashboard from "./pages/GovDashboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Statistics from "./pages/Statistics";
import LiveMap from "./pages/LiveMap";
import AuthAction from "./pages/AuthAction";
import VerifyEmailGate from "./pages/VerifyEmailGate";
import ChatWidget from "./components/ChatWidget";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

import SupportForm from "./pages/SupportForm";
import SupportTickets from "./pages/SupportTickets";

import CookieBanner from "./components/CookieBanner";

export default function App() {
  return (
    <LanguageProvider>
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/start" element={<Landing />} />
            <Route path="/citizen/login" element={<CitizenLogin />} />
            <Route path="/citizen/signup" element={<CitizenSignup />} />
            <Route path="/partner/login" element={<PartnerLogin />} />
            <Route path="/partner/signup" element={<PartnerSignup />} />
            <Route path="/partner/redirect" element={<PartnerRedirect />} />
            <Route path="/gov/login" element={<GovLogin />} />
            <Route path="/auth-action" element={<AuthAction />} />
            <Route path="/verify-email" element={<VerifyEmailGate />} />

            <Route path="/support" element={<RoleRoute allowed={["citizen", "industrial", "academia"]}><SupportForm /></RoleRoute>} />
            <Route path="/tickets" element={<RoleRoute allowed={["government"]}><SupportTickets /></RoleRoute>} />

            <Route path="/dashboard" element={<RoleRoute allowed={["citizen"]}><Dashboard /></RoleRoute>} />
            <Route path="/submit" element={<RoleRoute allowed={["citizen"]}><Submit /></RoleRoute>} />
            <Route path="/verify" element={<RoleRoute allowed={["industrial"]}><Verify /></RoleRoute>} />
            <Route path="/solve" element={<RoleRoute allowed={["academia"]}><Solve /></RoleRoute>} />
            <Route path="/statistics" element={<RoleRoute allowed={["academia"]}><Statistics /></RoleRoute>} />
            <Route path="/map" element={<RoleRoute allowed={["citizen", "industrial", "academia", "government"]}><LiveMap /></RoleRoute>} />
            <Route path="/gov" element={<RoleRoute allowed={["government"]}><GovDashboard /></RoleRoute>} />
            <Route path="/notifications" element={<RoleRoute allowed={["citizen", "industrial", "academia"]}><Notifications /></RoleRoute>} />
            <Route path="/profile" element={<RoleRoute allowed={["citizen", "industrial", "academia", "government"]}><Profile /></RoleRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget />
          <CookieBanner />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
    </LanguageProvider>
  );
}