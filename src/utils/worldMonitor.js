// Lightweight client for World Monitor's free public API (api.worldmonitor.app).
// We only ever call their hosted network API here — nothing from their
// AGPL-licensed source is copied or embedded, so this stays outside that
// license's copyleft obligations.
//
// The API's exact response shape isn't documented in a way we could verify
// ahead of time, so every accessor below is defensive: it tries several
// common field-name variants and quietly skips anything it can't find
// rather than throwing.

const API_BASE = "https://api.worldmonitor.app";

// One endpoint per "domain" we want to surface. `climate` is confirmed to
// exist; the others follow the same list-<domain>-news convention World
// Monitor documents for aviation/climate, so they're a reasonable bet —
// if a path turns out wrong the fetch just fails for that one domain and
// the rest still render.
const DOMAINS = [
  { key: "climate", path: "/api/climate/v1/list-climate-news", label: "Climate & Environment" },
  { key: "conflict", path: "/api/conflict/v1/list-conflict-news", label: "Conflict & Geopolitics" },
  { key: "disaster", path: "/api/disaster/v1/list-disaster-news", label: "Disasters" },
];

function firstOf(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== "") return obj[k];
  }
  return null;
}

function extractItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  return (
    payload.items || payload.results || payload.articles ||
    payload.headlines || payload.news || payload.data || []
  );
}

function normalizeItem(raw, domain, label, index) {
  const title = firstOf(raw, ["title", "headline", "name"]);
  if (!title) return null; // not usable without at least a title
  const url = firstOf(raw, ["url", "link", "source_url", "sourceUrl"]);
  const source = firstOf(raw, ["source", "provider", "publisher", "outlet"]);
  const publishedAt = firstOf(raw, [
    "published_at", "publishedAt", "timestamp", "date", "fetched_at", "fetchedAt",
  ]);
  const summary = firstOf(raw, ["summary", "description", "snippet", "excerpt"]);

  return {
    id: firstOf(raw, ["id", "uuid", "guid"]) || `${domain}-${index}`,
    domain,
    label,
    title: String(title),
    summary: summary ? String(summary) : "",
    url: url ? String(url) : null,
    source: source ? String(source) : null,
    publishedAt: toDate(publishedAt),
  };
}

function toDate(value) {
  if (!value) return null;
  // Accept unix seconds, unix millis, or an ISO/date string.
  if (typeof value === "number") {
    const ms = value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function fetchDomain({ key, path, label }, { signal } = {}) {
  const res = await fetch(`${API_BASE}${path}`, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
  const payload = await res.json();

  // World Monitor marks a domain as temporarily uncollected with
  // fetched_at === 0 rather than an error — treat that as "no data yet",
  // not "confirmed zero headlines".
  const fetchedAt = firstOf(payload, ["fetched_at", "fetchedAt"]);
  const stale = fetchedAt === 0;

  const items = extractItems(payload)
    .map((raw, i) => normalizeItem(raw, key, label, i))
    .filter(Boolean);

  return { key, label, items, stale };
}

// Fetches every configured domain in parallel and returns a flat, newest-first
// list capped at `limit`, plus per-domain status so the UI can say "climate
// feed unavailable" instead of just showing fewer cards with no explanation.
export async function fetchGlobalSignals({ limit = 8, signal } = {}) {
  const settled = await Promise.allSettled(DOMAINS.map((d) => fetchDomain(d, { signal })));

  const domainStatus = settled.map((result, i) => {
    const domain = DOMAINS[i];
    if (result.status === "fulfilled") {
      return { key: domain.key, label: domain.label, ok: !result.value.stale, count: result.value.items.length };
    }
    return { key: domain.key, label: domain.label, ok: false, count: 0 };
  });

  const items = settled
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value.items)
    .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
    .slice(0, limit);

  return { items, domainStatus };
}
