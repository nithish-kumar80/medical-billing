import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Users, BedDouble, CalendarCheck, X, Loader2 } from "lucide-react";

const badge = (status) => {
  const map = {
    Scheduled:  { bg:"#DBEAFE", color:"#1D4ED8" },
    Completed:  { bg:"#D1FAE5", color:"#065F46" },
    Cancelled:  { bg:"#FEE2E2", color:"#991B1B" },
    "No-show":  { bg:"#FEF3C7", color:"#92400E" },
  };
  const s = map[status] || { bg:"#F1F5F9", color:"#475569" };
  return { display:"inline-flex", alignItems:"center", background:s.bg, color:s.color,
    padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" };
};

function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState({ opPatients:0, ipPatients:0, todayAppointments:0 });
  const [appointments, setAppointments] = useState([]);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => { fetchDashboard(); fetchAppointments(); }, []);

  const fetchDashboard = async () => {
    try { const res = await API.get("/dashboard"); setData({ opPatients:res.data.opPatients||0, ipPatients:res.data.ipPatients||0, todayAppointments:res.data.todayAppointments||0 }); }
    catch (err) { console.error(err); }
  };

  const fetchAppointments = async () => {
    try { const res = await API.get(`/appointments/doctor/${encodeURIComponent(user.name)}`); setAppointments(res.data); }
    catch (err) { console.error(err); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try { await API.patch(`/appointments/${id}/status`, { status: newStatus }); fetchAppointments(); }
    catch (err) { alert("Failed to update status"); }
  };

  const viewPatientHistory = async (patientName) => {
    setHistoryLoading(true);
    try { const res = await API.get(`/history/patient/${encodeURIComponent(patientName)}`); setSelectedPatientHistory(res.data); }
    catch (err) { alert("Failed to fetch patient history"); }
    finally { setHistoryLoading(false); }
  };

  const statCards = [
    { label:"Total OP Patients", value:data.opPatients, gradient:"linear-gradient(135deg,#3B82F6,#1D4ED8)", icon:<Users size={22} color="rgba(255,255,255,0.85)"/> },
    { label:"Total IP Patients", value:data.ipPatients, gradient:"linear-gradient(135deg,#8B5CF6,#6D28D9)", icon:<BedDouble size={22} color="rgba(255,255,255,0.85)"/> },
    { label:"Today's Appointments", value:data.todayAppointments, gradient:"linear-gradient(135deg,#10B981,#059669)", icon:<CalendarCheck size={22} color="rgba(255,255,255,0.85)"/> },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:"#0F172A", marginBottom:4 }}>Dr. {user?.name}'s Dashboard</h1>
        <p style={{ fontSize:13, color:"#64748B" }}>Manage your appointments and patient records</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:28 }}>
        {statCards.map((c,i) => (
          <div key={i} style={{ background:c.gradient, borderRadius:16, padding:"22px 24px", color:"white", display:"flex", justifyContent:"space-between", alignItems:"flex-start", boxShadow:"0 4px 16px rgba(0,0,0,0.12)" }}>
            <div>
              <div style={{ fontSize:12, fontWeight:500, opacity:0.8, marginBottom:8 }}>{c.label}</div>
              <div style={{ fontSize:36, fontWeight:800, lineHeight:1 }}>{c.value}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:10, padding:10 }}>{c.icon}</div>
          </div>
        ))}
      </div>

      {/* Appointments table */}
      <div style={{ background:"white", borderRadius:16, border:"1px solid #E2E8F0", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.04)", overflow:"hidden" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:"#0F172A" }}>My Appointments</h2>
          <div style={{ background:"#F1F5F9", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:600, color:"#64748B" }}>{appointments.length} total</div>
        </div>

        {appointments.length === 0 ? (
          <div style={{ padding:"56px 24px", textAlign:"center" }}>
            <CalendarCheck size={40} color="#CBD5E1" style={{ margin:"0 auto 12px" }} />
            <p style={{ color:"#94A3B8", fontSize:14, fontWeight:500 }}>No appointments scheduled</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#F8FAFC" }}>
                  {["Patient","Date & Time","Notes","Status","Actions"].map(h => (
                    <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:"#64748B", textAlign:"left", textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app._id} style={{ borderTop:"1px solid #F1F5F9", transition:"background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background="#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"14px 16px" }}>
                      <button onClick={() => viewPatientHistory(app.patient_id)} style={{ background:"none", border:"none", color:"#0D9488", fontSize:14, fontWeight:600, cursor:"pointer", textDecoration:"underline", textDecorationColor:"rgba(13,148,136,0.3)", padding:0 }}>
                        {app.patient_id}
                      </button>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#1E293B" }}>{app.date}</div>
                      <div style={{ fontSize:12, color:"#94A3B8", marginTop:2 }}>{app.time}</div>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"#64748B", fontStyle:"italic", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{app.notes || "—"}</td>
                    <td style={{ padding:"14px 16px" }}><span style={badge(app.status)}>{app.status}</span></td>
                    <td style={{ padding:"14px 16px" }}>
                      {app.status === "Scheduled" ? (
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => handleStatusChange(app._id,"Completed")} style={{ background:"#D1FAE5", color:"#065F46", border:"none", borderRadius:7, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>✓ Complete</button>
                          <button onClick={() => handleStatusChange(app._id,"No-show")} style={{ background:"#FEF3C7", color:"#92400E", border:"none", borderRadius:7, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>No-show</button>
                          <button onClick={() => handleStatusChange(app._id,"Cancelled")} style={{ background:"#FEE2E2", color:"#991B1B", border:"none", borderRadius:7, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Cancel</button>
                        </div>
                      ) : <span style={{ fontSize:12, color:"#CBD5E1" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {historyLoading && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:16, padding:"32px 40px", textAlign:"center", boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>
            <Loader2 size={36} color="#0D9488" style={{ animation:"spin 1s linear infinite", margin:"0 auto 12px" }} />
            <p style={{ fontWeight:600, color:"#0F172A", fontSize:14 }}>Loading Patient Records...</p>
          </div>
        </div>
      )}

      {/* History modal */}
      {selectedPatientHistory && !historyLoading && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:24, backdropFilter:"blur(4px)" }}
          onClick={() => setSelectedPatientHistory(null)}>
          <div style={{ background:"white", width:"100%", maxWidth:720, borderRadius:20, boxShadow:"0 24px 80px rgba(0,0,0,0.3)", maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column" }}
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ padding:"20px 24px", borderBottom:"1px solid #E2E8F0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"linear-gradient(135deg,#0D9488,#0891B2)" }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:"white" }}>Medical History</h2>
              <button onClick={() => setSelectedPatientHistory(null)} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:8, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <X size={18} color="white" />
              </button>
            </div>
            <div style={{ overflowY:"auto", padding:24 }}>
              {!selectedPatientHistory?.patient ? (
                <p style={{ textAlign:"center", color:"#94A3B8", padding:"40px 0" }}>No records found.</p>
              ) : (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, background:"#F8FAFC", borderRadius:12, padding:16, marginBottom:20, border:"1px solid #E2E8F0" }}>
                    {[["Patient ID", selectedPatientHistory.patient.patient_id], ["Name", selectedPatientHistory.patient.name], ["Age / Gender", `${selectedPatientHistory.patient.age} / ${selectedPatientHistory.patient.gender}`]].map(([l,v]) => (
                      <div key={l}><div style={{ fontSize:11, color:"#94A3B8", fontWeight:600, marginBottom:4, textTransform:"uppercase" }}>{l}</div><div style={{ fontSize:14, fontWeight:700, color:"#0F172A" }}>{v}</div></div>
                    ))}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {selectedPatientHistory.visits.map(visit => {
                      const vT = selectedPatientHistory.treatments.filter(t => t.visit_id === visit.visit_id);
                      const vD = selectedPatientHistory.diagnosis.filter(d => d.visit_id === visit.visit_id);
                      return (
                        <div key={visit.visit_id} style={{ border:"1px solid #E2E8F0", borderRadius:12, overflow:"hidden" }}>
                          <div style={{ background:"#F8FAFC", padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #E2E8F0" }}>
                            <span style={{ fontWeight:700, color:"#0D9488" }}>Dr. {visit.doctor}</span>
                            <span style={{ fontSize:12, color:"#94A3B8" }}>{new Date(visit.visit_date).toLocaleDateString()}</span>
                          </div>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
                            <div style={{ padding:16, borderRight:"1px solid #E2E8F0" }}>
                              <div style={{ fontSize:11, fontWeight:700, color:"#EF4444", marginBottom:8, textTransform:"uppercase" }}>Diagnosis</div>
                              {vD.length > 0 ? vD.map(d => <div key={d._id} style={{ fontSize:13, color:"#1E293B", marginBottom:4 }}>• {d.description}</div>) : <div style={{ fontSize:13, color:"#94A3B8" }}>None</div>}
                            </div>
                            <div style={{ padding:16 }}>
                              <div style={{ fontSize:11, fontWeight:700, color:"#3B82F6", marginBottom:8, textTransform:"uppercase" }}>Treatments</div>
                              {vT.length > 0 ? vT.map(t => <div key={t._id} style={{ fontSize:13, color:"#1E293B", marginBottom:4 }}>• {t.description}</div>) : <div style={{ fontSize:13, color:"#94A3B8" }}>None</div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;