import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

const pageVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/patients").then(res => setPatients(res.data));
  }, []);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.patient_id?.toLowerCase().includes(search.toLowerCase())
  );

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F8FAFC",
      padding: "32px 36px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    titleGroup: {},
    pageTitle: {
      fontSize: 22,
      fontWeight: 700,
      color: "#0F172A",
      margin: 0,
    },
    pageSubtitle: {
      fontSize: 13,
      color: "#64748B",
      margin: "4px 0 0 0",
    },
    searchWrapper: {
      position: "relative",
      width: 300,
    },
    searchIcon: {
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      color: "#94A3B8",
      fontSize: 15,
      pointerEvents: "none",
    },
    searchInput: {
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      padding: "10px 14px 10px 36px",
      fontSize: 13,
      outline: "none",
      width: "100%",
      background: "white",
      color: "#0F172A",
      boxSizing: "border-box",
    },
    card: {
      background: "white",
      borderRadius: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
      border: "1px solid #E2E8F0",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thead: {
      background: "#F8FAFC",
    },
    th: {
      padding: "12px 16px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      textAlign: "left",
      borderBottom: "1px solid #E2E8F0",
    },
    thCenter: {
      padding: "12px 16px",
      fontSize: 12,
      fontWeight: 600,
      color: "#64748B",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      textAlign: "center",
      borderBottom: "1px solid #E2E8F0",
    },
    td: {
      padding: "14px 16px",
      borderBottom: "1px solid #F1F5F9",
      fontSize: 14,
      color: "#1E293B",
    },
    tdCenter: {
      padding: "14px 16px",
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
    actionsCell: {
      padding: "14px 16px",
      borderBottom: "1px solid #F1F5F9",
      textAlign: "center",
      display: "flex",
      gap: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    btnView: {
      background: "linear-gradient(135deg,#0D9488,#0891B2)",
      color: "white",
      border: "none",
      borderRadius: 8,
      padding: "7px 16px",
      fontWeight: 600,
      fontSize: 12,
      cursor: "pointer",
      transition: "opacity 0.15s",
    },
    btnVisit: {
      background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
      color: "white",
      border: "none",
      borderRadius: 8,
      padding: "7px 16px",
      fontWeight: 600,
      fontSize: 12,
      cursor: "pointer",
      transition: "opacity 0.15s",
    },
    emptyRow: {
      textAlign: "center",
      padding: 40,
      color: "#94A3B8",
      fontSize: 14,
    },
    countBadge: {
      background: "#F1F5F9",
      color: "#475569",
      borderRadius: 999,
      padding: "3px 12px",
      fontSize: 12,
      fontWeight: 600,
      marginLeft: 10,
      verticalAlign: "middle",
    },
  };

  return (
    <motion.div
      variants={pageVariant}
      initial="hidden"
      animate="visible"
      style={styles.page}
    >
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.pageTitle}>
            Patients
            <span style={styles.countBadge}>{filtered.length}</span>
          </h1>
          <p style={styles.pageSubtitle}>Browse and manage registered patients</p>
        </div>

        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search by name or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table Card ── */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Patient ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.thCenter}>Age</th>
              <th style={styles.thCenter}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={styles.emptyRow}>
                  No patients found.
                </td>
              </tr>
            ) : (
              filtered.map((p, idx) => (
                <motion.tr
                  key={p.patient_id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ backgroundColor: "#F8FAFC" }}
                  style={{ cursor: "default" }}
                >
                  <td style={styles.td}>
                    <span style={styles.idBadge}>{p.patient_id}</span>
                  </td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.tdCenter}>{p.age}</td>
                  <td style={styles.tdCenter}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      <motion.button
                        whileHover={{ opacity: 0.85 }}
                        style={styles.btnView}
                        onClick={() => navigate(`/history/${p.patient_id}`)}
                      >
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ opacity: 0.85 }}
                        style={styles.btnVisit}
                        onClick={() => navigate(`/add-visit/${p.patient_id}`)}
                      >
                        Visit
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default Patients;