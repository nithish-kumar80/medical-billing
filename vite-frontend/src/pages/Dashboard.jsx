import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const pageVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const statCards = [
  { key: "totalPatients",     label: "Total Patients",      icon: "👥", gradient: "linear-gradient(135deg,#3B82F6,#1D4ED8)" },
  { key: "totalVisits",       label: "Total Visits",        icon: "🩺", gradient: "linear-gradient(135deg,#8B5CF6,#6D28D9)" },
  { key: "totalRevenue",      label: "Total Revenue",       icon: "💰", gradient: "linear-gradient(135deg,#10B981,#059669)", prefix: "₹" },
  { key: "opPatients",        label: "OP Patients",         icon: "🏥", gradient: "linear-gradient(135deg,#0D9488,#0891B2)" },
  { key: "ipPatients",        label: "IP Patients",         icon: "🛏️", gradient: "linear-gradient(135deg,#F59E0B,#D97706)" },
  { key: "todayAppointments", label: "Today's Appointments",icon: "📅", gradient: "linear-gradient(135deg,#EC4899,#BE185D)" },
  { key: "currentlyAdmitted", label: "Currently Admitted",  icon: "🚨", gradient: "linear-gradient(135deg,#EF4444,#B91C1C)" },
];

function Dashboard() {
  const [data, setData] = useState({
    totalPatients: 0,
    totalVisits: 0,
    totalRevenue: 0,
    revenueData: [],
    claimStats: {}
  });

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchDoctors();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Doctors list error:", err);
    }
  };

  const revenueData = data.revenueData || [];

  const claimData = [
    { name: "Approved", value: data.claimStats.approved || 0 },
    { name: "Pending",  value: data.claimStats.pending  || 0 },
    { name: "Rejected", value: data.claimStats.rejected || 0 }
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F8FAFC",
      padding: "32px 36px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    },
    header: {
      marginBottom: 28,
      borderBottom: "1px solid #E2E8F0",
      paddingBottom: 20,
    },
    headerTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    pageTitle: {
      fontSize: 26,
      fontWeight: 800,
      color: "#0F172A",
      margin: 0,
      letterSpacing: "-0.4px",
    },
    pageSubtitle: {
      fontSize: 13,
      color: "#64748B",
      margin: "4px 0 0 0",
    },
    dateBadge: {
      background: "white",
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      padding: "8px 16px",
      fontSize: 13,
      color: "#475569",
      fontWeight: 500,
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 18,
      marginBottom: 28,
    },
    statCard: {
      borderRadius: 16,
      padding: "22px 20px",
      color: "white",
      boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      position: "relative",
      overflow: "hidden",
      cursor: "default",
    },
    statIcon: {
      fontSize: 28,
      marginBottom: 10,
      display: "block",
    },
    statLabel: {
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      opacity: 0.85,
      marginBottom: 6,
    },
    statValue: {
      fontSize: 32,
      fontWeight: 800,
      lineHeight: 1,
      letterSpacing: "-0.5px",
    },
    statDecor: {
      position: "absolute",
      right: -14,
      top: -14,
      width: 72,
      height: 72,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.12)",
    },
    chartsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 20,
      marginBottom: 24,
    },
    card: {
      background: "white",
      borderRadius: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
      border: "1px solid #E2E8F0",
      padding: "24px 28px",
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: 700,
      color: "#0F172A",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    cardTitleDot: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "#0D9488",
      display: "inline-block",
    },
    doctorsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 14,
    },
    doctorCard: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: "14px 16px",
      transition: "box-shadow 0.2s, transform 0.2s",
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#0D9488,#0891B2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: 700,
      fontSize: 18,
      flexShrink: 0,
    },
    doctorName: {
      fontSize: 14,
      fontWeight: 600,
      color: "#0F172A",
      margin: 0,
    },
    doctorEmail: {
      fontSize: 12,
      color: "#64748B",
      margin: "2px 0 0 0",
    },
    emptyText: {
      color: "#94A3B8",
      fontSize: 14,
      textAlign: "center",
      padding: "24px 0",
    },
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  return (
    <motion.div
      variants={pageVariant}
      initial="hidden"
      animate="visible"
      style={styles.page}
    >
      {/* ── Page Header ── */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard</h1>
            <p style={styles.pageSubtitle}>Welcome back — here's what's happening today</p>
          </div>
          <span style={styles.dateBadge}>📅 {today}</span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={styles.statsGrid}>
        {statCards.map(({ key, label, icon, gradient, prefix = "" }) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}
            style={{ ...styles.statCard, background: gradient }}
          >
            <div style={styles.statDecor} />
            <span style={styles.statIcon}>{icon}</span>
            <div style={styles.statLabel}>{label}</div>
            <div style={styles.statValue}>
              {prefix}{data[key] ?? 0}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div style={styles.chartsGrid}>

        {/* Bar Chart */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={styles.cardTitleDot} />
            Revenue per Bill
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11, fill: "#94A3B8" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13 }}
              />
              <Bar dataKey="amount" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D9488" />
                  <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={styles.cardTitleDot} />
            Claims Status
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={claimData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={40}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {claimData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#64748B" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── Doctors List ── */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span style={styles.cardTitleDot} />
          Registered Doctors
        </div>
        {doctors.length === 0 ? (
          <p style={styles.emptyText}>No doctors registered yet.</p>
        ) : (
          <div style={styles.doctorsGrid}>
            {doctors.map((doc, idx) => (
              <motion.div
                key={idx}
                whileHover={{ boxShadow: "0 4px 16px rgba(0,0,0,0.10)", transform: "translateY(-2px)" }}
                style={styles.doctorCard}
              >
                <div style={styles.avatar}>
                  {doc.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={styles.doctorName}>{doc.name}</p>
                  <p style={styles.doctorEmail}>{doc.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
}

export default Dashboard;