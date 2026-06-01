import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const inp = { border:"1.5px solid #E2E8F0", borderRadius:9, padding:"10px 14px", fontSize:14, outline:"none", background:"#F8FAFC", fontFamily:"inherit", color:"#0F172A", width:"100%", transition:"border-color 0.15s" };
const lbl = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" };

function AdmissionForm() {
  const { visit_id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ward:"General", roomNumber:"", bedNumber:"", attendingDoctor:"", admissionDate:new Date().toISOString().split("T")[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.put(`/visits/${visit_id}/admit`, form); alert("Patient admitted ✅"); navigate(-1); }
    catch (err) { console.error(err); alert("Error admitting patient ❌"); }
  };

  const wardConfig = {
    ICU:     { emoji:"🚨", label:"ICU", desc:"Intensive Care", gradient:"linear-gradient(135deg,#EF4444,#DC2626)", border:"#EF4444", activeBg:"#FEF2F2" },
    General: { emoji:"🛏️", label:"General", desc:"Standard Ward", gradient:"linear-gradient(135deg,#3B82F6,#1D4ED8)", border:"#3B82F6", activeBg:"#EFF6FF" },
    Private: { emoji:"✨", label:"Private", desc:"Private Room", gradient:"linear-gradient(135deg,#10B981,#059669)", border:"#10B981", activeBg:"#F0FDF4" },
  };

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start" }}>
      <form onSubmit={handleSubmit} style={{ background:"white", borderRadius:20, border:"1px solid #E2E8F0", boxShadow:"0 4px 32px rgba(0,0,0,0.08)", padding:36, width:"100%", maxWidth:520 }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#EF4444,#DC2626)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", boxShadow:"0 4px 16px rgba(239,68,68,0.3)" }}>
            <span style={{ fontSize:26 }}>🏥</span>
          </div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#0F172A", margin:0 }}>Admit Patient (IP)</h2>
          <p style={{ fontSize:13, color:"#94A3B8", marginTop:6 }}>
            Visit: <span style={{ fontFamily:"monospace", fontWeight:700, color:"#0D9488" }}>{visit_id}</span>
          </p>
        </div>

        {/* Ward selection */}
        <div style={{ marginBottom:24 }}>
          <label style={lbl}>Ward Type</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {Object.entries(wardConfig).map(([w, c]) => {
              const active = form.ward === w;
              return (
                <button key={w} type="button" onClick={() => setForm({...form, ward:w})} style={{
                  padding:"16px 8px", borderRadius:12, cursor:"pointer", fontFamily:"inherit", transition:"all 0.18s",
                  border: active ? `2px solid ${c.border}` : "2px solid #E2E8F0",
                  background: active ? c.activeBg : "white",
                  boxShadow: active ? `0 4px 16px ${c.border}33` : "none",
                  textAlign:"center"
                }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{c.emoji}</div>
                  <div style={{ fontSize:13, fontWeight:700, color: active ? c.border : "#94A3B8" }}>{c.label}</div>
                  <div style={{ fontSize:11, color:"#CBD5E1", marginTop:2 }}>{c.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Room & Bed */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
          <div>
            <label style={lbl}>Room Number</label>
            <input required placeholder="e.g. 201" value={form.roomNumber} onChange={e=>setForm({...form,roomNumber:e.target.value})} style={inp}
              onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
          </div>
          <div>
            <label style={lbl}>Bed Number</label>
            <input required placeholder="e.g. B3" value={form.bedNumber} onChange={e=>setForm({...form,bedNumber:e.target.value})} style={inp}
              onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Attending Doctor</label>
          <input required placeholder="Dr. Name" value={form.attendingDoctor} onChange={e=>setForm({...form,attendingDoctor:e.target.value})} style={inp}
            onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={lbl}>Admission Date</label>
          <input type="date" required value={form.admissionDate} onChange={e=>setForm({...form,admissionDate:e.target.value})} style={inp}
            onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
        </div>

        <button type="submit" style={{ width:"100%", background:"linear-gradient(135deg,#EF4444,#DC2626)", color:"white", border:"none", borderRadius:11, padding:"14px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(239,68,68,0.3)" }}>
          Confirm Admission 🏥
        </button>
      </form>
    </div>
  );
}

export default AdmissionForm;
