import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserPlus, FileText, Package,
  Pill, CalendarDays, Activity, Stethoscope, ClipboardList,
  HeartPulse, ChevronRight
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const adminMenu = [
    { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Patients", path: "/patients", icon: Users },
    { label: "Add Patient", path: "/add-patient", icon: UserPlus },
    { label: "Claims", path: "/claims", icon: FileText },
    { label: "Inventory Requests", path: "/inventory-requests", icon: Package },
  ];

  const doctorMenu = [
    { label: "Dashboard", path: "/doctor-dashboard", icon: LayoutDashboard },
    { label: "Prescriptions", path: "/prescriptions", icon: Pill },
    { label: "Inventory Requests", path: "/inventory-requests", icon: Package },
  ];

  const patientMenu = [
    { label: "My Portal", path: "/patient-portal", icon: HeartPulse },
  ];

  const menu =
    user?.role === "admin" ? adminMenu :
    user?.role === "doctor" ? doctorMenu :
    patientMenu;

  const roleLabel =
    user?.role === "admin" ? "Administration" :
    user?.role === "doctor" ? "Clinical" : "Patient";

  const roleColor =
    user?.role === "admin" ? "#F59E0B" :
    user?.role === "doctor" ? "#06B6D4" : "#10B981";

  return (
    <div style={{
      width: "260px", minWidth: "260px",
      background: "#0F172A",
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      borderRight: "1px solid rgba(255,255,255,0.06)"
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg, #0D9488, #0891B2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(13,148,136,0.4)"
          }}>
            <HeartPulse size={22} color="white" />
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: "15px", letterSpacing: "-0.2px" }}>MedSystem</div>
            <div style={{ color: "#64748B", fontSize: "11px", fontWeight: 500 }}>Hospital Management</div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: "12px 20px 8px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "rgba(255,255,255,0.05)", borderRadius: "6px",
          padding: "4px 10px"
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: roleColor }} />
          <span style={{ color: "#94A3B8", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {roleLabel} Module
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
        {menu.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 12px", borderRadius: "10px", marginBottom: "2px",
                background: active ? "rgba(13,148,136,0.15)" : "transparent",
                borderLeft: active ? "3px solid #0D9488" : "3px solid transparent",
                transition: "all 0.15s ease",
                cursor: "pointer"
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={17} color={active ? "#0D9488" : "#64748B"} />
                <span style={{
                  color: active ? "#E2E8F0" : "#94A3B8",
                  fontSize: "13.5px", fontWeight: active ? 600 : 400,
                  flex: 1
                }}>{item.label}</span>
                {active && <ChevronRight size={13} color="#0D9488" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div style={{
        padding: "16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: `linear-gradient(135deg, ${roleColor}33, ${roleColor}22)`,
            border: `1px solid ${roleColor}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: "13px", color: roleColor
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#E2E8F0", fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name || "User"}
            </div>
            <div style={{ color: "#64748B", fontSize: "11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email || ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;