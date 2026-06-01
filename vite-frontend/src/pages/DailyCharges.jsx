import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { PlusCircle, TrendingUp } from "lucide-react";

const inp = { border:"1.5px solid #E2E8F0", borderRadius:9, padding:"10px 13px", fontSize:14, outline:"none", background:"#F8FAFC", fontFamily:"inherit", color:"#0F172A", width:"100%", transition:"border-color 0.15s" };
const lbl = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" };

const typeStyle = {
  Room:     { bg:"#EFF6FF", color:"#1D4ED8" },
  ICU:      { bg:"#FEF2F2", color:"#B91C1C" },
  Nursing:  { bg:"#F5F3FF", color:"#6D28D9" },
  Medicine: { bg:"#F0FDF4", color:"#15803D" },
};

function DailyCharges() {
  const { visit_id } = useParams();
  const [charges, setCharges] = useState([]);
  const [form, setForm] = useState({ type:"Room", amount:"", date:new Date().toISOString().split("T")[0] });
  const [visit, setVisit] = useState(null);

  useEffect(() => { fetchCharges(); fetchVisit(); }, []);
  const fetchCharges = async () => { try { const r = await API.get(`/visits/${visit_id}/daily-charges`); setCharges(r.data); } catch(e){console.error(e);} };
  const fetchVisit  = async () => { try { const r = await API.get(`/billing/${visit_id}`); setVisit(r.data.visit); } catch(e){console.error(e);} };

  const handleAdd = async (e) => {
    e.preventDefault();
    try { await API.post(`/visits/${visit_id}/daily-charges`, { ...form, amount:Number(form.amount) }); setForm({ type:"Room", amount:"", date:new Date().toISOString().split("T")[0] }); fetchCharges(); }
    catch(e){ alert("Error adding charge"); }
  };

  const total = charges.reduce((s,c) => s + (c.amount||0), 0);

  return (
    <div style={{ maxWidth:780, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", marginBottom:4 }}>Daily Charges</h1>
          <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"#64748B" }}>
            <span>Visit: <span style={{ fontFamily:"monospace", fontWeight:700, color:"#0D9488" }}>{visit_id}</span></span>
            {visit?.admitted && (
              <span style={{ background:"#FEE2E2", color:"#991B1B", borderRadius:999, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
                IP — {visit.admissionDetails?.ward}
              </span>
            )}
          </div>
        </div>
        {/* Running total */}
        <div style={{ background:"linear-gradient(135deg,#0D9488,#0891B2)", borderRadius:14, padding:"14px 22px", textAlign:"right", boxShadow:"0 4px 16px rgba(13,148,136,0.25)" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", fontWeight:600, marginBottom:2 }}>RUNNING TOTAL</div>
          <div style={{ fontSize:26, fontWeight:800, color:"white" }}>₹{total}</div>
        </div>
      </div>

      {/* Add charge bar */}
      <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"18px 20px", marginBottom:20, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        <form onSubmit={handleAdd} style={{ display:"flex", gap:14, alignItems:"flex-end", flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 160px" }}>
            <label style={lbl}>Charge Type</label>
            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={inp}
              onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}>
              {["Room","ICU","Nursing","Medicine"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ flex:"1 1 120px" }}>
            <label style={lbl}>Amount (₹)</label>
            <input type="number" required placeholder="500" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} style={inp}
              onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
          </div>
          <div style={{ flex:"1 1 150px" }}>
            <label style={lbl}>Date</label>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp}
              onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
          </div>
          <button type="submit" style={{ background:"linear-gradient(135deg,#0D9488,#0891B2)", color:"white", border:"none", borderRadius:9, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
            <PlusCircle size={15}/> Add Charge
          </button>
        </form>
      </div>

      {/* Charges table */}
      <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
            {["#","Type","Date","Amount"].map((h,i)=>(
              <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:"#64748B", textAlign: i===3 ? "right" : "left", textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {charges.length === 0 ? (
              <tr><td colSpan={4} style={{ padding:"48px 16px", textAlign:"center", color:"#94A3B8", fontSize:14 }}>No charges recorded yet.</td></tr>
            ) : charges.map((c,i)=>{
              const ts = typeStyle[c.type] || { bg:"#F1F5F9", color:"#475569" };
              return (
                <tr key={i} style={{ borderTop:"1px solid #F1F5F9", transition:"background 0.12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"13px 16px", fontSize:13, color:"#94A3B8" }}>{i+1}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ background:ts.bg, color:ts.color, borderRadius:999, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{c.type}</span>
                  </td>
                  <td style={{ padding:"13px 16px", fontSize:13, fontFamily:"monospace", color:"#64748B" }}>{c.date ? new Date(c.date).toLocaleDateString("en-IN") : "—"}</td>
                  <td style={{ padding:"13px 16px", fontSize:14, fontWeight:700, color:"#0F172A", textAlign:"right" }}>₹{c.amount}</td>
                </tr>
              );
            })}
          </tbody>
          {charges.length > 0 && (
            <tfoot><tr style={{ background:"#F8FAFC", borderTop:"2px solid #E2E8F0" }}>
              <td colSpan={3} style={{ padding:"14px 16px", fontSize:13, fontWeight:700, color:"#64748B", textAlign:"right" }}>Total:</td>
              <td style={{ padding:"14px 16px", fontSize:16, fontWeight:800, color:"#0D9488", textAlign:"right" }}>₹{total}</td>
            </tr></tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default DailyCharges;
