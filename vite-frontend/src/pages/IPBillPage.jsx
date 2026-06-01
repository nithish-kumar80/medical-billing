import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { FileText, Shield } from "lucide-react";

function IPBillPage() {
  const { visit_id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => { fetchBill(); }, []);
  const fetchBill = async () => { try { const r = await API.get(`/visits/${visit_id}/final-bill`); setData(r.data); } catch(e){ console.error(e); } };
  const submitClaim = async () => {
    try { await API.post(`/claims/${visit_id}`, { provider:"City Hospital", payer:"Insurance Co." }); alert("Claim submitted ✅"); }
    catch(e){ alert("Claim already exists or error"); }
  };

  if (!data) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:40, height:40, border:"3px solid #0D9488", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 12px" }} />
        <p style={{ color:"#64748B", fontSize:14 }}>Loading final bill…</p>
      </div>
    </div>
  );

  const { visit, patient, treatments, treatmentTotal, dailyChargesTotal, daysAdmitted, grandTotal } = data;
  const tax = grandTotal * 0.05;
  const finalAmount = grandTotal + tax;

  const wardColors = { ICU:{ bg:"#FEF2F2", color:"#B91C1C" }, Private:{ bg:"#F0FDF4", color:"#15803D" }, General:{ bg:"#EFF6FF", color:"#1D4ED8" } };
  const wc = wardColors[visit.admissionDetails?.ward] || wardColors.General;

  const thS = { padding:"11px 14px", fontSize:11, fontWeight:700, color:"#64748B", textAlign:"left", textTransform:"uppercase", letterSpacing:"0.07em", background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" };
  const tdS = { padding:"12px 14px", fontSize:14, color:"#374151", borderBottom:"1px solid #F1F5F9" };

  return (
    <div style={{ maxWidth:860, margin:"0 auto" }}>
      {/* Page header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", marginBottom:4 }}>IP Final Bill</h1>
        <p style={{ fontSize:13, color:"#64748B" }}>In-patient discharge billing summary</p>
      </div>

      {/* Main bill card */}
      <div style={{ background:"white", borderRadius:20, border:"1px solid #E2E8F0", boxShadow:"0 4px 24px rgba(0,0,0,0.07)", overflow:"hidden", marginBottom:20 }}>

        {/* Teal header */}
        <div style={{ background:"linear-gradient(135deg,#0F172A,#1E293B)", padding:"24px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:20, fontWeight:800, color:"white" }}>🏥 City Hospital</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:4 }}>In-Patient Final Bill · Chennai</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:2 }}>Visit ID</div>
            <div style={{ fontSize:15, fontWeight:700, color:"#0D9488", fontFamily:"monospace" }}>{visit.visit_id}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:2 }}>{new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}</div>
          </div>
        </div>

        {/* Patient + Admission info */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", borderBottom:"1px solid #E2E8F0" }}>
          <div style={{ padding:"20px 24px", borderRight:"1px solid #E2E8F0" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Patient</div>
            <div style={{ fontSize:17, fontWeight:700, color:"#0F172A", marginBottom:4 }}>{patient?.name}</div>
            <div style={{ fontSize:13, color:"#64748B" }}>ID: {patient?.patient_id}</div>
            <div style={{ fontSize:13, color:"#64748B" }}>Age {patient?.age} · {patient?.gender}</div>
          </div>
          <div style={{ padding:"20px 24px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Admission</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
              <span style={{ background:wc.bg, color:wc.color, borderRadius:999, padding:"3px 10px", fontSize:12, fontWeight:700 }}>{visit.admissionDetails?.ward}</span>
              <span style={{ background:"#F8FAFC", color:"#475569", borderRadius:999, padding:"3px 10px", fontSize:12, fontWeight:600 }}>Room {visit.admissionDetails?.roomNumber}</span>
              <span style={{ background:"#F8FAFC", color:"#475569", borderRadius:999, padding:"3px 10px", fontSize:12, fontWeight:600 }}>Bed {visit.admissionDetails?.bedNumber}</span>
            </div>
            <div style={{ fontSize:13, color:"#64748B" }}><strong style={{color:"#0F172A"}}>{daysAdmitted}</strong> days admitted</div>
            {visit.dischargeDetails?.dischargeDate && (
              <div style={{ fontSize:13, color:"#64748B", marginTop:2 }}>Discharged: {new Date(visit.dischargeDetails.dischargeDate).toLocaleDateString("en-IN")}</div>
            )}
          </div>
        </div>

        {/* Discharge summary */}
        {visit.dischargeDetails?.summary && (
          <div style={{ padding:"16px 24px", background:"#EFF6FF", borderBottom:"1px solid #BFDBFE" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#1D4ED8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Discharge Summary</div>
            <div style={{ fontSize:13, color:"#374151", marginBottom:4 }}>{visit.dischargeDetails.summary}</div>
            <div style={{ fontSize:13, color:"#1D4ED8" }}><strong>Final Diagnosis:</strong> {visit.dischargeDetails.finalDiagnosis}</div>
          </div>
        )}

        {/* Treatments */}
        <div style={{ padding:"16px 24px 0", borderBottom:"1px solid #E2E8F0" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Treatments (CPT)</div>
          <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:0 }}>
            <thead><tr><th style={thS}>Code</th><th style={thS}>Description</th><th style={{...thS,textAlign:"right"}}>Cost</th></tr></thead>
            <tbody>
              {treatments.length > 0 ? treatments.map((t,i)=>(
                <tr key={i}><td style={{...tdS,fontFamily:"monospace",color:"#0D9488",fontWeight:700}}>{t.code}</td><td style={tdS}>{t.description}</td><td style={{...tdS,textAlign:"right",fontWeight:700}}>₹{t.cost}</td></tr>
              )) : <tr><td colSpan={3} style={{...tdS,textAlign:"center",color:"#94A3B8",padding:"24px"}}>No treatments</td></tr>}
              {treatments.length>0 && <tr style={{background:"#F8FAFC"}}><td colSpan={2} style={{...tdS,fontWeight:700,color:"#64748B",textAlign:"right",borderBottom:"none"}}>Treatments Total</td><td style={{...tdS,fontWeight:800,color:"#0F172A",textAlign:"right",borderBottom:"none"}}>₹{treatmentTotal}</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Daily charges */}
        <div style={{ padding:"16px 24px 0", borderBottom:"1px solid #E2E8F0" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Daily Charges</div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr><th style={thS}>Type</th><th style={thS}>Date</th><th style={{...thS,textAlign:"right"}}>Amount</th></tr></thead>
            <tbody>
              {(visit.dailyCharges||[]).length > 0 ? visit.dailyCharges.map((c,i)=>(
                <tr key={i}><td style={tdS}>{c.type}</td><td style={{...tdS,fontFamily:"monospace",fontSize:13}}>{c.date?new Date(c.date).toLocaleDateString("en-IN"):"—"}</td><td style={{...tdS,textAlign:"right",fontWeight:700}}>₹{c.amount}</td></tr>
              )) : <tr><td colSpan={3} style={{...tdS,textAlign:"center",color:"#94A3B8",padding:"24px"}}>No daily charges</td></tr>}
              {(visit.dailyCharges||[]).length>0 && <tr style={{background:"#F8FAFC"}}><td colSpan={2} style={{...tdS,fontWeight:700,color:"#64748B",textAlign:"right",borderBottom:"none"}}>Daily Charges Total</td><td style={{...tdS,fontWeight:800,color:"#0F172A",textAlign:"right",borderBottom:"none"}}>₹{dailyChargesTotal}</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Grand total */}
        <div style={{ padding:"20px 24px", background:"#F8FAFC" }}>
          <div style={{ maxWidth:320, marginLeft:"auto" }}>
            {[["Treatments","₹"+treatmentTotal],["Daily Charges","₹"+dailyChargesTotal],["Tax (5%)","₹"+tax.toFixed(2)]].map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #E2E8F0" }}>
                <span style={{ fontSize:14, color:"#64748B" }}>{l}</span>
                <span style={{ fontSize:14, fontWeight:600, color:"#0F172A" }}>{v}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"14px 0 0" }}>
              <span style={{ fontSize:16, fontWeight:700, color:"#0F172A" }}>Grand Total</span>
              <span style={{ fontSize:22, fontWeight:800, color:"#0D9488" }}>₹{finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display:"flex", gap:12 }}>
        <button onClick={()=>navigate(`/billing/${visit_id}`)} style={{ flex:1, background:"linear-gradient(135deg,#3B82F6,#1D4ED8)", color:"white", border:"none", borderRadius:11, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"inherit" }}>
          <FileText size={16}/> View OP Invoice
        </button>
        <button onClick={submitClaim} style={{ flex:1, background:"linear-gradient(135deg,#8B5CF6,#6D28D9)", color:"white", border:"none", borderRadius:11, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"inherit" }}>
          <Shield size={16}/> Submit Insurance Claim
        </button>
      </div>
    </div>
  );
}

export default IPBillPage;
