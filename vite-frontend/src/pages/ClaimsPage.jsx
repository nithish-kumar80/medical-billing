import { useEffect, useState } from "react";
import API from "../services/api";
import { FileText, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";

const S = {
  card: { background:"white", borderRadius:16, border:"1px solid #E2E8F0", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.04)", padding:24 },
  badge: (s) => {
    const m = { Approved:{bg:"#D1FAE5",color:"#065F46"}, Rejected:{bg:"#FEE2E2",color:"#991B1B"}, Pending:{bg:"#FEF3C7",color:"#92400E"} };
    return { display:"inline-flex",alignItems:"center",gap:4, background:m[s]?.bg||"#F1F5F9", color:m[s]?.color||"#475569", padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" };
  }
};

function ClaimsPage() {
  const [claims, setClaims] = useState([]);

  const fetchClaims = async () => {
    try { const res = await API.get("/claims"); setClaims(res.data); }
    catch (err) { console.error("Error fetching claims:", err); }
  };

  useEffect(() => { fetchClaims(); }, []);

  const updateStatus = async (id, newStatus) => {
    try { await API.put(`/claims/${id}`, { status: newStatus }); fetchClaims(); }
    catch (err) { console.error("Error updating claim:", err); }
  };

  const total = claims.length;
  const approved = claims.filter(c => c.status === "Approved").length;
  const pending = claims.filter(c => c.status === "Pending").length;
  const rejected = claims.filter(c => c.status === "Rejected").length;

  const statCards = [
    { label:"Total Claims", value:total, gradient:"linear-gradient(135deg,#3B82F6,#1D4ED8)", icon:<FileText size={22} color="rgba(255,255,255,0.85)" /> },
    { label:"Approved", value:approved, gradient:"linear-gradient(135deg,#10B981,#059669)", icon:<CheckCircle size={22} color="rgba(255,255,255,0.85)" /> },
    { label:"Pending", value:pending, gradient:"linear-gradient(135deg,#F59E0B,#D97706)", icon:<Clock size={22} color="rgba(255,255,255,0.85)" /> },
    { label:"Rejected", value:rejected, gradient:"linear-gradient(135deg,#EF4444,#B91C1C)", icon:<XCircle size={22} color="rgba(255,255,255,0.85)" /> },
  ];

  return (
    <div style={{ animation:"fadeIn .3s ease" }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", marginBottom:4 }}>Insurance Claims</h1>
        <p style={{ fontSize:13, color:"#64748B" }}>Manage and review all submitted insurance claims</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18, marginBottom:28 }}>
        {statCards.map((c,i) => (
          <div key={i} style={{ background:c.gradient, borderRadius:16, padding:"20px 22px", color:"white", display:"flex", justifyContent:"space-between", alignItems:"flex-start", boxShadow:"0 4px 16px rgba(0,0,0,0.12)" }}>
            <div>
              <div style={{ fontSize:12, fontWeight:500, opacity:0.8, marginBottom:8 }}>{c.label}</div>
              <div style={{ fontSize:32, fontWeight:800, lineHeight:1 }}>{c.value}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:10, padding:10 }}>{c.icon}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={S.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:"#0F172A" }}>All Claims</h2>
          <div style={{ background:"#F1F5F9", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:600, color:"#64748B" }}>{total} records</div>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
                {["Visit ID","Insurance / Payer","Amount (₹)","Status","Actions"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:"#64748B", textAlign:"left", textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr><td colSpan={5} style={{ padding:"48px 16px", textAlign:"center", color:"#94A3B8", fontSize:14 }}>No claims found</td></tr>
              ) : claims.map((c, idx) => (
                <tr key={c._id} style={{ borderBottom:"1px solid #F1F5F9", transition:"background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#F8FAFC"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ background:"#EFF6FF", color:"#1D4ED8", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:700, fontFamily:"monospace" }}>{c.visit_id}</span>
                  </td>
                  <td style={{ padding:"14px 16px", fontSize:14, color:"#1E293B", fontWeight:500 }}>{c.payer}</td>
                  <td style={{ padding:"14px 16px", fontSize:15, fontWeight:700, color:"#0D9488" }}>₹{c.total_amount || 0}</td>
                  <td style={{ padding:"14px 16px" }}><span style={S.badge(c.status)}>{c.status}</span></td>
                  <td style={{ padding:"14px 16px" }}>
                    {c.status === "Pending" ? (
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => updateStatus(c._id,"Approved")} style={{ background:"#D1FAE5", color:"#065F46", border:"none", borderRadius:7, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.15s" }}
                          onMouseEnter={e=>e.target.style.background="#A7F3D0"} onMouseLeave={e=>e.target.style.background="#D1FAE5"}>✓ Approve</button>
                        <button onClick={() => updateStatus(c._id,"Rejected")} style={{ background:"#FEE2E2", color:"#991B1B", border:"none", borderRadius:7, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.15s" }}
                          onMouseEnter={e=>e.target.style.background="#FECACA"} onMouseLeave={e=>e.target.style.background="#FEE2E2"}>✕ Reject</button>
                      </div>
                    ) : <span style={{ fontSize:12, color:"#94A3B8" }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClaimsPage;