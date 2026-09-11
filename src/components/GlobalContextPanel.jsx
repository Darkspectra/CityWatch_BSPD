import { useCallback, useEffect, useRef, useState } from "react";
import { fetchGlobalSignals } from "../utils/worldMonitor";

function timeAgo(date) {
  if (!date) return null;
  const diffMs = Date.now() - date.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

const DOMAIN_DOT = {
  climate: "#22d3a8",
  conflict: "#ff6b7a",
  disaster: "#f0b849",
};

export default function GlobalContextPanel() {
  const [state, setState] = useState({ loading: true, items: [], domainStatus: [], error: false });
  const abortRef = useRef(null);

  const load = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState((s) => ({ ...s, loading: true, error: false }));

    fetchGlobalSignals({ limit: 8, signal: controller.signal })
      .then(({ items, domainStatus }) => {
        setState({ loading: false, items, domainStatus, error: items.length === 0 });
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setState({ loading: false, items: [], domainStatus: [], error: true });
      });
  }, []);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  const unavailableDomains = state.domainStatus.filter((d) => !d.ok).map((d) => d.label);

  return (
    <div className="gc-panel">
      <div className="gc-panel-head">
        <div>
          <p className="gc-panel-label">Live · powered by World Monitor</p>
          <h3 className="gc-panel-title">What's Happening Around the World</h3>
        </div>
        <button type="button" className="gc-refresh-btn" onClick={load} disabled={state.loading} aria-label="Refresh global signals">
          {state.loading ? "…" : "↻"}
        </button>
      </div>

      {state.loading && state.items.length === 0 && (
        <div className="gc-skeleton-list">
          {[0, 1, 2].map((i) => <div key={i} className="gc-skeleton-row" />)}
        </div>
      )}

      {!state.loading && state.error && (
        <div className="gc-empty">Global signals are temporarily unavailable — check back shortly.</div>
      )}

      {state.items.length > 0 && (
        <ul className="gc-list">
          {state.items.map((item) => (
            <li key={item.id} className="gc-item">
              <span className="gc-dot" style={{ background: DOMAIN_DOT[item.domain] || "#8fa89c" }} />
              <div className="gc-item-body">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="gc-item-title">
                    {item.title}
                  </a>
                ) : (
                  <span className="gc-item-title">{item.title}</span>
                )}
                <div className="gc-item-meta">
                  <span>{item.label}</span>
                  {item.source && <><span className="gc-meta-sep">·</span><span>{item.source}</span></>}
                  {item.publishedAt && <><span className="gc-meta-sep">·</span><span>{timeAgo(item.publishedAt)}</span></>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!state.loading && unavailableDomains.length > 0 && state.items.length > 0 && (
        <p className="gc-partial-note">Some feeds are quiet right now: {unavailableDomains.join(", ")}.</p>
      )}

      <a href="https://www.worldmonitor.app" target="_blank" rel="noopener noreferrer" className="gc-attribution">
        Data via World Monitor (open source, AGPL-3.0) — worldmonitor.app
      </a>
    </div>
  );
}
