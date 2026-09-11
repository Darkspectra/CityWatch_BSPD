import { useEffect, useMemo, useRef, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import HomeButton from "../components/HomeButton";

const riskColors = { high: "#ff6b7a", medium: "#CC8400", low: "#4ade80" };
const categoryLabels = {
  fire: "Fire",
  chemical: "Chemical Spill",
  water: "Water Pollution",
  air: "Air Pollution",
  natural_disaster: "Natural Disaster",
  other: "Other",
};

const DEFAULT_CENTER = [23.8103, 90.4125]; // matches LocationPicker's default region
const DEFAULT_ZOOM = 12;

export default function LiveMap() {
  const { profile } = useAuth();
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("active"); // active | resolved | all
  const [riskFilter, setRiskFilter] = useState("all"); // all | high | medium | low
  const [categoryFilter, setCategoryFilter] = useState("all");

  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const clusterRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "reports"), where("verificationStatus", "==", "approved"));
    const unsub = onSnapshot(q, (snap) => setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter === "active" && r.solved) return false;
      if (statusFilter === "resolved" && !r.solved) return false;
      if (riskFilter !== "all" && (r.riskLevel || "").toLowerCase() !== riskFilter) return false;
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      return true;
    });
  }, [reports, statusFilter, riskFilter, categoryFilter]);

  const mapped = filtered.filter((r) => r.verifiedLat != null && r.verifiedLng != null);
  const unmappedCount = filtered.length - mapped.length;

  const stats = useMemo(() => {
    const active = reports.filter((r) => !r.solved);
    return {
      active: active.length,
      highRisk: active.filter((r) => (r.riskLevel || "").toLowerCase() === "high").length,
      resolved: reports.filter((r) => r.solved).length,
    };
  }, [reports]);

  // Set up the map + cluster group once.
  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map(mapElRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    const cluster = L.markerClusterGroup({ maxClusterRadius: 50 });
    cluster.addTo(map);
    mapRef.current = map;
    clusterRef.current = cluster;
    return () => {
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  // Redraw markers whenever the filtered/mapped set changes.
  useEffect(() => {
    const cluster = clusterRef.current;
    const map = mapRef.current;
    if (!cluster || !map) return;
    cluster.clearLayers();

    const markers = mapped.map((r) => {
      const color = riskColors[(r.riskLevel || "").toLowerCase()] || "#8fa89c";
      const marker = L.circleMarker([r.verifiedLat, r.verifiedLng], {
        radius: 9,
        color: "#04140f",
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.9,
      });
      const statusLabel = r.solved ? "Resolved" : "Active";
      const desc = (r.description || "").length > 120 ? `${r.description.slice(0, 120)}…` : r.description || "";
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 180px;">
          <div style="font-weight:700; text-transform:capitalize; margin-bottom:4px;">${categoryLabels[r.category] || r.category || "Report"}</div>
          <div style="font-size:12px; color:#555; margin-bottom:6px;">${desc}</div>
          <div style="font-size:11px; color:#777;">${r.verifiedLocationName || r.location || ""}</div>
          <div style="margin-top:6px; display:flex; gap:6px;">
            <span style="background:${color}; color:#04140f; font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px; text-transform:capitalize;">${r.riskLevel || "unrated"} risk</span>
            <span style="background:#eee; color:#333; font-size:10px; font-weight:700; padding:2px 8px; border-radius:10px;">${statusLabel}</span>
          </div>
        </div>
      `);
      return marker;
    });

    cluster.addLayers(markers);

    if (markers.length > 0) {
      const bounds = L.featureGroup(markers).getBounds();
      map.fitBounds(bounds.pad(0.25), { maxZoom: 15 });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }, [mapped]);

  return (
    <div className="page-wrap" style={{ maxWidth: 960 }}>
      <HomeButton />
      <div className="page-title">Live Hazard Map</div>
      <p className="subtitle">Verified reports, plotted where they're happening</p>

      <div className="stat-row">
        <div className="stat-card">
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">Active hazards</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: riskColors.high }}>{stats.highRisk}</span>
          <span className="stat-label">High risk, active</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: riskColors.low }}>{stats.resolved}</span>
          <span className="stat-label">Resolved</span>
        </div>
      </div>

      <div className="chip-row">
        {[
          { key: "active", label: "Active" },
          { key: "resolved", label: "Resolved" },
          { key: "all", label: "All" },
        ].map((s) => (
          <div key={s.key} className={"chip" + (statusFilter === s.key ? " active" : "")} onClick={() => setStatusFilter(s.key)}>
            {s.label}
          </div>
        ))}
      </div>

      <div className="chip-row">
        {[
          { key: "all", label: "All risk" },
          { key: "high", label: "High" },
          { key: "medium", label: "Medium" },
          { key: "low", label: "Low" },
        ].map((r) => (
          <div key={r.key} className={"chip" + (riskFilter === r.key ? " active" : "")} onClick={() => setRiskFilter(r.key)}>
            {r.label}
          </div>
        ))}
      </div>

      <select className="field" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
        <option value="all">All categories</option>
        {Object.entries(categoryLabels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <div className="map-legend">
        {Object.entries(riskColors).map(([level, color]) => (
          <span key={level} className="map-legend-item">
            <span className="map-legend-dot" style={{ background: color }} />
            {level[0].toUpperCase() + level.slice(1)} risk
          </span>
        ))}
      </div>

      <div ref={mapElRef} className="live-map-container" />

      {unmappedCount > 0 && (
        <p className="map-unmapped-note">
          {unmappedCount} matching report{unmappedCount !== 1 ? "s" : ""} without a pinned location — not shown on the map.
        </p>
      )}

      {filtered.length === 0 && (
        <div className="empty-state">No reports match these filters.</div>
      )}

      <BottomNav role={profile?.role} />
    </div>
  );
}
