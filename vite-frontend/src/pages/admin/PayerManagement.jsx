import { useState, useEffect } from "react";
import API from "../../services/api";
import { Building2, Plus, Pencil, X, Check, Phone, MapPin, Clock } from "lucide-react";

const inp = { border:"1.5px solid #E2E8F0", borderRadius:9, padding:"10px 14px", fontSize:14, outline:"none", background:"#F8FAFC", fontFamily:"inherit", color:"#0F172A", width:"100%", transition:"border-color 0.15s", boxSizing:"border-box" };
const lbl = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" };

const EMPTY = { payerName:"", payerType:"commercial", electronicPayerId:"", phone:"", timelyFilingLimitDays:90, claimsAddress:{ line1:"", city:"", state:"", zip:"" } };

const payerTypeColors = { commercial:"#3B82F6", medicare:"#10B981", medicaid:"#8B5CF6", self_pay:"#F59E0B", other:"#64748B" };

function PayerManagement() {
  const [payers, setPayers] = useState([]);
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPayers(); }, []);
  const fetchPayers = async () => { try { const r = await API.get("/payers"); setPayers(r.data); } catch(e){ console.error(e); } };

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit   = (p) => { setForm({ ...p, claimsAddress: p.claimsAddress || { line1:"", city:"", state:"", zip:"" } }); setEditId(p._id); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditId(null); };

  const setAddr = (k, v) => setForm(f => ({ ...f, claimsAddress: { ...f.claimsAddress, [k]: v } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) await API.patch(`/payers/${editId}`, form);
      else        await API.post("/payers", form);
      fetchPayers();
      closeForm();
    } catch(err) { alert("Error saving payer"); }
    finally { setSaving(false); }
  };

  const card = { background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"18px 20px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", margin:0 }}>Payer Management</h1>
          <p style={{ fontSize:13, color:"#64748B", margin:"4px 0 0" }}>Insurance companies and payer entities</p>
        </div>
        <button onClick={openCreate} style={{ background:"linear-gradient(135deg,#0D9488,#0891B2)", color:"white", border:"none", borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
          <Plus size={15}/> Add Payer
        </button>
      </div>

      {/* Payers list */}
      {payers.length === 0 ? (
        <div style={{ ...card, textAlign:"center", padding:"48px 24px", color:"#94A3B8" }}>
          <Building2 size={40} style={{ marginBottom:12, opacity:0.4 }} />
          <p style={{ fontSize:15, margin:0 }}>No payers added yet.</p>
          <p style={{ fontSize:13, marginTop:4 }}>Click "Add Payer" to create the first one.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {payers.map(p => {
            const tc = payerTypeColors[p.payerType] || "#64748B";
            return (
              <div key={p._id} style={{ ...card, display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${tc}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Building2 size={20} color={tc}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#0F172A" }}>{p.payerName}</div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:4 }}>
                    <span style={{ background:`${tc}18`, color:tc, borderRadius:999, padding:"2px 8px", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{p.payerType}</span>
                    {p.electronicPayerId && <span style={{ fontSize:12, color:"#64748B" }}>ID: {p.electronicPayerId}</span>}
                    {p.phone && <span style={{ fontSize:12, color:"#64748B", display:"flex", alignItems:"center", gap:3 }}><Phone size={11}/>{p.phone}</span>}
                    {p.claimsAddress?.city && <span style={{ fontSize:12, color:"#64748B", display:"flex", alignItems:"center", gap:3 }}><MapPin size={11}/>{p.claimsAddress.city}, {p.claimsAddress.state}</span>}
                    <span style={{ fontSize:12, color:"#64748B", display:"flex", alignItems:"center", gap:3 }}><Clock size={11}/>{p.timelyFilingLimitDays}d filing limit</span>
                  </div>
                </div>
                <button onClick={() => openEdit(p)} style={{ background:"#F1F5F9", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", color:"#475569", display:"flex", alignItems:"center", gap:5 }}>
                  <Pencil size={13}/> Edit
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
          <div style={{ background:"white", borderRadius:20, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ padding:"24px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:"#0F172A", margin:0 }}>{editId ? "Edit Payer" : "Add Payer"}</h2>
              <button onClick={closeForm} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding:"20px 28px 28px", display:"flex", flexDirection:"column", gap:14 }}>
              <div><label style={lbl}>Payer Name *</label><input required value={form.payerName} onChange={e=>setForm(f=>({...f,payerName:e.target.value}))} style={inp} placeholder="e.g. Star Health Insurance" onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/></div>
              <div><label style={lbl}>Payer Type</label>
                <select value={form.payerType} onChange={e=>setForm(f=>({...f,payerType:e.target.value}))} style={inp}>
                  {["commercial","medicare","medicaid","self_pay","other"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Electronic Payer ID</label><input value={form.electronicPayerId||""} onChange={e=>setForm(f=>({...f,electronicPayerId:e.target.value}))} style={inp} placeholder="Clearinghouse payer ID" onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/></div>
              <div><label style={lbl}>Phone</label><input value={form.phone||""} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} style={inp} placeholder="+91 00000 00000" onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/></div>
              <div><label style={lbl}>Timely Filing Limit (days)</label><input type="number" value={form.timelyFilingLimitDays} onChange={e=>setForm(f=>({...f,timelyFilingLimitDays:Number(e.target.value)}))} style={inp} onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/></div>
              <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:12 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Claims Address</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <input value={form.claimsAddress?.line1||""} onChange={e=>setAddr("line1",e.target.value)} style={inp} placeholder="Street address" onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <input value={form.claimsAddress?.city||""} onChange={e=>setAddr("city",e.target.value)} style={inp} placeholder="City" onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                    <input value={form.claimsAddress?.state||""} onChange={e=>setAddr("state",e.target.value)} style={inp} placeholder="State" onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                    <input value={form.claimsAddress?.zip||""} onChange={e=>setAddr("zip",e.target.value)} style={inp} placeholder="ZIP" onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={saving} style={{ background:"linear-gradient(135deg,#0D9488,#0891B2)", color:"white", border:"none", borderRadius:10, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:4 }}>
                <Check size={16}/> {saving ? "Saving…" : editId ? "Update Payer" : "Create Payer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayerManagement;
