export function LoadingSpinner() {
  return (
    <div style={s.wrapper}>
      <div style={s.spinner} />
      <p style={s.text}>Fetching weather data...</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div style={s.errorBox}>
      <span style={s.errorIcon}>⚠️</span>
      <div>
        <p style={s.errorTitle}>Something went wrong</p>
        <p style={s.errorMsg}>{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} style={s.retryBtn}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}>
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyState() {
  return (
    <div style={s.emptyWrapper}>
      <div style={s.globe}>🌍</div>
      <h3 style={s.emptyTitle}>Search any city in the world</h3>
      <p style={s.emptyDesc}>Enter a city name above or use your current location to see live weather conditions, temperature, humidity, wind speed, and a 5-day forecast.</p>
      <div style={s.suggestions}>
        {["Mumbai", "London", "New York", "Tokyo", "Sydney"].map(city => (
          <span key={city} style={s.suggestion}>{city}</span>
        ))}
      </div>
    </div>
  );
}

const s = {
  wrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "60px 0" },
  spinner: {
    width: 48, height: 48, borderRadius: "50%",
    border: "3px solid rgba(59,130,246,0.2)",
    borderTopColor: "#3b82f6",
    animation: "spin 0.8s linear infinite",
  },
  text: { fontSize: 14, color: "#6b7280", fontFamily: "'DM Sans', sans-serif" },
  errorBox: { display: "flex", alignItems: "flex-start", gap: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "18px 20px", flexWrap: "wrap" },
  errorIcon: { fontSize: 22, flexShrink: 0 },
  errorTitle: { fontSize: 14, fontWeight: 700, color: "#fca5a5", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 },
  errorMsg: { fontSize: 13, color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" },
  retryBtn: { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "background 0.2s", marginLeft: "auto", whiteSpace: "nowrap" },
  emptyWrapper: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "48px 20px" },
  globe: { fontSize: 64, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: "#e5e7eb", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 },
  emptyDesc: { fontSize: 14, color: "#6b7280", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, maxWidth: 380, marginBottom: 24 },
  suggestions: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  suggestion: { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontFamily: "'DM Sans', sans-serif" },
};
