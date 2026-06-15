const ICON_MAP = {
  "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "🌤",
  "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌦️",
  "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️",
  "50d": "🌫️", "50n": "🌫️",
};

const BG_MAP = {
  Clear: "linear-gradient(160deg, #0f3460 0%, #16213e 50%, #0a1628 100%)",
  Clouds: "linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
  Rain: "linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #0a1020 100%)",
  Drizzle: "linear-gradient(160deg, #0d1b2a 0%, #1b2838 50%, #0a1020 100%)",
  Thunderstorm: "linear-gradient(160deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a14 100%)",
  Snow: "linear-gradient(160deg, #1a2a3a 0%, #1e3a5f 50%, #0f1f30 100%)",
  Mist: "linear-gradient(160deg, #1a1a2a 0%, #2a2a3a 50%, #0f0f1f 100%)",
};

export default function WeatherCard({ data }) {
  const icon = ICON_MAP[data.weather[0].icon] || "🌡️";
  const bg = BG_MAP[data.weather[0].main] || BG_MAP.Clouds;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const condition = data.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
  const windKmh = Math.round(data.wind.speed * 3.6);
  const localTime = new Date((Date.now() / 1000 + data.timezone) * 1000).toUTCString().slice(17, 22);

  return (
    <div style={{ ...s.card, background: bg }}>
      {/* Top row */}
      <div style={s.topRow}>
        <div>
          <h2 style={s.city}>{data.name}<span style={s.country}>, {data.sys.country}</span></h2>
          <p style={s.localTime}>🕐 Local time: {localTime}</p>
        </div>
        <div style={s.iconWrap}>
          <span style={s.icon}>{icon}</span>
        </div>
      </div>

      {/* Temp */}
      <div style={s.tempRow}>
        <span style={s.temp}>{temp}°</span>
        <div style={s.tempMeta}>
          <span style={s.unit}>C</span>
          <span style={s.condition}>{condition}</span>
          <span style={s.feelsLike}>Feels like {feelsLike}°C</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={s.statsGrid}>
        {[
          { icon: "💧", label: "Humidity", val: `${data.main.humidity}%` },
          { icon: "💨", label: "Wind", val: `${windKmh} km/h` },
          { icon: "👁️", label: "Visibility", val: `${(data.visibility / 1000).toFixed(1)} km` },
          { icon: "📊", label: "Pressure", val: `${data.main.pressure} hPa` },
          { icon: "🌡️", label: "High / Low", val: `${Math.round(data.main.temp_max)}° / ${Math.round(data.main.temp_min)}°` },
          { icon: "☁️", label: "Cloud Cover", val: `${data.clouds.all}%` },
        ].map(stat => (
          <div key={stat.label} style={s.stat}>
            <span style={s.statIcon}>{stat.icon}</span>
            <span style={s.statVal}>{stat.val}</span>
            <span style={s.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Sunrise / Sunset */}
      <div style={s.sunRow}>
        <div style={s.sunItem}>
          <span>🌅</span>
          <span style={s.sunLabel}>Sunrise</span>
          <span style={s.sunTime}>{new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div style={s.sunDivider} />
        <div style={s.sunItem}>
          <span>🌇</span>
          <span style={s.sunLabel}>Sunset</span>
          <span style={s.sunTime}>{new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  );
}

const s = {
  card: { borderRadius: 24, padding: "32px 28px 24px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", position: "relative", overflow: "hidden" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  city: { fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "#fff", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.5px" },
  country: { fontSize: "clamp(1rem, 2vw, 1.3rem)", color: "rgba(255,255,255,0.5)", fontWeight: 500 },
  localTime: { fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginTop: 4 },
  iconWrap: { flexShrink: 0 },
  icon: { fontSize: "clamp(3rem, 8vw, 5rem)", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" },
  tempRow: { display: "flex", alignItems: "flex-end", gap: 12, margin: "16px 0 24px" },
  temp: { fontSize: "clamp(4rem, 12vw, 7rem)", fontWeight: 800, color: "#fff", fontFamily: "'DM Sans', sans-serif", lineHeight: 1, letterSpacing: "-3px" },
  tempMeta: { display: "flex", flexDirection: "column", paddingBottom: 12 },
  unit: { fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.5)", lineHeight: 1, fontFamily: "'DM Sans', sans-serif" },
  condition: { fontSize: 16, color: "#93c5fd", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginTop: 4 },
  feelsLike: { fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginTop: 2 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 },
  stat: { background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: "1px solid rgba(255,255,255,0.06)" },
  statIcon: { fontSize: 18 },
  statVal: { fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans', sans-serif" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px" },
  sunRow: { display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 20px", border: "1px solid rgba(255,255,255,0.06)" },
  sunItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  sunDivider: { width: 1, height: 40, background: "rgba(255,255,255,0.1)" },
  sunLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px" },
  sunTime: { fontSize: 16, fontWeight: 700, color: "#fbbf24", fontFamily: "'DM Sans', sans-serif" },
};
