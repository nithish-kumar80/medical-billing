import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [diagnosis, setDiagnosis] = useState({});
  const [treatments, setTreatments] = useState({});

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/patient-history/${id}`);
      setData(res.data);
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

        {/* Visits */}
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
    </div>
  );
}

export default PatientHistory;