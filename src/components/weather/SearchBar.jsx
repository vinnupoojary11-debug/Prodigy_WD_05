import { useState } from "react";

export default function SearchBar({ onSearch, onGeolocate, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div style={s.wrapper}>
      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.inputWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search city... e.g. London, Tokyo, Mumbai"
            style={s.input}
            onFocus={e => (e.target.style.borderColor = "rgba(99,179,237,0.6)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
          <button type="submit" disabled={loading || !query.trim()} style={{ ...s.searchBtn, opacity: !query.trim() ? 0.4 : 1 }}>
            {loading ? "..." : "Search"}
          </button>
        </div>
      </form>

      <button onClick={onGeolocate} disabled={loading} style={s.geoBtn}
        onMouseEnter={e => Object.assign(e.currentTarget.style, { background: "rgba(99,179,237,0.15)", borderColor: "rgba(99,179,237,0.5)", color: "#90cdf4" })}
        onMouseLeave={e => Object.assign(e.currentTarget.style, { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)", color: "#9ca3af" })}>
        📍 Use My Location
      </button>
    </div>
  );
}

const s = {
  wrapper: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 680, margin: "0 auto" },
  form: { flex: 1, minWidth: 260 },
  inputWrap: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" },
  searchIcon: { fontSize: 16, padding: "0 14px", opacity: 0.5, flexShrink: 0 },
  input: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#e5e7eb", fontSize: 15, padding: "16px 0", fontFamily: "'DM Sans', sans-serif" },
  searchBtn: { background: "linear-gradient(135deg, #3b82f6, #06b6d4)", color: "#fff", border: "none", padding: "14px 22px", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "opacity 0.2s", flexShrink: 0 },
  geoBtn: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "#9ca3af", padding: "14px 20px", borderRadius: 14, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" },
};
