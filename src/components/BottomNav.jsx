import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");
  return (
    <div id="bottom-nav">
      <NavLink to="/" className={linkClass} end>Home</NavLink>
      <NavLink to="/submit" className={linkClass}>Submit</NavLink>
      <NavLink to="/ledger" className={linkClass}>Ledger</NavLink>
      <NavLink to="/profile" className={linkClass}>Profile</NavLink>
    </div>
  );
}