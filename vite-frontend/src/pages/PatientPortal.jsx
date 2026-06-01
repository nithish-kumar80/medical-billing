import React, { useState, useEffect } from "react";
import API from "../services/api";
import { CalendarPlus, CalendarCheck, Pill, ClipboardList, Calendar, Clock, Stethoscope } from "lucide-react";

const statusBadge = (s) => {
  const m = { Scheduled:{bg:"#DBEAFE",color:"#1D4ED8"}, Completed:{bg:"#D1FAE5",color:"#065F46"}, Cancelled:{bg:"#FEE2E2",color:"#991B1B"}, "No-show":{bg:"#FEF3C7",color:"#92400E"} };
  const v = m[s] || {bg:"#F1F5F9",color:"#475569"};
  return { display:"inline-flex",alignItems:"center", background:v.bg, color:v.color, padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" };
};

const inp = { border:"1.5px solid #E2E8F0", borderRadius:10, padding:"10px 14px", fontSize:14, width:"100%", outline:"none", background:"#F8FAFC", fontFamily:"inherit", color:"#0F172A", transition:"border-color 0.15s" };
const lbl = { display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 };

function PatientPortal() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeTab, setActiveTab] = useState("book");
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [myHistory, setMyHistory] = useState(null);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [form, setForm] = useState({ patient_id:user?.name, patient_user_id:user?._id, doctor_name:"", doctor_user_id:"", date:"", time:"", notes:"" });

  useEffect(() => {
    if (activeTab === "book") fetchDoctors();
    if (activeTab === "appointments") fetchMyAppointments();
    if (activeTab === "history") fetchMyHistory();
    if (activeTab === "prescriptions") fetchMyPrescriptions();
  }, [activeTab]);

  const fetchMyPrescriptions = async () => { try { const r = await API.get(`/prescriptions/by-name/${encodeURIComponent(user.name)}`); setMyPrescriptions(r.data); } catch(e){console.error(e);} };
  const fetchDoctors = async () => { try { const r = await API.get("/doctors"); setDoctors(r.data); if(r.data.length>0) setForm(f=>({...f,doctor_name:r.data[0].name,doctor_user_id:r.data[0]._id})); } catch(e){console.error(e);} };
  const fetchMyAppointments = async () => { try { const r = await API.get(`/appointments/patient/${encodeURIComponent(user.name)}`); setMyAppointments(r.data); } catch(e){console.error(e);} };
  const fetchMyHistory = async () => { try { const r = await API.get(`/history/patient/${encodeURIComponent(user.name)}`); setMyHistory(r.data); } catch(e){console.error(e);} };
  const handleDoctorChange = (e) => { const d = doctors.find(d=>d._id===e.target.value); if(d) setForm({...form,doctor_name:d.name,doctor_user_id:d._id}); };
  const handleBook = async (e) => {
    e.preventDefault();
    try { await API.post("/appointments",form); alert("Appointment booked!"); setForm({...form,date:"",time:"",notes:""}); setActiveTab("appointments"); }
    catch(e){ console.error(e); alert("Error booking appointment"); }
  };

  const tabs = [
    { key:"book", label:"Book Visit", icon:<CalendarPlus size={15}/> },
    { key:"appointments", label:"My Appointments", icon:<CalendarCheck size={15}/> },
    { key:"prescriptions", label:"Prescriptions", icon:<Pill size={15}/> },
    { key:"history", label:"Medical History", icon:<ClipboardList size={15}/> },
  ];

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", marginBottom:4 }}>Patient Portal</h1>
        <p style={{ fontSize:13, color:"#64748B" }}>Welcome back, <strong style={{color:"#0D9488"}}>{user?.name}</strong></p>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:4, background:"white", border:"1px solid #E2E8F0", borderRadius:12, padding:4, marginBottom:24, width:"fit-content", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer",
            fontSize:13, fontWeight: activeTab===t.key ? 700 : 500,
            background: activeTab===t.key ? "linear-gradient(135deg,#0D9488,#0891B2)" : "transparent",
            color: activeTab===t.key ? "white" : "#64748B",
            transition:"all 0.15s", fontFamily:"inherit"
          }}>{t.icon}{t.label}</button>
        ))}
      </div>

      {/* BOOK TAB */}
      {activeTab === "book" && (
        <div style={{ background:"white", borderRadius:16, border:"1px solid #E2E8F0", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.04)", padding:32, maxWidth:520 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#0D9488,#0891B2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <CalendarPlus size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:"#0F172A" }}>Schedule Appointment</div>
              <div style={{ fontSize:12, color:"#94A3B8" }}>Book a visit with your doctor</div>
            </div>
          </div>
          <form onSubmit={handleBook} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div>
              <label style={lbl}>Select Doctor</label>
              <select value={form.doctor_user_id} onChange={handleDoctorChange} style={{...inp}}
                onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}>
                {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
              </select>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <label style={lbl}>Date</label>
                <input type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
              </div>
              <div>
                <label style={lbl}>Time</label>
                <input type="time" required value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={inp}
                  onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
              </div>
            </div>
            <div>
              <label style={lbl}>Reason for Visit <span style={{color:"#94A3B8",fontWeight:400}}>(optional)</span></label>
              <textarea rows={3} value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Describe your symptoms..." style={{...inp, resize:"vertical"}}
                onFocus={e=>e.target.style.borderColor="#0D9488"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
            </div>
            <button type="submit" style={{ background:"linear-gradient(135deg,#0D9488,#0891B2)", color:"white", border:"none", borderRadius:10, padding:"13px", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"inherit" }}>
              <CalendarPlus size={16} /> Confirm Booking
            </button>
          </form>
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === "appointments" && (
        <div>
          {myAppointments.length === 0 ? (
            <div style={{ background:"white", borderRadius:16, border:"1px solid #E2E8F0", padding:"56px 24px", textAlign:"center" }}>
              <CalendarCheck size={40} color="#CBD5E1" style={{ margin:"0 auto 12px" }} />
              <p style={{ color:"#94A3B8", fontSize:14 }}>You have no scheduled appointments.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
              {myAppointments.map(app => (
                <div key={app._id} style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:20, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#0F172A" }}>Dr. {app.doctor_name}</div>
                    <span style={statusBadge(app.status)}>{app.status}</span>
                  </div>
                  <div style={{ display:"flex", gap:16, fontSize:13, color:"#64748B" }}>
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}><Calendar size={13}/> {app.date}</span>
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={13}/> {app.time}</span>
                  </div>
                  {app.notes && <div style={{ marginTop:10, background:"#F8FAFC", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#64748B", fontStyle:"italic" }}>"{app.notes}"</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRESCRIPTIONS TAB */}
      {activeTab === "prescriptions" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {myPrescriptions.length === 0 ? (
            <div style={{ background:"white", borderRadius:16, border:"1px solid #E2E8F0", padding:"56px 24px", textAlign:"center" }}>
              <Pill size={40} color="#CBD5E1" style={{ margin:"0 auto 12px" }} />
              <p style={{ color:"#94A3B8", fontSize:14 }}>No prescriptions yet.</p>
            </div>
          ) : myPrescriptions.map(rx => (
            <div key={rx._id} style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ padding:"14px 20px", background:"linear-gradient(135deg,#0D9488,#0891B2)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ color:"white", fontWeight:700, fontSize:15 }}>Dr. {rx.doctor_name}</div>
                <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>{new Date(rx.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr style={{ background:"#F8FAFC" }}>
                    {["Medicine","Dosage","Frequency","Duration"].map(h=><th key={h} style={{ padding:"10px 16px", fontSize:11, fontWeight:700, color:"#64748B", textAlign:"left", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>)}
                  </tr></thead>
                  <tbody>{rx.medications.map((m,i)=>(
                    <tr key={i} style={{ borderTop:"1px solid #F1F5F9" }}>
                      <td style={{ padding:"12px 16px", fontSize:14, fontWeight:600, color:"#0F172A" }}>{m.name}</td>
                      <td style={{ padding:"12px 16px", fontSize:13, color:"#374151" }}>{m.dosage}</td>
                      <td style={{ padding:"12px 16px", fontSize:13, color:"#374151" }}>{m.frequency}</td>
                      <td style={{ padding:"12px 16px", fontSize:13, color:"#374151" }}>{m.duration}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              {rx.notes && <div style={{ padding:"12px 20px", background:"#FFFBEB", borderTop:"1px solid #FEF3C7", fontSize:13, color:"#92400E" }}>📝 {rx.notes}</div>}
            </div>
          ))}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "history" && (
        <div style={{ background:"white", borderRadius:16, border:"1px solid #E2E8F0", padding:24, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
          {!myHistory?.patient ? (
            <div style={{ textAlign:"center", padding:"56px 0" }}>
              <ClipboardList size={40} color="#CBD5E1" style={{ margin:"0 auto 12px" }} />
              <p style={{ color:"#94A3B8", fontSize:14 }}>No medical records found.</p>
              <p style={{ color:"#CBD5E1", fontSize:12, marginTop:4 }}>Records appear here after your first completed visit.</p>
            </div>
          ) : (
            <>
              <div style={{ display:"flex", gap:24, marginBottom:24, paddingBottom:20, borderBottom:"1px solid #E2E8F0" }}>
                {[["Patient ID",myHistory.patient.patient_id],["Age",myHistory.patient.age],["Gender",myHistory.patient.gender]].map(([l,v])=>(
                  <div key={l}><div style={{ fontSize:11, color:"#94A3B8", fontWeight:600, marginBottom:4, textTransform:"uppercase" }}>{l}</div><div style={{ fontSize:15, fontWeight:700, color:"#0F172A" }}>{v}</div></div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {myHistory.visits.map(visit => {
                  const vT = myHistory.treatments.filter(t=>t.visit_id===visit.visit_id);
                  const vD = myHistory.diagnosis.filter(d=>d.visit_id===visit.visit_id);
                  return (
                    <div key={visit.visit_id} style={{ border:"1px solid #E2E8F0", borderRadius:12, overflow:"hidden" }}>
                      <div style={{ background:"#F8FAFC", padding:"12px 16px", display:"flex", justifyContent:"space-between", borderBottom:"1px solid #E2E8F0" }}>
                        <span style={{ fontWeight:700, color:"#0D9488" }}>Dr. {visit.doctor}</span>
                        <span style={{ fontSize:12, color:"#94A3B8" }}>{new Date(visit.visit_date).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
                        <div style={{ padding:16, borderRight:"1px solid #E2E8F0" }}>
                          <div style={{ fontSize:11, fontWeight:700, color:"#EF4444", marginBottom:8, textTransform:"uppercase" }}>Diagnosis</div>
                          {vD.length>0 ? vD.map(d=><div key={d._id} style={{ fontSize:13, marginBottom:4 }}>• {d.description}</div>) : <div style={{ fontSize:13, color:"#94A3B8" }}>None</div>}
                        </div>
                        <div style={{ padding:16 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:"#3B82F6", marginBottom:8, textTransform:"uppercase" }}>Treatments</div>
                          {vT.length>0 ? vT.map(t=><div key={t._id} style={{ fontSize:13, marginBottom:4 }}>• {t.description}</div>) : <div style={{ fontSize:13, color:"#94A3B8" }}>None</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PatientPortal;
