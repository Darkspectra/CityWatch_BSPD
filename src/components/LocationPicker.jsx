import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LocationPicker({ onConfirm, initialQuery }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const [query, setQuery] = useState(initialQuery || "");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (mapInstance.current) return;
    const map = L.map(mapRef.current).setView([23.8103, 90.4125], 5); // default: Dhaka region
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    mapInstance.current = map;
    return () => map.remove();
  }, []);

  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const pickResult = (r) => {
    const lat = parseFloat(r.lat), lon = parseFloat(r.lon);
    setSelected({ lat, lon, name: r.display_name });
    setResults([]);
    setQuery(r.display_name);

    const map = mapInstance.current;
    map.setView([lat, lon], 15);
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = L.marker([lat, lon], { icon: markerIcon }).addTo(map);
  };

  return (
    <div className="location-picker">
      <div className="location-search-row">
        <input
          className="field"
          placeholder="Search a place or address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); search(); } }}
        />
        <button type="button" className="btn btn-secondary location-search-btn" onClick={search}>
          {searching ? "..." : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="location-results">
          {results.map((r, i) => (
            <div key={i} className="location-result-item" onClick={() => pickResult(r)}>
              {r.display_name}
            </div>
          ))}
        </div>
      )}

      <div ref={mapRef} className="location-map" />

      {selected && (
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: 10 }}
          onClick={() => onConfirm(selected)}
        >
          Confirm This Location
        </button>
      )}
    </div>
  );
}