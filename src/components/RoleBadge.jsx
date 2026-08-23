const ICONS = {
  citizen: "👁",
  partner: "🔬",
  gov: "🏛",
};

export default function RoleBadge({ role, label }) {
  return (
    <div className={`role-badge role-${role}`}>
      <span className="role-badge-icon" aria-hidden="true">{ICONS[role]}</span>
      {label}
    </div>
  );
}
