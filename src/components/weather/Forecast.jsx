const ICON_MAP = {
  "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "🌤",
  "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌦️",
  "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️",
  "50d": "🌫️", "50n": "🌫️",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Forecast({ data }) {
  // Get one entry per day (noon reading)
  const daily = [];
  const seen = new Set();
  for (const item of data.list) {
    const date = new Date(item.dt * 1000);
    const day = date.toDateString();
    if (!seen.has(day) && daily.length < 5) {
      seen.add(day);
      daily.push(item);
    }
  }

  return (
    <div style={s.wrapper}>
      <h3 style={s.title}>📅 5-Day Forecast</h3>
      <div style={s.grid}>
        {daily.map((item, i) => {
          const date = new Date(item.dt * 1000);
          const dayName = i === 0 ? "Today" : DAYS[date.getDay()];
          const icon = ICON_MAP[item.weather[0].icon] || "🌡️";
          const desc = item.weather[0].description.replace(/\b\w/g, c => c.toUpperCase());
          const high = Math.round(item.main.temp_max);
          const low = Math.round(item.main.temp_min);
          const rain = item.pop ? Math.round(item.pop * 100) : 0;

          return (
            <div key={item.dt} style={{ ...s.card, ...(i === 0 ? s.cardToday : {}) }}>
              <span style={s.dayName}>{dayName}</span>
              <span style={s.date}>{date.toLocaleDateString([], { month: "short", day: "numeric" })}</span>
              <span style={s.icon}>{icon}</span>
              <span style={s.desc}>{desc}</span>
              <div style={s.temps}>
                <span style={s.high}>{high}°</span>
                <span style={s.slash}>/</span>
                <span style={s.low}>{low}°</span>
              </div>
              {rain > 0 && (
                <div style={s.rainRow}>
                  <span style={s.rainIcon}>🌧</span>
                  <span style={s.rainPct}>{rain}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  wrapper: { marginTop: 20 },
  title: { fontSize: 16, fontWeight: 700, color: "#e5e7eb", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.2s ease", cursor: "default" },
  cardToday: { background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)" },
  dayName: { fontSize: 13, fontWeight: 700, color: "#93c5fd", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.5px" },
  date: { fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" },
  icon: { fontSize: 30, margin: "4px 0" },
  desc: { fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", textAlign: "center", lineHeight: 1.3 },
  temps: { display: "flex", alignItems: "baseline", gap: 3, marginTop: 4 },
  high: { fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans', sans-serif" },
  slash: { fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" },
  low: { fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" },
  rainRow: { display: "flex", alignItems: "center", gap: 4 },
  rainIcon: { fontSize: 11 },
  rainPct: { fontSize: 11, color: "#60a5fa", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 },
};
