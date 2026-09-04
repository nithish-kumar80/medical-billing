import { useState, useEffect, useRef } from "react";
import API from "../services/api";

/**
 * CodeAutocomplete — drop-in replacement for plain code + description inputs.
 * Calls /api/codes/{icd|cpt}/search with debounce.
 * Falls back gracefully if the API returns [] (empty collections / no text index yet).
 */
function CodeAutocomplete({ type, onSelect, placeholder, value }) {
  const [query, setQuery]     = useState(value || "");
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);
  const containerRef = useRef(null);

  // Sync when parent clears the field
  useEffect(() => { setQuery(value || ""); }, [value]);

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await API.get(`/codes/${type}/search?q=${encodeURIComponent(query)}`);
        // Cosmos DB wraps results in { value: [...], Count: N } — unwrap it
        const data = Array.isArray(res.data) ? res.data : (res.data?.value || []);
        setResults(data);
        setOpen(data.length > 0);
      } catch { setResults([]); setOpen(false); }
      finally { setLoading(false); }
    }, 250);
    return () => clearTimeout(timer.current);
  }, [query, type]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (!containerRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (r) => {
    setQuery(r.code);
    setResults([]);
    setOpen(false);
    onSelect(r);
  };

  const inp = {
    border: "1.5px solid #E2E8F0", borderRadius: 9, padding: "10px 14px",
    fontSize: 14, outline: "none", background: "#F8FAFC", fontFamily: "inherit",
    color: "#0F172A", width: "100%", transition: "border-color 0.15s", boxSizing: "border-box"
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        style={inp}
        onFocus={e => { e.target.style.borderColor = "#0D9488"; if (results.length) setOpen(true); }}
        onBlur={e => e.target.style.borderColor = "#E2E8F0"}
        autoComplete="off"
      />
      {loading && (
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ width: 14, height: 14, border: "2px solid #0D9488", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
        </div>
      )}
      {open && results.length > 0 && (
        <ul style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "white", borderRadius: 10, border: "1px solid #E2E8F0",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 1000,
          maxHeight: 240, overflowY: "auto", margin: 0, padding: "4px 0", listStyle: "none"
        }}>
          {results.map(r => (
            <li key={r.code}
              onMouseDown={() => handleSelect(r)}
              style={{
                padding: "10px 14px", cursor: "pointer", fontSize: 13,
                borderBottom: "1px solid #F8FAFC", display: "flex", gap: 10, alignItems: "flex-start"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#F0FDFA"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#0D9488", whiteSpace: "nowrap", fontSize: 12 }}>{r.code}</span>
              <span style={{ color: "#374151" }}>{r.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CodeAutocomplete;
