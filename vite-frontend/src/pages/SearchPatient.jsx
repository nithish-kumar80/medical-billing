import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

function SearchPatient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await API.get("/patients");

      // filter locally (simple + fast)
      const filtered = res.data.filter((p) =>
        p.patient_id.toLowerCase().includes(query.toLowerCase()) ||
        p.name.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered);
      setSearched(true);
    } catch (err) {
      console.error(err);
      alert("Error searching");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F8FAFC",
      padding: "32px 36px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    },
    pageTitle: {
      fontSize: 22,
      fontWeight: 700,
      color: "#0F172A",
      margin: "0 0 4px 0",
    },
    pageSubtitle: {
      fontSize: 13,
      color: "#64748B",
      margin: "0 0 28px 0",
    },
    searchCard: {
      background: "white",
      borderRadius: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
      border: "1px solid #E2E8F0",
      padding: "28px 32px",
      marginBottom: 24,
    },
    searchLabel: {
      fontSize: 13,
      fontWeight: 600,
      color: "#374151",
      marginBottom: 10,
      display: "block",
    },
    searchRow: {
      display: "flex",
      gap: 12,
      alignItems: "center",
    },
    searchInputWrapper: {
      position: "relative",
      flex: 1,
    },
    searchIcon: {
      position: "absolute",
      left: 14,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: 16,
      color: "#94A3B8",
      pointerEvents: "none",
    },
    searchInput: {
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      padding: "11px 14px 11px 40px",
      fontSize: 14,
      outline: "none",
      width: "100%",
      background: "#FAFAFA",
      color: "#0F172A",
      boxSizing: "border-box",
      transition: "border-color 0.15s, box-shadow 0.15s",
    },
    searchBtn: {
      background: "linear-gradient(135deg,#0D9488,#0891B2)",
      color: "white",
      border: "none",
      borderRadius: 10,
      padding: "11px 28px",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      whiteSpace: "nowrap",
      flexShrink: 0,
    },
    resultsCard: {
      background: "white",
      borderRadius: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
      border: "1px solid #E2E8F0",
      overflow: "hidden",
    },
    resultsHeader: {
      padding: "16px 20px",
      borderBottom: "1px solid #F1F5F9",
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    resultsTitle: {
      fontSize: 14,
      fontWeight: 600,
      color: "#0F172A",
      margin: 0,
    },
    countBadge: {
      background: "#F1F5F9",
      color: "#475569",
      borderRadius: 999,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 700,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      background: "#F8FAFC",
    },
    th: {
      padding: "12px 20px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      textAlign: "left",
      borderBottom: "1px solid #E2E8F0",
    },
    thCenter: {
      padding: "12px 20px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      textAlign: "center",
      borderBottom: "1px solid #E2E8F0",
    },
    td: {
      padding: "14px 20px",
      borderBottom: "1px solid #F1F5F9",
      fontSize: 14,
      color: "#1E293B",
    },
    tdCenter: {
      padding: "14px 20px",
      borderBottom: "1px solid #F1F5F9",
      fontSize: 14,
      color: "#1E293B",
      textAlign: "center",
    },
    idBadge: {
      background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
      color: "#1D4ED8",
      borderRadius: 999,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 700,
      display: "inline-block",
      letterSpacing: "0.04em",
    },
    viewBtn: {
      background: "linear-gradient(135deg,#0D9488,#0891B2)",
      color: "white",
      border: "none",
      borderRadius: 8,
      padding: "7px 18px",
      fontWeight: 600,
      fontSize: 12,
      cursor: "pointer",
    },
    emptyState: {
      textAlign: "center",
      padding: "48px 24px",
    },
    emptyIcon: {
      fontSize: 42,
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 15,
      fontWeight: 600,
      color: "#475569",
      margin: "0 0 6px 0",
    },
    emptyHint: {
      fontSize: 13,
      color: "#94A3B8",
      margin: 0,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={styles.page}
    >
      <h1 style={styles.pageTitle}>Search Patient</h1>
      <p style={styles.pageSubtitle}>Find patients by name or patient ID</p>

      {/* ── Search Card ── */}
      <div style={styles.searchCard}>
        <label style={styles.searchLabel}>Patient Name or ID</label>
        <div style={styles.searchRow}>
          <div style={styles.searchInputWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Enter patient name or ID…"
              style={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={e => { e.target.style.borderColor = "#0D9488"; e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.12)"; }}
              onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <motion.button
            whileHover={{ opacity: 0.88 }}
            whileTap={{ scale: 0.97 }}
            style={styles.searchBtn}
            onClick={handleSearch}
          >
            Search
          </motion.button>
        </div>
      </div>

      {/* ── Results ── */}
      <AnimatePresence>
        {searched && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.resultsCard}
          >
            <div style={styles.resultsHeader}>
              <span style={styles.resultsTitle}>Search Results</span>
              <span style={styles.countBadge}>{results.length} found</span>
            </div>

            {results.length > 0 ? (
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>Patient ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.thCenter}>Age</th>
                    <th style={styles.thCenter}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((p, idx) => (
                    <motion.tr
                      key={p.patient_id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      whileHover={{ backgroundColor: "#F8FAFC" }}
                    >
                      <td style={styles.td}>
                        <span style={styles.idBadge}>{p.patient_id}</span>
                      </td>
                      <td style={styles.td}>{p.name}</td>
                      <td style={styles.tdCenter}>{p.age}</td>
                      <td style={styles.tdCenter}>
                        <motion.button
                          whileHover={{ opacity: 0.85 }}
                          style={styles.viewBtn}
                          onClick={() => navigate(`/history/${p.patient_id}`)}
                        >
                          View History
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🔎</div>
                <p style={styles.emptyText}>No patients found</p>
                <p style={styles.emptyHint}>
                  Try a different name or ID — search is case-insensitive
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SearchPatient;