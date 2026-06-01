import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { CheckCircle } from "lucide-react";

const inp = { border:"1.5px solid #E2E8F0", borderRadius:9, padding:"10px 14px", fontSize:14, outline:"none", background:"#F8FAFC", fontFamily:"inherit", color:"#0F172A", width:"100%", transition:"border-color 0.15s" };
const lbl = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" };

function DischargePage() {
  const { visit_id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ summary:"", finalDiagnosis:"", dischargeDate:new Date().toISOString().split("T")[0] });

  const handleDischarge = async (e) => {
    e.preventDefault();
    try { await API.put(`/visits/${visit_id}/discharge`, form); alert("Patient discharged ✅"); navigate(`/ip-bill/${visit_id}`); }
    catch (err) { console.error(err); alert("Error discharging patient ❌"); }
  };

  return (
    <div style={{ display:"flex", justifyContent:"center" }}>
      <form onSubmit={handleDischarge} style={{ background:"white", borderRadius:20, border:"1px solid #E2E8F0", boxShadow:"0 4px 32px rgba(0,0,0,0.08)", padding:36, width:"100%", maxWidth:520 }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#10B981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", boxShadow:"0 4px 16px rgba(16,185,129,0.3)" }}>
            <CheckCircle size={26} color="white" />
          </div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#0F172A", margin:0 }}>Discharge Patient</h2>
          <p style={{ fontSize:13, color:"#94A3B8", marginTop:6 }}>
            Visit: <span style={{ fontFamily:"monospace", fontWeight:700, color:"#0D9488" }}>{visit_id}</span>
          </p>
        </div>

        {/* Discharge Date */}
        <div style={{ marginBottom:18 }}>
          <label style={lbl}>Discharge Date</label>
          <input type="date" required value={form.dischargeDate} onChange={e=>setForm({...form,dischargeDate:e.target.value})} style={inp}
            onFocus={e=>e.target.style.borderColor="#10B981"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
        </div>

        {/* Final Diagnosis */}
        <div style={{ marginBottom:18 }}>
          <label style={lbl}>Final Diagnosis</label>
          <input required placeholder="e.g. Pneumonia — Resolved" value={form.finalDiagnosis} onChange={e=>setForm({...form,finalDiagnosis:e.target.value})} style={inp}
            onFocus={e=>e.target.style.borderColor="#10B981"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
        </div>

        {/* Discharge Summary */}
        <div style={{ marginBottom:28 }}>
          <label style={lbl}>Discharge Summary</label>
          <textarea required rows={5} placeholder="Patient was admitted for... Treatment included... Patient is advised to..." value={form.summary}
            onChange={e=>setForm({...form,summary:e.target.value})}
            style={{...inp, resize:"vertical"}}
            onFocus={e=>e.target.style.borderColor="#10B981"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
        </div>

        {/* Info banner */}
        <div style={{ background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:10, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#15803D", display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>ℹ️</span>
          <span>After confirming discharge, you will be automatically redirected to the <strong>IP Bill page</strong> to generate the final invoice.</span>
        </div>

        <button type="submit" style={{ width:"100%", background:"linear-gradient(135deg,#10B981,#059669)", color:"white", border:"none", borderRadius:11, padding:"14px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 16px rgba(16,185,129,0.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <CheckCircle size={18}/> Confirm Discharge & Generate Bill
        </button>
      </form>
    </div>
  );
}

export default DischargePage;
