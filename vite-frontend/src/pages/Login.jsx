import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Eye, EyeOff, User, Lock, Phone, ChevronRight, Stethoscope } from "lucide-react";

function Login() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "", phone: "", role: "patient" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await API.post("/login", loginForm);
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/redirect";
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await API.post("/register", regForm);
      setMode("login");
      setLoginForm({ email: regForm.email, password: "" });
      setRegForm({ name: "", email: "", password: "", phone: "", role: "patient" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: "100%", border: "1.5px solid #E2E8F0", borderRadius: "10px",
    padding: "11px 14px 11px 40px", fontSize: "14px", outline: "none",
    background: "#F8FAFC", transition: "border-color 0.15s",
    color: "#0F172A", fontFamily: "inherit"
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      position: "relative", overflow: "hidden"
    }}>
      {/* Decorative circles */}
      {[
        { size: 400, x: -100, y: -100, opacity: 0.04 },
        { size: 300, x: "60%", y: "60%", opacity: 0.03 },
        { size: 200, x: "80%", y: "10%", opacity: 0.05 },
      ].map((c, i) => (
        <div key={i} style={{
          position: "absolute", width: c.size, height: c.size,
          borderRadius: "50%", border: `1px solid rgba(13,148,136,${c.opacity * 8})`,
          left: c.x, top: c.y, background: `rgba(13,148,136,${c.opacity})`
        }} />
      ))}

      {/* Left panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px", position: "relative", display: "none"
      }}>
      </div>

      {/* Right: Login card — centered */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", position: "relative", zIndex: 1
      }}>
        <div style={{
          width: "100%", maxWidth: "420px",
          background: "white", borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
          overflow: "hidden"
        }}>
          {/* Card header */}
          <div style={{
            background: "linear-gradient(135deg, #0D9488, #0891B2)",
            padding: "28px 32px 24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "12px"
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(8px)"
            }}>
              <HeartPulse size={28} color="white" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "white", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.3px" }}>MedSystem</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", marginTop: "2px" }}>Hospital Management Portal</div>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
            {["login", "register"].map(tab => (
              <button key={tab} onClick={() => { setMode(tab); setError(""); }} style={{
                flex: 1, padding: "13px", border: "none", background: "transparent",
                fontSize: "13.5px", fontWeight: mode === tab ? 700 : 500,
                color: mode === tab ? "#0D9488" : "#94A3B8",
                borderBottom: mode === tab ? "2px solid #0D9488" : "2px solid transparent",
                cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit"
              }}>
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div style={{ padding: "28px 32px 32px" }}>
            {/* Error */}
            {error && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C",
                borderRadius: "9px", padding: "10px 14px", fontSize: "13px",
                marginBottom: "16px", fontWeight: 500
              }}>{error}</div>
            )}

            {mode === "login" ? (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <User size={15} color="#94A3B8" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)" }} />
                    <input type="email" required placeholder="you@example.com" value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#0D9488"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} color="#94A3B8" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)" }} />
                    <input type={showPass ? "text" : "password"} required placeholder="••••••••" value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      style={{ ...inputStyle, paddingRight: "42px" }}
                      onFocus={e => e.target.style.borderColor = "#0D9488"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{
                      position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", padding: 0
                    }}>
                      {showPass ? <EyeOff size={15} color="#94A3B8" /> : <Eye size={15} color="#94A3B8" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{
                  marginTop: "4px",
                  background: loading ? "#94A3B8" : "linear-gradient(135deg, #0D9488, #0891B2)",
                  color: "white", border: "none", borderRadius: "10px",
                  padding: "13px", fontSize: "14px", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "all 0.2s", fontFamily: "inherit"
                }}>
                  {loading ? "Signing in..." : <><span>Sign In</span><ChevronRight size={16} /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={15} color="#94A3B8" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)" }} />
                    <input type="text" required placeholder="John Doe" value={regForm.name}
                      onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#0D9488"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <User size={15} color="#94A3B8" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)" }} />
                    <input type="email" required placeholder="you@example.com" value={regForm.email}
                      onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#0D9488"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Phone Number</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={15} color="#94A3B8" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)" }} />
                    <input type="tel" required placeholder="+91 98765 43210" value={regForm.phone}
                      onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#0D9488"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={15} color="#94A3B8" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)" }} />
                    <input type="password" required placeholder="••••••••" value={regForm.password}
                      onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#0D9488"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>I am a</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {[
                      { val: "patient", label: "Patient", icon: "🧑", color: "#0D9488" },
                      { val: "doctor", label: "Doctor", icon: "🩺", color: "#0891B2" }
                    ].map(r => (
                      <button key={r.val} type="button" onClick={() => setRegForm({ ...regForm, role: r.val })} style={{
                        padding: "12px", borderRadius: "10px", cursor: "pointer", transition: "all 0.15s",
                        border: regForm.role === r.val ? `2px solid ${r.color}` : "2px solid #E2E8F0",
                        background: regForm.role === r.val ? `${r.color}10` : "white",
                        fontWeight: 600, fontSize: "13px",
                        color: regForm.role === r.val ? r.color : "#64748B",
                        fontFamily: "inherit"
                      }}>
                        <div style={{ fontSize: "20px", marginBottom: "4px" }}>{r.icon}</div>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{
                  marginTop: "4px",
                  background: loading ? "#94A3B8" : "linear-gradient(135deg, #0D9488, #0891B2)",
                  color: "white", border: "none", borderRadius: "10px",
                  padding: "13px", fontSize: "14px", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  fontFamily: "inherit"
                }}>
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;