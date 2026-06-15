import { useState } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import Forecast from "./Forecast";
import { LoadingSpinner, ErrorMessage, EmptyState } from "./StatusComponents";

// ⚠️ Replace with your free API key from https://openweathermap.org/api
const API_KEY = "2b9622dd437dffa6c71304982fc84f4b";
const BASE = "https://api.openweathermap.org/data/2.5";

const BG_MAP = {
  Clear:        "linear-gradient(160deg, #0f3460 0%, #1a4a7a 40%, #0d2a4a 100%)",
  Clouds:       "linear-gradient(160deg, #1a1a2e 0%, #2d3561 40%, #0f0f23 100%)",
  Rain:         "linear-gradient(160deg, #0d1b2a 0%, #1b2838 40%, #0a1020 100%)",
  Drizzle:      "linear-gradient(160deg, #0d1b2a 0%, #1e2d3d 40%, #0a1020 100%)",
  Thunderstorm: "linear-gradient(160deg, #0a0a1a 0%, #1a0a2e 40%, #050510 100%)",
  Snow:         "linear-gradient(160deg, #1a2a3a 0%, #2a4060 40%, #0f1f30 100%)",
  Mist:         "linear-gradient(160deg, #1a1a2a 0%, #2a2a3a 40%, #0f0f1f 100%)",
  Haze:         "linear-gradient(160deg, #1a1a20 0%, #2a2a30 40%, #0f0f18 100%)",
  Fog:          "linear-gradient(160deg, #1a1a2a 0%, #2a2a3a 40%, #0f0f1f 100%)",
  Dust:         "linear-gradient(160deg, #2a1a0a 0%, #3a2a1a 40%, #1a0f05 100%)",
  Smoke:        "linear-gradient(160deg, #1a1a1a 0%, #2a2a2a 40%, #0f0f0f 100%)",
};

const ORB_MAP = {
  Clear:        ["rgba(251,191,36,0.15)", "rgba(249,115,22,0.1)"],
  Clouds:       ["rgba(99,102,241,0.12)", "rgba(139,92,246,0.1)"],
  Rain:         ["rgba(59,130,246,0.15)", "rgba(6,182,212,0.1)"],
  Drizzle:      ["rgba(59,130,246,0.12)", "rgba(6,182,212,0.08)"],
  Thunderstorm: ["rgba(139,92,246,0.15)", "rgba(236,72,153,0.1)"],
  Snow:         ["rgba(186,230,253,0.12)", "rgba(147,197,253,0.1)"],
  default:      ["rgba(59,130,246,0.12)", "rgba(6,182,212,0.1)"],
};

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const [condition, setCondition] = useState(null);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    setLastQuery(city);
    try {
      const [wRes, fRes] = await Promise.all([
        fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
      ]);

      if (!wRes.ok) {
        const err = await wRes.json();
        throw new Error(err.message || "City not found. Try a different name.");
      }

      const [wData, fData] = await Promise.all([wRes.json(), fRes.json()]);
      setWeather(wData);
      setForecast(fData);
      setCondition(wData.weather[0].main);
    } catch (e) {
      setError(e.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [wRes, fRes] = await Promise.all([
        fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
      ]);

      if (!wRes.ok) throw new Error("Unable to fetch weather for your location.");

      const [wData, fData] = await Promise.all([wRes.json(), fRes.json()]);
      setWeather(wData);
      setForecast(fData);
      setLastQuery(wData.name);
      setCondition(wData.weather[0].main);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => { setError("Location access denied. Please search by city name."); setLoading(false); }
    );
  };

  const pageBg = condition ? (BG_MAP[condition] || BG_MAP.Clouds) : "#060b18";
  const orbs = ORB_MAP[condition] || ORB_MAP.default;

  return (
    <div style={{ ...page.bg, background: pageBg, transition: "background 1.2s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #06040f; }
        ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 2px; }
      `}</style>

      {/* Ambient orbs — also change with weather */}
      <div style={{ ...page.orb, top: "5%", left: "10%", background: `radial-gradient(circle, ${orbs[0]} 0%, transparent 70%)`, transition: "background 1.2s ease" }} />
      <div style={{ ...page.orb, bottom: "10%", right: "5%", background: `radial-gradient(circle, ${orbs[1]} 0%, transparent 70%)`, transition: "background 1.2s ease" }} />

      <div style={page.container}>
        {/* Header */}
        <div style={page.header}>
          <div style={page.logo}>
            <span style={page.logoIcon}>🌤</span>
            <div>
              <h1 style={page.title}>WeatherNow</h1>
              <p style={page.subtitle}>Real-time weather from anywhere on Earth</p>
            </div>
          </div>
          {weather && (
            <div style={page.updatedAt}>
              Last updated: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
        </div>

        {/* Search */}
        <div style={page.searchSection}>
          <SearchBar onSearch={fetchWeather} onGeolocate={handleGeolocate} loading={loading} />
        </div>

        {/* API Key Warning */}
        {API_KEY === "YOUR_API_KEY_HERE" && (
          <div style={page.apiWarning}>
            ⚠️ <strong>Add your API key!</strong> Get a free key at{" "}
            <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer" style={{ color: "#fbbf24" }}>
              openweathermap.org
            </a>{" "}
            and replace <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: 4 }}>YOUR_API_KEY_HERE</code> in WeatherApp.jsx
          </div>
        )}

        {/* Content */}
        <div style={page.content}>
          {loading && <LoadingSpinner />}
          {!loading && error && <ErrorMessage message={error} onRetry={() => lastQuery && fetchWeather(lastQuery)} />}
          {!loading && !error && !weather && <EmptyState />}
          {!loading && !error && weather && (
            <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
              <WeatherCard data={weather} />
              {forecast && <Forecast data={forecast} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const page = {
  bg: {
    minHeight: "100vh", background: "#060b18",
    display: "flex", justifyContent: "center",
    padding: "24px 16px", position: "relative", overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif",
  },
  orb: { position: "absolute", width: 500, height: 500, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" },
  container: { width: "100%", maxWidth: 680, position: "relative", zIndex: 1 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 12 },
  logo: { display: "flex", alignItems: "center", gap: 14 },
  logoIcon: { fontSize: 36, filter: "drop-shadow(0 4px 12px rgba(59,130,246,0.4))" },
  title: { fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.5px" },
  subtitle: { fontSize: 13, color: "#6b7280", fontFamily: "'DM Sans', sans-serif" },
  updatedAt: { fontSize: 12, color: "#4b5563", fontFamily: "'DM Sans', sans-serif", alignSelf: "flex-end" },
  searchSection: { marginBottom: 24 },
  apiWarning: { background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#fcd34d", fontFamily: "'DM Sans', sans-serif", marginBottom: 20, lineHeight: 1.6 },
  content: { minHeight: 200 },
};
