import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import { Shield, ShieldCheck, ShieldOff, Plus, X } from "lucide-react";

const planColors = { HMO:"#3B82F6", PPO:"#10B981", EPO:"#8B5CF6", POS:"#F59E0B", Medicare:"#0D9488", Medicaid:"#6366F1", SelfPay:"#64748B", Other:"#94A3B8" };
const POLICY_EMPTY = { policyNumber:"", groupNumber:"", planType:"Other", policyRank:"primary", payer:"", subscriber:{ memberId:"", firstName:"", lastName:"", isPatient:true, relationshipToPatient:"self" }, coverage:{ effectiveDate:"", terminationDate:"", copayCents:0, coinsurancePercent:0, deductibleCents:0 } };

function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [diagnosis, setDiagnosis] = useState({});
  const [treatments, setTreatments] = useState({});
  const [activeTab, setActiveTab] = useState("visits"); // "visits" | "insurance"
  const [policies, setPolicies] = useState([]);
  const [payers, setPayers] = useState([]);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [policyForm, setPolicyForm] = useState(POLICY_EMPTY);
  const [savingPolicy, setSavingPolicy] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/patient-history/${id}`);
      setData(res.data);
      // Fetch insurance policies using patient _id
      try {
        const polRes = await API.get(`/patients/${res.data.patient._id}/insurance-policies`);
        setPolicies(polRes.data);
      } catch(e) { /* policies optional */ }
      // Load payers for the add-policy form
      try { const pr = await API.get("/payers"); setPayers(pr.data); } catch(e){}
      const diagMap = {}, treatMap = {};
      for (let v of res.data.visits) {
        const d = await API.get(`/diagnosis/${v.visit_id}`);
        const t = await API.get(`/treatments/${v.visit_id}`);
        diagMap[v.visit_id] = d.data;
        treatMap[v.visit_id] = t.data;
      }
      setDiagnosis(diagMap);
      setTreatments(treatMap);
    } catch (err) { console.error("Error fetching history:", err); }
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    setSavingPolicy(true);
    try {
      await API.post(`/patients/${data.patient._id}/insurance-policies`, policyForm);
      const polRes = await API.get(`/patients/${data.patient._id}/insurance-policies`);
      setPolicies(polRes.data);
      setShowPolicyForm(false);
      setPolicyForm(POLICY_EMPTY);
    } catch(err) { alert("Error adding policy"); }
    finally { setSavingPolicy(false); }
  };

  if (!data) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', background:'#F8FAFC' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, border:'3px solid #0D9488', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }} />
        <p style={{ color:'#64748B', fontSize:14 }}>Loading patient history…</p>
      </div>
    </div>
  );

  const wardBadgeStyle = (ward) => {
    if (ward === "ICU") return { background:'#FEE2E2', color:'#B91C1C', border:'1px solid #FECACA' };
    if (ward === "Private") return { background:'#DCFCE7', color:'#15803D', border:'1px solid #BBF7D0' };
    return { background:'#DBEAFE', color:'#1D4ED8', border:'1px solid #BFDBFE' };
  };

  const cardStyle = {
    background:'white',
    borderRadius:16,
    boxShadow:'0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)',
    border:'1px solid #E2E8F0',
    marginBottom:20,
    overflow:'hidden',
  };

  const btnBase = {
    border:'none', borderRadius:10, padding:'9px 18px', fontWeight:600,
    cursor:'pointer', fontSize:13, color:'white', transition:'opacity 0.2s',
  };

  return (
    <div style={{ background:'#F8FAFC', minHeight:'100vh', padding:'32px 24px' }}>
      <div style={{ maxWidth:860, margin:'0 auto' }}>

        {/* Page Header */}
        <div style={{ marginBottom:28 }}>
          <h2 style={{ fontSize:26, fontWeight:800, color:'#0F172A', margin:0, letterSpacing:'-0.5px' }}>Patient History</h2>
          <p style={{ fontSize:14, color:'#64748B', marginTop:4 }}>Complete visit records and billing overview</p>
        </div>

        {/* Patient Info Card */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={cardStyle}>
          <div style={{ background:'linear-gradient(135deg,#0D9488,#0891B2)', padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <p style={{ fontSize:20, fontWeight:800, color:'white', margin:0 }}>{data.patient.name}</p>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.8)', marginTop:4 }}>
                ID: {data.patient.patient_id} &nbsp;·&nbsp; Age: {data.patient.age} &nbsp;·&nbsp; {data.patient.gender}
              </p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:2 }}>Lifetime Billing</p>
              <p style={{ fontSize:26, fontWeight:800, color:'white', margin:0 }}>₹{data.totalBill}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Tab switcher ── */}
        <div style={{ display:"flex", gap:4, marginBottom:20, background:"white", borderRadius:12, padding:4, border:"1px solid #E2E8F0", width:"fit-content" }}>
          {[{id:"visits",label:"Visit History"},{id:"insurance",label:"Insurance"}].map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
              padding:"8px 18px", borderRadius:9, border:"none", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
              background: activeTab===tab.id ? "linear-gradient(135deg,#0D9488,#0891B2)" : "transparent",
              color: activeTab===tab.id ? "white" : "#64748B"
            }}>{tab.label}</button>
          ))}
        </div>

        {/* ── Insurance Tab Panel ── */}
        {activeTab === "insurance" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#0F172A" }}>Insurance Policies</div>
              <button onClick={()=>setShowPolicyForm(true)} style={{ background:"linear-gradient(135deg,#0D9488,#0891B2)", color:"white", border:"none", borderRadius:9, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontFamily:"inherit" }}>
                <Plus size={13}/> Add Policy
              </button>
            </div>

            {policies.length === 0 ? (
              <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"40px 24px", textAlign:"center", color:"#94A3B8" }}>
                <Shield size={36} style={{ marginBottom:10, opacity:0.4 }}/>
                <p style={{ fontSize:14, margin:0 }}>No insurance on file</p>
                <p style={{ fontSize:12, marginTop:4 }}>Click "Add Policy" to link a policy to this patient.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {policies.map(pol => {
                  const rank = pol.policyRank;
                  const pc = planColors[pol.planType] || "#64748B";
                  const elStatus = pol.eligibility?.status || "not_checked";
                  const elIcon = elStatus==="active" ? <ShieldCheck size={14} color="#15803D"/> : elStatus==="inactive" ? <ShieldOff size={14} color="#B91C1C"/> : <Shield size={14} color="#94A3B8"/>;
                  return (
                    <div key={pol._id} style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"16px 20px", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                        <div>
                          <div style={{ fontSize:15, fontWeight:700, color:"#0F172A", marginBottom:4 }}>{pol.payer?.payerName || "Unknown Payer"}</div>
                          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                            <span style={{ background:`${pc}18`, color:pc, borderRadius:999, padding:"2px 8px", fontSize:11, fontWeight:700 }}>{pol.planType}</span>
                            <span style={{ background: rank==="primary"?"#DCFCE7":"#F1F5F9", color: rank==="primary"?"#15803D":"#475569", borderRadius:999, padding:"2px 8px", fontSize:11, fontWeight:700, textTransform:"capitalize" }}>{rank}</span>
                            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#64748B" }}>{elIcon} {elStatus.replace("_"," ")}</span>
                          </div>
                        </div>
                        <div style={{ textAlign:"right", fontSize:12, color:"#64748B" }}>
                          <div style={{ fontFamily:"monospace", fontWeight:700, color:"#0F172A", fontSize:13 }}>#{pol.policyNumber}</div>
                          {pol.groupNumber && <div>Group: {pol.groupNumber}</div>}
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, borderTop:"1px solid #F1F5F9", paddingTop:10 }}>
                        <div style={{ fontSize:11, color:"#94A3B8", textTransform:"uppercase", fontWeight:600 }}>Member ID<div style={{ fontSize:13, color:"#0F172A", fontFamily:"monospace", marginTop:2 }}>{pol.subscriber?.memberId||"—"}</div></div>
                        <div style={{ fontSize:11, color:"#94A3B8", textTransform:"uppercase", fontWeight:600 }}>Copay<div style={{ fontSize:13, color:"#0F172A", marginTop:2 }}>₹{((pol.coverage?.copayCents||0)/100).toFixed(0)}</div></div>
                        <div style={{ fontSize:11, color:"#94A3B8", textTransform:"uppercase", fontWeight:600 }}>Deductible<div style={{ fontSize:13, color:"#0F172A", marginTop:2 }}>₹{((pol.coverage?.deductibleCents||0)/100).toFixed(0)}</div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add policy modal */}
            {showPolicyForm && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
                <div style={{ background:"white", borderRadius:20, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
                  <div style={{ padding:"24px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <h2 style={{ fontSize:17, fontWeight:700, color:"#0F172A", margin:0 }}>Add Insurance Policy</h2>
                    <button onClick={()=>setShowPolicyForm(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8" }}><X size={20}/></button>
                  </div>
                  <form onSubmit={handleAddPolicy} style={{ padding:"20px 28px 28px", display:"flex", flexDirection:"column", gap:13 }}>
                    <div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Payer *</label>
                      <select required value={policyForm.payer} onChange={e=>setPolicyForm(f=>({...f,payer:e.target.value}))} style={{border:"1.5px solid #E2E8F0",borderRadius:9,padding:"10px 14px",fontSize:14,outline:"none",background:"#F8FAFC",width:"100%",fontFamily:"inherit"}}>
                        <option value="">-- Select Payer --</option>
                        {payers.map(p=><option key={p._id} value={p._id}>{p.payerName}</option>)}
                      </select>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Policy Number *</label><input required value={policyForm.policyNumber} onChange={e=>setPolicyForm(f=>({...f,policyNumber:e.target.value}))} style={{border:"1.5px solid #E2E8F0",borderRadius:9,padding:"10px 14px",fontSize:14,outline:"none",background:"#F8FAFC",width:"100%",fontFamily:"inherit",boxSizing:"border-box"}} placeholder="POL-12345"/></div>
                      <div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Group Number</label><input value={policyForm.groupNumber||""} onChange={e=>setPolicyForm(f=>({...f,groupNumber:e.target.value}))} style={{border:"1.5px solid #E2E8F0",borderRadius:9,padding:"10px 14px",fontSize:14,outline:"none",background:"#F8FAFC",width:"100%",fontFamily:"inherit",boxSizing:"border-box"}} placeholder="GRP-001"/></div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Plan Type</label>
                        <select value={policyForm.planType} onChange={e=>setPolicyForm(f=>({...f,planType:e.target.value}))} style={{border:"1.5px solid #E2E8F0",borderRadius:9,padding:"10px 14px",fontSize:14,outline:"none",background:"#F8FAFC",width:"100%",fontFamily:"inherit"}}>
                          {["HMO","PPO","EPO","POS","Medicare","Medicaid","SelfPay","Other"].map(t=><option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Rank</label>
                        <select value={policyForm.policyRank} onChange={e=>setPolicyForm(f=>({...f,policyRank:e.target.value}))} style={{border:"1.5px solid #E2E8F0",borderRadius:9,padding:"10px 14px",fontSize:14,outline:"none",background:"#F8FAFC",width:"100%",fontFamily:"inherit"}}>
                          {["primary","secondary","tertiary"].map(r=><option key={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                    <div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Member ID *</label><input required value={policyForm.subscriber.memberId} onChange={e=>setPolicyForm(f=>({...f,subscriber:{...f.subscriber,memberId:e.target.value}}))} style={{border:"1.5px solid #E2E8F0",borderRadius:9,padding:"10px 14px",fontSize:14,outline:"none",background:"#F8FAFC",width:"100%",fontFamily:"inherit",boxSizing:"border-box"}} placeholder="MEM-0001"/></div>
                    <button type="submit" disabled={savingPolicy} style={{ background:"linear-gradient(135deg,#0D9488,#0891B2)", color:"white", border:"none", borderRadius:10, padding:"12px", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>
                      {savingPolicy ? "Saving…" : "Add Policy"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Visits Tab Panel ── */}
        {activeTab === "visits" && (
          <div>
          {data.visits.length > 0 ? data.visits.map((v, idx) => {
          const visitDiagnosis = diagnosis[v.visit_id] || [];
          const visitTreatments = treatments[v.visit_id] || [];
          const total = visitTreatments.reduce((sum, t) => sum + (t.cost || 0), 0);
          const isIP = v.admitted === true;
          const isDischarged = !!v.dischargeDetails?.dischargeDate;

          const headerBg = isDischarged
            ? 'linear-gradient(135deg,#64748B,#475569)'
            : isIP
              ? (v.admissionDetails?.ward === 'ICU' ? 'linear-gradient(135deg,#EF4444,#DC2626)'
                : v.admissionDetails?.ward === 'Private' ? 'linear-gradient(135deg,#10B981,#059669)'
                : 'linear-gradient(135deg,#3B82F6,#1D4ED8)')
              : 'linear-gradient(135deg,#8B5CF6,#6D28D9)';

          return (
            <motion.div key={v.visit_id} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:idx*0.06}} style={cardStyle}>

              {/* Visit Header Bar */}
              <div style={{ background: headerBg, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontFamily:'monospace', fontSize:15, fontWeight:700, color:'white' }}>{v.visit_id}</span>
                  {isIP ? (
                    <span style={{
                      fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                      background:'rgba(255,255,255,0.25)', color:'white', letterSpacing:'0.5px'
                    }}>
                      {isDischarged ? 'DISCHARGED' : `IP — ${v.admissionDetails?.ward}`}
                    </span>
                  ) : (
                    <span style={{
                      fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                      background:'rgba(255,255,255,0.25)', color:'white', letterSpacing:'0.5px'
                    }}>OP</span>
                  )}
                </div>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontFamily:'monospace' }}>
                  {v.visit_date ? new Date(v.visit_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : ''}
                </span>
              </div>

              <div style={{ padding:20 }}>

                {/* IP Admission Info */}
                {isIP && v.admissionDetails && (
                  <div style={{
                    background:'#F8FAFC', borderRadius:10, border:'1px solid #E2E8F0',
                    padding:'12px 16px', marginBottom:16, display:'flex', gap:24, flexWrap:'wrap'
                  }}>
                    <div>
                      <span style={{ fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.6px' }}>Ward</span>
                      <p style={{ fontSize:14, fontWeight:700, margin:'2px 0 0', ...( v.admissionDetails.ward==='ICU'?{color:'#B91C1C'}:v.admissionDetails.ward==='Private'?{color:'#15803D'}:{color:'#1D4ED8'}) }}>{v.admissionDetails.ward}</p>
                    </div>
                    <div>
                      <span style={{ fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.6px' }}>Room</span>
                      <p style={{ fontSize:14, fontWeight:700, margin:'2px 0 0', color:'#0F172A' }}>{v.admissionDetails.roomNumber}</p>
                    </div>
                    <div>
                      <span style={{ fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.6px' }}>Bed</span>
                      <p style={{ fontSize:14, fontWeight:700, margin:'2px 0 0', color:'#0F172A' }}>{v.admissionDetails.bedNumber}</p>
                    </div>
                    <div>
                      <span style={{ fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.6px' }}>Attending</span>
                      <p style={{ fontSize:14, fontWeight:700, margin:'2px 0 0', color:'#0F172A' }}>{v.admissionDetails.attendingDoctor}</p>
                    </div>
                  </div>
                )}

                {/* Diagnosis + Treatment Side by Side */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                  {/* Diagnosis */}
                  <div style={{ background:'#FFF7ED', borderRadius:10, border:'1px solid #FED7AA', padding:'12px 14px' }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#C2410C', textTransform:'uppercase', letterSpacing:'0.6px', margin:'0 0 8px' }}>Diagnosis (ICD)</p>
                    {visitDiagnosis.length > 0 ? visitDiagnosis.map((d, i) => (
                      <div key={i} style={{ display:'flex', gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:'#EA580C', fontFamily:'monospace', whiteSpace:'nowrap' }}>{d.code}</span>
                        <span style={{ fontSize:13, color:'#374151' }}>{d.description}</span>
                      </div>
                    )) : <p style={{ fontSize:13, color:'#94A3B8', margin:0 }}>No diagnosis recorded</p>}
                  </div>

                  {/* Treatments */}
                  <div style={{ background:'#F0FDF4', borderRadius:10, border:'1px solid #BBF7D0', padding:'12px 14px' }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#15803D', textTransform:'uppercase', letterSpacing:'0.6px', margin:'0 0 8px' }}>Treatments (CPT)</p>
                    {visitTreatments.length > 0 ? visitTreatments.map((t, i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <div style={{ display:'flex', gap:8 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'#16A34A', fontFamily:'monospace', whiteSpace:'nowrap' }}>{t.code}</span>
                          <span style={{ fontSize:13, color:'#374151' }}>{t.description}</span>
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:'#0F172A', whiteSpace:'nowrap', marginLeft:8 }}>₹{t.cost}</span>
                      </div>
                    )) : <p style={{ fontSize:13, color:'#94A3B8', margin:0 }}>No treatments recorded</p>}
                    {visitTreatments.length > 0 && (
                      <div style={{ borderTop:'1px solid #BBF7D0', marginTop:8, paddingTop:6, display:'flex', justifyContent:'space-between' }}>
                        <span style={{ fontSize:12, fontWeight:600, color:'#64748B' }}>OP Total</span>
                        <span style={{ fontSize:14, fontWeight:800, color:'#15803D' }}>₹{total}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:10, paddingTop:4 }}>
                  <button onClick={() => navigate(`/billing/${v.visit_id}`)}
                    style={{ ...btnBase, background:'linear-gradient(135deg,#8B5CF6,#6D28D9)' }}>
                    🧾 View Invoice
                  </button>

                  {!isIP && (
                    <button onClick={() => navigate(`/admission/${v.visit_id}`)}
                      style={{ ...btnBase, background:'linear-gradient(135deg,#EF4444,#DC2626)' }}>
                      🏥 Admit as IP
                    </button>
                  )}

                  {isIP && !isDischarged && (
                    <>
                      <button onClick={() => navigate(`/daily-charges/${v.visit_id}`)}
                        style={{ ...btnBase, background:'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
                        📋 Daily Charges
                      </button>
                      <button onClick={() => navigate(`/discharge/${v.visit_id}`)}
                        style={{ ...btnBase, background:'linear-gradient(135deg,#10B981,#059669)' }}>
                        ✅ Discharge
                      </button>
                    </>
                  )}

                  {isIP && isDischarged && (
                    <button onClick={() => navigate(`/ip-bill/${v.visit_id}`)}
                      style={{ ...btnBase, background:'linear-gradient(135deg,#0D9488,#0891B2)' }}>
                      🏦 View IP Bill
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        }) : (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#94A3B8' }}>
            <p style={{ fontSize:48 }}>📋</p>
            <p style={{ fontSize:16, fontWeight:600 }}>No visits found</p>
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientHistory;