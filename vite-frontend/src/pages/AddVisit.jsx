import { useState, useEffect } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import CodeAutocomplete from "../components/CodeAutocomplete";

const inp = { border:"1.5px solid #E2E8F0", borderRadius:9, padding:"10px 14px", fontSize:14, outline:"none", background:"#F8FAFC", fontFamily:"inherit", color:"#0F172A", width:"100%", transition:"border-color 0.15s" };
const lbl = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" };

function AddVisit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patient_id:"", diagnosis_code:"", diagnosis_desc:"",
    treatment_code:"", treatment_desc:"", cost:"",
    admitAsIP:false, ward:"General", roomNumber:"", bedNumber:"", attendingDoctor:""
  });

  useEffect(() => { if (id) setForm(prev => ({ ...prev, patient_id: id })); }, [id]);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const visitRes = await API.post("/visits", { patient_id: form.patient_id });
      const visit_id = visitRes.data.visitId;
      await API.post("/diagnosis", { visit_id, code: form.diagnosis_code, description: form.diagnosis_desc });
      await API.post("/treatments", { visit_id, code: form.treatment_code, description: form.treatment_desc, cost: Number(form.cost) });
      if (form.admitAsIP) {
        await API.put(`/visits/${visit_id}/admit`, { ward:form.ward, roomNumber:form.roomNumber, bedNumber:form.bedNumber, attendingDoctor:form.attendingDoctor, admissionDate:new Date().toISOString() });
      }
      alert(`Visit created ✅${form.admitAsIP ? " (Patient Admitted as IP)" : ""}`);
      setForm({ ...form, diagnosis_code:"", diagnosis_desc:"", treatment_code:"", treatment_desc:"", cost:"", admitAsIP:false, ward:"General", roomNumber:"", bedNumber:"", attendingDoctor:"" });
    } catch (err) { console.error(err); alert("Error adding visit ❌"); }
  };

  const wardConfig = {
    ICU:     { emoji:"🚨", active:"linear-gradient(135deg,#EF4444,#DC2626)", border:"#EF4444", color:"white" },
    General: { emoji:"🛏️", active:"linear-gradient(135deg,#3B82F6,#1D4ED8)", border:"#3B82F6", color:"white" },
    Private: { emoji:"✨", active:"linear-gradient(135deg,#10B981,#059669)", border:"#10B981", color:"white" },
  };

  const section = { marginBottom:20 };
  const sectionTitle = { fontSize:13, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12, paddingBottom:8, borderBottom:"1px solid #F1F5F9" };

  return (
    <div style={{ display:"flex", justifyContent:"center" }}>
      <form onSubmit={handleSubmit} style={{ background:"white", borderRadius:20, border:"1px solid #E2E8F0", boxShadow:"0 4px 32px rgba(0,0,0,0.08)", padding:32, width:"100%", maxWidth:560 }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:"linear-gradient(135deg,#0D9488,#0891B2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
            <span style={{ fontSize:22 }}>🏥</span>
          </div>
          <h2 style={{ fontSize:20, fontWeight:800, color:"#0F172A", margin:0 }}>Add Patient Visit</h2>
          {id && <p style={{ fontSize:13, color:"#94A3B8", marginTop:4 }}>Patient ID: <span style={{ fontFamily:"monospace", fontWeight:700, color:"#0D9488" }}>{id}</span></p>}
        </div>

        {/* Patient ID (readonly) */}
        <div style={section}>
          <label style={lbl}>Patient ID</label>
          <input name="patient_id" value={form.patient_id} readOnly style={{...inp, background:"#F1F5F9", color:"#64748B", cursor:"not-allowed"}} />
        </div>

        {/* Diagnosis */}
        <div style={section}>
          <div style={sectionTitle}>Diagnosis (ICD)</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div>
              <label style={lbl}>ICD Code</label>
              <CodeAutocomplete
                type="icd"
                value={form.diagnosis_code}
                placeholder="Search ICD-10 code or description…"
                onSelect={r => setForm(f => ({ ...f, diagnosis_code: r.code, diagnosis_desc: r.description }))}
              />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <input name="diagnosis_desc" placeholder="Diagnosis description" value={form.diagnosis_desc} onChange={handleChange} style={inp}
                onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
            </div>
          </div>
        </div>

        {/* Treatment */}
        <div style={section}>
          <div style={sectionTitle}>Treatment (CPT)</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div>
              <label style={lbl}>CPT / HCPCS Code</label>
              <CodeAutocomplete
                type="cpt"
                value={form.treatment_code}
                placeholder="Search CPT/HCPCS code or description…"
                onSelect={r => setForm(f => ({ ...f, treatment_code: r.code, treatment_desc: r.description }))}
              />
            </div>
            <div>
              <label style={lbl}>Description</label>
              <input name="treatment_desc" placeholder="Treatment description" value={form.treatment_desc} onChange={handleChange} style={inp}
                onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
            </div>
            <div>
              <label style={lbl}>Cost (₹)</label>
              <input name="cost" type="number" placeholder="e.g. 1500" value={form.cost} onChange={handleChange} style={inp}
                onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
            </div>
          </div>
        </div>

        {/* IP Toggle */}
        <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:20, marginBottom:20 }}>
          <label style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <div onClick={() => setForm({...form, admitAsIP: !form.admitAsIP})} style={{
              width:44, height:24, borderRadius:12, background: form.admitAsIP ? "#0D9488" : "#CBD5E1",
              position:"relative", transition:"background 0.2s", cursor:"pointer", flexShrink:0
            }}>
              <div style={{ position:"absolute", top:2, left: form.admitAsIP ? 22 : 2, width:20, height:20, borderRadius:"50%", background:"white", transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#0F172A" }}>🏥 Admit as In-Patient (IP)</div>
              <div style={{ fontSize:12, color:"#94A3B8" }}>Enable if patient requires hospitalisation</div>
            </div>
          </label>
        </div>

        {/* IP Fields */}
        {form.admitAsIP && (
          <div style={{ background:"#F8FAFC", borderRadius:12, border:"1px solid #E2E8F0", padding:18, marginBottom:20 }}>
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>Ward Type</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {["ICU","General","Private"].map(w => {
                  const c = wardConfig[w];
                  const active = form.ward === w;
                  return (
                    <button key={w} type="button" onClick={() => setForm({...form, ward:w})} style={{
                      padding:"12px 6px", borderRadius:10, border: active ? "2px solid transparent" : "2px solid #E2E8F0",
                      background: active ? c.active : "white", color: active ? c.color : "#94A3B8",
                      fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.15s", fontFamily:"inherit",
                      boxShadow: active ? "0 4px 12px rgba(0,0,0,0.15)" : "none"
                    }}>
                      <div style={{ fontSize:18, marginBottom:4 }}>{c.emoji}</div>
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
              <div>
                <label style={lbl}>Room No.</label>
                <input name="roomNumber" placeholder="e.g. 201" value={form.roomNumber} onChange={handleChange} required={form.admitAsIP} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
              </div>
              <div>
                <label style={lbl}>Bed No.</label>
                <input name="bedNumber" placeholder="e.g. B3" value={form.bedNumber} onChange={handleChange} required={form.admitAsIP} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
              </div>
            </div>
            <div>
              <label style={lbl}>Attending Doctor</label>
              <input name="attendingDoctor" placeholder="Dr. Name" value={form.attendingDoctor} onChange={handleChange} required={form.admitAsIP} style={inp}
                onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
            </div>
          </div>
        )}

        <button type="submit" style={{ width:"100%", background:"linear-gradient(135deg,#0D9488,#0891B2)", color:"white", border:"none", borderRadius:11, padding:"14px", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          {form.admitAsIP ? "Create Visit & Admit Patient 🏥" : "Create Visit ✅"}
        </button>
      </form>
    </div>
  );
}

export default AddVisit;