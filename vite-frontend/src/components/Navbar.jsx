import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, Search, Settings } from "lucide-react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const roleColor = user?.role === "admin" ? "#F59E0B" : user?.role === "doctor" ? "#06B6D4" : "#10B981";
  const roleBg = user?.role === "admin" ? "#FEF3C7" : user?.role === "doctor" ? "#CFFAFE" : "#D1FAE5";
  const roleText = user?.role === "admin" ? "#92400E" : user?.role === "doctor" ? "#0E7490" : "#065F46";

  return (
    <div style={{
      height: "62px", minHeight: "62px",
      background: "white",
      borderBottom: "1px solid #E2E8F0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
    }}>
      {/* Left: Breadcrumb / greeting */}
      <div>
        <div style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 500 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
          {user?.role === "doctor" ? `Welcome back, Dr. ${user?.name}` : `Welcome back, ${user?.name}`}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Role badge */}
        <div style={{
          background: roleBg, color: roleText,
          padding: "4px 12px", borderRadius: "999px",
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase"
        }}>
          {user?.role}
        </div>

        {/* Bell */}
        <button style={{
          width: "36px", height: "36px", borderRadius: "10px",
          border: "1px solid #E2E8F0", background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.15s"
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
        >
          <Bell size={16} color="#64748B" />
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "28px", background: "#E2E8F0" }} />

        {/* Logout */}
        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "linear-gradient(135deg, #EF4444, #DC2626)",
          color: "white", border: "none",
          padding: "8px 14px", borderRadius: "9px",
          fontSize: "13px", fontWeight: 600, cursor: "pointer",
          transition: "all 0.15s"
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;