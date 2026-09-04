import { useState, useEffect } from "react";
import API from "../../services/api";
import { Hospital, Plus, Pencil, X, Check, Phone, MapPin, Hash } from "lucide-react";

const inp = { border:"1.5px solid #E2E8F0", borderRadius:9, padding:"10px 14px", fontSize:14, outline:"none", background:"#F8FAFC", fontFamily:"inherit", color:"#0F172A", width:"100%", transition:"border-color 0.15s", boxSizing:"border-box" };
const lbl = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" };

const EMPTY = { name:"", npi:"", taxId:"", phone:"", address:{ line1:"", city:"", state:"", zip:"" } };

function PracticeManagement() {
  const [practices, setPractices] = useState([]);
  const [form, setForm]           = useState(EMPTY);
  const [editId, setEditId]       = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);

  useEffect(() => { fetchPractices(); }, []);
  const fetchPractices = async () => { try { const r = await API.get("/practices"); setPractices(r.data); } catch(e){ console.error(e); } };

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit   = (p) => { setForm({ ...p, address: p.address || { line1:"", city:"", state:"", zip:"" } }); setEditId(p._id); setShowForm(true); };
  const closeForm  = () => { setShowForm(false); setEditId(null); };
  const setAddr    = (k, v) => setForm(f => ({ ...f, address: { ...f.address, [k]: v } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) await API.patch(`/practices/${editId}`, form);
      else        await API.post("/practices", form);
      fetchPractices();
      closeForm();
    } catch(err) { alert("Error saving practice"); }
    finally { setSaving(false); }
  };

  const card = { background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"18px 20px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", margin:0 }}>Practice Management</h1>
          <p style={{ fontSize:13, color:"#64748B", margin:"4px 0 0" }}>Billing providers and hospital entities</p>
        </div>
        <button onClick={openCreate} style={{ background:"linear-gradient(135deg,#8B5CF6,#6D28D9)", color:"white", border:"none", borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"inherit" }}>
          <Plus size={15}/> Add Practice
        </button>
      </div>

      {practices.length === 0 ? (
        <div style={{ ...card, textAlign:"center", padding:"48px 24px", color:"#94A3B8" }}>
          <Hospital size={40} style={{ marginBottom:12, opacity:0.4 }}/>
          <p style={{ fontSize:15, margin:0 }}>No practices added yet.</p>
          <p style={{ fontSize:13, marginTop:4 }}>Click "Add Practice" to register the first provider.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {practices.map(p => (
            <div key={p._id} style={{ ...card, display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"#F5F3FF", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Hospital size={20} color="#8B5CF6"/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:15, fontWeight:700, color:"#0F172A" }}>{p.name}</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:4 }}>
                  {p.npi && <span style={{ fontSize:12, color:"#64748B", display:"flex", alignItems:"center", gap:3 }}><Hash size={11}/>NPI: {p.npi}</span>}
                  {p.taxId && <span style={{ fontSize:12, color:"#64748B" }}>Tax ID: {p.taxId}</span>}
                  {p.phone && <span style={{ fontSize:12, color:"#64748B", display:"flex", alignItems:"center", gap:3 }}><Phone size={11}/>{p.phone}</span>}
                  {p.address?.city && <span style={{ fontSize:12, color:"#64748B", display:"flex", alignItems:"center", gap:3 }}><MapPin size={11}/>{p.address.city}, {p.address.state}</span>}
                </div>
              </div>
              <button onClick={() => openEdit(p)} style={{ background:"#F1F5F9", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", color:"#475569", display:"flex", alignItems:"center", gap:5 }}>
                <Pencil size={13}/> Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
          <div style={{ background:"white", borderRadius:20, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ padding:"24px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:"#0F172A", margin:0 }}>{editId ? "Edit Practice" : "Add Practice"}</h2>
              <button onClick={closeForm} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding:"20px 28px 28px", display:"flex", flexDirection:"column", gap:14 }}>
              <div><label style={lbl}>Practice Name *</label><input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp} placeholder="e.g. City Hospital" onFocus={e=>e.target.style.borderColor="#8B5CF6"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div><label style={lbl}>NPI (10 digits)</label><input value={form.npi||""} onChange={e=>setForm(f=>({...f,npi:e.target.value}))} style={inp} placeholder="1234567890" maxLength={10} onFocus={e=>e.target.style.borderColor="#8B5CF6"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/></div>
                <div><label style={lbl}>Tax ID</label><input value={form.taxId||""} onChange={e=>setForm(f=>({...f,taxId:e.target.value}))} style={inp} placeholder="EIN / PAN" onFocus={e=>e.target.style.borderColor="#8B5CF6"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/></div>
              </div>
              <div><label style={lbl}>Phone</label><input value={form.phone||""} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} style={inp} placeholder="+91 00000 00000" onFocus={e=>e.target.style.borderColor="#8B5CF6"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/></div>
              <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:12 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Address</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <input value={form.address?.line1||""} onChange={e=>setAddr("line1",e.target.value)} style={inp} placeholder="Street address" onFocus={e=>e.target.style.borderColor="#8B5CF6"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <input value={form.address?.city||""} onChange={e=>setAddr("city",e.target.value)} style={inp} placeholder="City" onFocus={e=>e.target.style.borderColor="#8B5CF6"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                    <input value={form.address?.state||""} onChange={e=>setAddr("state",e.target.value)} style={inp} placeholder="State" onFocus={e=>e.target.style.borderColor="#8B5CF6"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                    <input value={form.address?.zip||""} onChange={e=>setAddr("zip",e.target.value)} style={inp} placeholder="ZIP" onFocus={e=>e.target.style.borderColor="#8B5CF6"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={saving} style={{ background:"linear-gradient(135deg,#8B5CF6,#6D28D9)", color:"white", border:"none", borderRadius:10, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:4 }}>
                <Check size={16}/> {saving ? "Saving…" : editId ? "Update Practice" : "Create Practice"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticeManagement;
