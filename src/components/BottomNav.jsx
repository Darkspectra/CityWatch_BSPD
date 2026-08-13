import { NavLink } from "react-router-dom";

const tabsByRole = {
  citizen: [
    { to: "/dashboard", label: "My Reports" },
    { to: "/submit", label: "Submit" },
    { to: "/notifications", label: "Notices" },
    { to: "/profile", label: "Profile" },
  ],
  industrial: [
    { to: "/verify", label: "Verify" },
    { to: "/notifications", label: "Notices" },
    { to: "/profile", label: "Profile" },
  ],
  academia: [
    { to: "/solve", label: "Solve" },
    { to: "/notifications", label: "Notices" },
    { to: "/profile", label: "Profile" },
  ],
  government: [
    { to: "/gov", label: "Dashboard" },
    { to: "/profile", label: "Profile" },
  ],
};

export default function BottomNav({ role }) {
  const tabs = tabsByRole[role] || [];
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");
  return (
    <div id="bottom-nav">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} className={linkClass} end>{t.label}</NavLink>
      ))}
    </div>
  );
}