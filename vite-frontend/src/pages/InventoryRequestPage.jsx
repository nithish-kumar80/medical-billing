import { useState, useEffect } from "react";
import API from "../services/api";
import { Package, AlertCircle, AlertTriangle, Info, CheckCircle, XCircle, Clock } from "lucide-react";

const inp = { border:"1.5px solid #E2E8F0", borderRadius:9, padding:"10px 13px", fontSize:14, outline:"none", background:"#F8FAFC", fontFamily:"inherit", color:"#0F172A", width:"100%", transition:"border-color 0.15s" };
const lbl = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" };
const card = { background:"white", borderRadius:16, border:"1px solid #E2E8F0", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.04)", padding:24 };

const urgencyStyle = { Normal:{bg:"#EFF6FF",color:"#1D4ED8",icon:<Info size={11}/>}, Urgent:{bg:"#FFF7ED",color:"#C2410C",icon:<AlertTriangle size={11}/>}, Critical:{bg:"#FEF2F2",color:"#B91C1C",icon:<AlertCircle size={11}/>} };
const statusStyle = { Pending:{bg:"#FEF3C7",color:"#92400E"}, Approved:{bg:"#D1FAE5",color:"#065F46"}, Rejected:{bg:"#FEE2E2",color:"#991B1B"} };

function InventoryRequestPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ item:"", quantity:"", urgency:"Normal", reason:"" });

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try { const url = isAdmin ? "/inventory-requests" : `/inventory-requests/doctor/${user._id}`; const r = await API.get(url); setRequests(r.data); }
    catch(e){ console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.post("/inventory-requests", { ...form, quantity:Number(form.quantity), requested_by:user.name, requested_by_id:user._id }); alert("Request submitted ✅"); setForm({ item:"", quantity:"", urgency:"Normal", reason:"" }); fetchRequests(); }
    catch(e){ alert("Error submitting request"); }
  };

  const handleStatusChange = async (id, status) => {
    try { await API.patch(`/inventory-requests/${id}`, { status }); fetchRequests(); }
    catch(e){ alert("Error updating request"); }
  };

  const pending = requests.filter(r=>r.status==="Pending").length;
  const approved = requests.filter(r=>r.status==="Approved").length;

  return (
    <div style={{ maxWidth:960, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", marginBottom:4 }}>📦 Inventory Requests</h1>
        <p style={{ fontSize:13, color:"#64748B" }}>{isAdmin ? "Manage all inventory requests from doctors" : "Request medical supplies and equipment"}</p>
      </div>

      {/* Stats row (admin only) */}
      {isAdmin && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }}>
          {[
            { label:"Total Requests", value:requests.length, gradient:"linear-gradient(135deg,#3B82F6,#1D4ED8)" },
            { label:"Pending Review", value:pending, gradient:"linear-gradient(135deg,#F59E0B,#D97706)" },
            { label:"Approved", value:approved, gradient:"linear-gradient(135deg,#10B981,#059669)" },
          ].map((s,i)=>(
            <div key={i} style={{ background:s.gradient, borderRadius:14, padding:"18px 20px", color:"white", boxShadow:"0 4px 16px rgba(0,0,0,0.12)" }}>
              <div style={{ fontSize:11, fontWeight:500, opacity:0.8, marginBottom:6 }}>{s.label}</div>
              <div style={{ fontSize:30, fontWeight:800 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Create form (doctors only) */}
      {!isAdmin && (
        <div style={{ ...card, marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:"linear-gradient(135deg,#0D9488,#0891B2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Package size={16} color="white"/>
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:"#0F172A" }}>New Supply Request</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <label style={lbl}>Item Name</label>
                <input required placeholder="e.g. Oxygen Cylinder" value={form.item} onChange={e=>setForm({...form,item:e.target.value})} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
              </div>
              <div>
                <label style={lbl}>Quantity</label>
                <input type="number" required placeholder="5" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
              </div>
              <div>
                <label style={lbl}>Urgency Level</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  {["Normal","Urgent","Critical"].map(u=>{
                    const s = urgencyStyle[u];
                    const active = form.urgency===u;
                    return (
                      <button key={u} type="button" onClick={()=>setForm({...form,urgency:u})} style={{
                        border: active ? `2px solid ${s.color}` : "2px solid #E2E8F0",
                        background: active ? s.bg : "white",
                        color: active ? s.color : "#94A3B8",
                        borderRadius:8, padding:"8px 4px", fontSize:12, fontWeight:700,
                        cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:4, transition:"all 0.15s"
                      }}>{s.icon}{u}</button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={lbl}>Reason</label>
                <input placeholder="Why is this needed?" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
              </div>
            </div>
            <button type="submit" style={{ background:"linear-gradient(135deg,#0D9488,#0891B2)", color:"white", border:"none", borderRadius:10, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", width:"100%", fontFamily:"inherit" }}>
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* Requests table */}
      <div style={card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#0F172A" }}>{isAdmin ? "All Requests" : "My Requests"}</div>
          {pending>0 && <div style={{ background:"#FEF3C7", color:"#92400E", borderRadius:999, padding:"4px 12px", fontSize:12, fontWeight:700 }}>{pending} pending</div>}
        </div>
        {requests.length===0 ? (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <Package size={36} color="#CBD5E1" style={{ margin:"0 auto 10px" }}/>
            <p style={{ color:"#94A3B8", fontSize:13 }}>No requests yet.</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
                {["Item","Qty","Urgency", ...(isAdmin?["Requested By"]:[]), "Reason","Status",...(isAdmin?["Actions"]:[])].map(h=>(
                  <th key={h} style={{ padding:"12px 14px", fontSize:11, fontWeight:700, color:"#64748B", textAlign:"left", textTransform:"uppercase", letterSpacing:"0.07em", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {requests.map(r=>{
                  const us = urgencyStyle[r.urgency] || urgencyStyle.Normal;
                  const ss = statusStyle[r.status] || statusStyle.Pending;
                  return (
                    <tr key={r._id} style={{ borderTop:"1px solid #F1F5F9", transition:"background 0.12s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"13px 14px", fontSize:14, fontWeight:600, color:"#0F172A" }}>{r.item}</td>
                      <td style={{ padding:"13px 14px", fontSize:14, color:"#374151" }}>{r.quantity}</td>
                      <td style={{ padding:"13px 14px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:us.bg, color:us.color, borderRadius:999, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{us.icon}{r.urgency}</span>
                      </td>
                      {isAdmin && <td style={{ padding:"13px 14px", fontSize:13, color:"#374151" }}>{r.requested_by}</td>}
                      <td style={{ padding:"13px 14px", fontSize:13, color:"#64748B", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.reason||"—"}</td>
                      <td style={{ padding:"13px 14px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", background:ss.bg, color:ss.color, borderRadius:999, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{r.status}</span>
                      </td>
                      {isAdmin && (
                        <td style={{ padding:"13px 14px" }}>
                          {r.status==="Pending" ? (
                            <div style={{ display:"flex", gap:6 }}>
                              <button onClick={()=>handleStatusChange(r._id,"Approved")} style={{ background:"#D1FAE5", color:"#065F46", border:"none", borderRadius:7, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>✓ Approve</button>
                              <button onClick={()=>handleStatusChange(r._id,"Rejected")} style={{ background:"#FEE2E2", color:"#991B1B", border:"none", borderRadius:7, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>✕ Reject</button>
                            </div>
                          ) : <span style={{ fontSize:12, color:"#CBD5E1" }}>—</span>}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryRequestPage;
