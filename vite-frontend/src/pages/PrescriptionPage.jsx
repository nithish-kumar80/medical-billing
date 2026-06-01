import { useState, useEffect } from "react";
import API from "../services/api";
import { Pill, Plus, X, FileText } from "lucide-react";

const inp = { border:"1.5px solid #E2E8F0", borderRadius:8, padding:"9px 12px", fontSize:13, outline:"none", background:"#F8FAFC", fontFamily:"inherit", color:"#0F172A", width:"100%" };
const lbl = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em" };
const card = { background:"white", borderRadius:16, border:"1px solid #E2E8F0", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.04)", padding:24 };

function PrescriptionPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [patients, setPatients] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medications, setMedications] = useState([{ name:"", dosage:"", frequency:"", duration:"" }]);
  const [notes, setNotes] = useState("");

  useEffect(() => { fetchPatients(); fetchMyPrescriptions(); }, []);

  const fetchPatients = async () => { try { const r = await API.get("/patients"); setPatients(r.data); } catch(e){console.error(e);} };
  const fetchMyPrescriptions = async () => { try { const r = await API.get(`/prescriptions/doctor/${user._id}`); setMyPrescriptions(r.data); } catch(e){console.error(e);} };
  const addMedRow = () => setMedications([...medications, { name:"", dosage:"", frequency:"", duration:"" }]);
  const removeMedRow = (i) => setMedications(medications.filter((_,idx)=>idx!==i));
  const updateMed = (i, field, val) => { const m=[...medications]; m[i][field]=val; setMedications(m); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return alert("Please select a patient");
    try {
      await API.post("/prescriptions", { patient_id:selectedPatient.patient_id, patient_name:selectedPatient.name, doctor_name:user.name, doctor_user_id:user._id, medications:medications.filter(m=>m.name), notes });
      alert("Prescription created ✅");
      setMedications([{ name:"", dosage:"", frequency:"", duration:"" }]);
      setNotes(""); setSelectedPatient(null); fetchMyPrescriptions();
    } catch(e){ alert("Error creating prescription"); }
  };

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", marginBottom:4 }}>💊 Prescriptions</h1>
        <p style={{ fontSize:13, color:"#64748B" }}>Write and manage patient prescriptions</p>
      </div>

      {/* Create form */}
      <div style={{ ...card, marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#0D9488,#0891B2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FileText size={18} color="white" />
          </div>
          <div style={{ fontSize:15, fontWeight:700, color:"#0F172A" }}>New Prescription</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient selector */}
          <div style={{ marginBottom:20 }}>
            <label style={lbl}>Select Patient</label>
            <select value={selectedPatient?.patient_id||""} onChange={e=>setSelectedPatient(patients.find(p=>p.patient_id===e.target.value)||null)}
              style={inp} onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}>
              <option value="">— Choose Patient —</option>
              {patients.map(p=><option key={p.patient_id} value={p.patient_id}>{p.name} ({p.patient_id})</option>)}
            </select>
          </div>

          {/* Medications header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <label style={lbl}>Medications</label>
            <button type="button" onClick={addMedRow} style={{ display:"flex", alignItems:"center", gap:5, background:"#EFF6FF", color:"#1D4ED8", border:"none", borderRadius:7, padding:"5px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
              <Plus size={13}/> Add Row
            </button>
          </div>

          {/* Column headers */}
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 32px", gap:8, marginBottom:6 }}>
            {["Medicine Name","Dosage","Frequency","Duration",""].map(h=>(
              <div key={h} style={{ fontSize:11, fontWeight:600, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</div>
            ))}
          </div>

          {/* Med rows */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
            {medications.map((med,i)=>(
              <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 32px", gap:8, alignItems:"center" }}>
                <input placeholder="e.g. Paracetamol" value={med.name} onChange={e=>updateMed(i,"name",e.target.value)} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
                <input placeholder="500mg" value={med.dosage} onChange={e=>updateMed(i,"dosage",e.target.value)} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
                <input placeholder="3x/day" value={med.frequency} onChange={e=>updateMed(i,"frequency",e.target.value)} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
                <input placeholder="5 days" value={med.duration} onChange={e=>updateMed(i,"duration",e.target.value)} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
                {medications.length>1 ? (
                  <button type="button" onClick={()=>removeMedRow(i)} style={{ background:"#FEE2E2", border:"none", borderRadius:6, width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    <X size={13} color="#991B1B"/>
                  </button>
                ) : <div/>}
              </div>
            ))}
          </div>

          {/* Notes */}
          <div style={{ marginBottom:20 }}>
            <label style={lbl}>Notes <span style={{ color:"#94A3B8", fontWeight:400, textTransform:"none" }}>(optional)</span></label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="e.g. Take after meals, avoid dairy..."
              style={{...inp, resize:"vertical"}} onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
          </div>

          <button type="submit" style={{ background:"linear-gradient(135deg,#0D9488,#0891B2)", color:"white", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:700, cursor:"pointer", width:"100%", fontFamily:"inherit" }}>
            Create Prescription
          </button>
        </form>
      </div>

      {/* Recent prescriptions */}
      <div style={card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#0F172A" }}>Recent Prescriptions</div>
          <div style={{ background:"#F1F5F9", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:600, color:"#64748B" }}>{myPrescriptions.length} total</div>
        </div>
        {myPrescriptions.length===0 ? (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <Pill size={36} color="#CBD5E1" style={{ margin:"0 auto 10px" }}/>
            <p style={{ color:"#94A3B8", fontSize:13 }}>No prescriptions written yet.</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {myPrescriptions.map(rx=>(
              <div key={rx._id} style={{ border:"1px solid #E2E8F0", borderRadius:12, overflow:"hidden" }}>
                <div style={{ background:"#F8FAFC", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #E2E8F0" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:"#0F172A" }}>{rx.patient_name}</span>
                    <span style={{ background:"#EFF6FF", color:"#1D4ED8", borderRadius:999, padding:"2px 8px", fontSize:11, fontWeight:700 }}>{rx.patient_id}</span>
                  </div>
                  <span style={{ fontSize:12, color:"#94A3B8" }}>{new Date(rx.createdAt).toLocaleDateString()}</span>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr style={{ background:"white" }}>
                    {["Medicine","Dosage","Frequency","Duration"].map(h=>(
                      <th key={h} style={{ padding:"10px 14px", fontSize:11, fontWeight:700, color:"#64748B", textAlign:"left", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{rx.medications.map((m,i)=>(
                    <tr key={i} style={{ borderTop:"1px solid #F1F5F9" }}>
                      <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:"#0F172A" }}>{m.name}</td>
                      <td style={{ padding:"10px 14px", fontSize:13, color:"#374151" }}>{m.dosage}</td>
                      <td style={{ padding:"10px 14px", fontSize:13, color:"#374151" }}>{m.frequency}</td>
                      <td style={{ padding:"10px 14px", fontSize:13, color:"#374151" }}>{m.duration}</td>
                    </tr>
                  ))}</tbody>
                </table>
                {rx.notes && <div style={{ padding:"10px 16px", background:"#FFFBEB", borderTop:"1px solid #FEF3C7", fontSize:12, color:"#92400E" }}>📝 {rx.notes}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PrescriptionPage;
