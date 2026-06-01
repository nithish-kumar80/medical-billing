import { useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

function AddPatient() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/patients", form);
    alert("Patient Added ✅");
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F8FAFC",
      padding: "32px 36px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    headerWrapper: {
      width: "100%",
      maxWidth: 520,
      marginBottom: 28,
    },
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
    card: {
      background: "white",
      borderRadius: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
      border: "1px solid #E2E8F0",
      padding: "36px 40px",
      width: "100%",
      maxWidth: 520,
    },
    iconCircle: {
      width: 54,
      height: 54,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#0D9488,#0891B2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      marginBottom: 20,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: 700,
      color: "#0F172A",
      margin: "0 0 6px 0",
    },
    formSubtitle: {
      fontSize: 13,
      color: "#64748B",
      margin: "0 0 28px 0",
    },
    fieldGroup: {
      marginBottom: 20,
    },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 600,
      color: "#374151",
      marginBottom: 6,
    },
    input: {
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 14,
      outline: "none",
      width: "100%",
      background: "#FAFAFA",
      color: "#0F172A",
      boxSizing: "border-box",
      transition: "border-color 0.15s, box-shadow 0.15s",
    },
    select: {
      border: "1px solid #E2E8F0",
      borderRadius: 10,
      padding: "10px 14px",
      fontSize: 14,
      outline: "none",
      width: "100%",
      background: "#FAFAFA",
      color: "#0F172A",
      boxSizing: "border-box",
      cursor: "pointer",
      appearance: "none",
    },
    divider: {
      borderTop: "1px solid #F1F5F9",
      margin: "28px 0 24px",
    },
    submitBtn: {
      background: "linear-gradient(135deg,#0D9488,#0891B2)",
      color: "white",
      border: "none",
      borderRadius: 10,
      padding: "12px 22px",
      fontWeight: 600,
      fontSize: 15,
      cursor: "pointer",
      width: "100%",
      transition: "opacity 0.15s, transform 0.1s",
      letterSpacing: "0.02em",
    },
    twoCol: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={styles.page}
    >
      <div style={styles.headerWrapper}>
        <h1 style={styles.pageTitle}>Add New Patient</h1>
        <p style={styles.pageSubtitle}>Register a new patient into the system</p>
      </div>

      <div style={styles.card}>
        <div style={styles.iconCircle}>🧑‍⚕️</div>
        <h2 style={styles.formTitle}>Patient Information</h2>
        <p style={styles.formSubtitle}>Fill in all required details below</p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              placeholder="e.g. Ramesh Kumar"
              onFocus={e => { e.target.style.borderColor = "#0D9488"; e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.12)"; }}
              onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Age + Gender in two columns */}
          <div style={styles.twoCol}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Age</label>
              <input
                style={styles.input}
                type="number"
                placeholder="e.g. 35"
                onFocus={e => { e.target.style.borderColor = "#0D9488"; e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Gender</label>
              <select
                style={styles.select}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          {/* Mobile */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mobile Number</label>
            <input
              style={styles.input}
              placeholder="e.g. 9876543210"
              onFocus={e => { e.target.style.borderColor = "#0D9488"; e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.12)"; }}
              onBlur={e => { e.target.style.borderColor = "#E2E8F0"; e.target.style.boxShadow = "none"; }}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>

          <div style={styles.divider} />

          <motion.button
            type="submit"
            whileHover={{ opacity: 0.9, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={styles.submitBtn}
          >
            ✅ Register Patient
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default AddPatient;