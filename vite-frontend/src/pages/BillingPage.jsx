import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function BillingPage() {
  const { visit_id } = useParams();

  const [data, setData] = useState(null);
  const [loadingClaim, setLoadingClaim] = useState(false);

  const invoiceRef = useRef();

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const res = await API.get(`/billing/${visit_id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ PDF DOWNLOAD
  const downloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 10, 10, 190, 0);
    pdf.save(`Invoice-${visit_id}.pdf`);
  };

  // ✅ MARK PAID
  const markPaid = async () => {
    try {
      await API.put(`/billing/pay/${visit_id}`);
      alert("Payment Successful ✅");
      fetchInvoice();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SUBMIT CLAIM
  const submitClaim = async () => {
    try {
      setLoadingClaim(true);

      await API.post(`/claims/${visit_id}`, {
        provider: "City Hospital",
        payer: "Star Health Insurance"
      });

      alert("Insurance Claim Submitted ✅");

    } catch (err) {
      console.error(err);
      alert("Claim already exists or error ❌");
    } finally {
      setLoadingClaim(false);
    }
  };

  if (!data) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', background:'#F8FAFC' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, border:'3px solid #0D9488', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }} />
        <p style={{ color:'#64748B', fontSize:14 }}>Loading invoice…</p>
      </div>
    </div>
  );

  const { bill, patient, visit, diagnosis, treatments, total } = data;

  const tax = total * 0.05;
  const finalTotal = total + tax;

  const isPaid = bill?.status === "Paid";

  const cardStyle = {
    background:'white',
    borderRadius:16,
    boxShadow:'0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)',
    border:'1px solid #E2E8F0',
    overflow:'hidden',
  };

  const btnBase = {
    border:'none', borderRadius:10, padding:'11px 22px', fontWeight:600,
    cursor:'pointer', fontSize:14, color:'white', flex:1,
  };

  const thStyle = {
    padding:'12px 16px', textAlign:'left', fontSize:12, fontWeight:700,
    color:'#64748B', textTransform:'uppercase', letterSpacing:'0.6px',
    background:'#F8FAFC', borderBottom:'1px solid #E2E8F0',
  };

  const tdStyle = {
    padding:'13px 16px', fontSize:14, color:'#374151', borderBottom:'1px solid #F1F5F9',
  };

  return (
    <div style={{ background:'#F8FAFC', minHeight:'100vh', padding:'32px 24px' }}>
      <div style={{ maxWidth:860, margin:'0 auto' }}>

        {/* Page title */}
        <div style={{ marginBottom:24 }}>
          <h2 style={{ fontSize:26, fontWeight:800, color:'#0F172A', margin:0 }}>Invoice</h2>
          <p style={{ fontSize:14, color:'#64748B', marginTop:4 }}>Outpatient billing summary</p>
        </div>

        {/* ── INVOICE CARD ── */}
        <div ref={invoiceRef} style={cardStyle}>

          {/* Teal Header */}
          <div style={{ background:'linear-gradient(135deg,#0D9488,#0891B2)', padding:'24px 28px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:'white', margin:0, letterSpacing:'-0.3px' }}>🏥 City Hospital</h1>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', marginTop:4 }}>Chennai</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginBottom:2, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.6px' }}>Invoice</p>
              <p style={{ fontSize:15, fontWeight:700, color:'white', fontFamily:'monospace', margin:0 }}>{visit.visit_id}</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.75)', marginTop:2 }}>{new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}</p>
            </div>
          </div>

          {/* Patient + Status Grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, borderBottom:'1px solid #E2E8F0' }}>
            <div style={{ padding:'20px 24px', borderRight:'1px solid #E2E8F0' }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.6px', margin:'0 0 10px' }}>Patient</p>
              <p style={{ fontSize:17, fontWeight:700, color:'#0F172A', margin:'0 0 4px' }}>{patient?.name}</p>
              <p style={{ fontSize:13, color:'#64748B', margin:0 }}>Age: {patient?.age}</p>
            </div>
            <div style={{ padding:'20px 24px' }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.6px', margin:'0 0 10px' }}>Payment Status</p>
              <span style={{
                display:'inline-block', fontSize:13, fontWeight:700, padding:'5px 14px', borderRadius:20,
                background: isPaid ? '#DCFCE7' : '#FEE2E2',
                color: isPaid ? '#15803D' : '#B91C1C',
                border: isPaid ? '1px solid #BBF7D0' : '1px solid #FECACA',
              }}>
                {isPaid ? '✓ Paid' : '⏳ Pending'}
              </span>
            </div>
          </div>

          {/* Diagnosis Section */}
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #E2E8F0', background:'#FFF7ED' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#C2410C', textTransform:'uppercase', letterSpacing:'0.6px', margin:'0 0 10px' }}>Diagnosis (ICD Codes)</p>
            {diagnosis.length > 0 ? (
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {diagnosis.map((d, i) => (
                  <span key={i} style={{
                    fontSize:13, padding:'5px 12px', borderRadius:8,
                    background:'white', border:'1px solid #FED7AA', color:'#374151',
                  }}>
                    <strong style={{ color:'#EA580C' }}>{d.code}</strong> — {d.description}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize:13, color:'#94A3B8', margin:0 }}>No diagnosis recorded</p>
            )}
          </div>

          {/* Treatments Table */}
          <div style={{ padding:'0' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.6px', margin:'0', padding:'16px 24px 0' }}>Treatment Details</p>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Code</th>
                  <th style={thStyle}>Description</th>
                  <th style={{ ...thStyle, textAlign:'right' }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {treatments.length > 0 ? (
                  treatments.map((t, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                      <td style={{ ...tdStyle, fontFamily:'monospace', color:'#0D9488', fontWeight:700 }}>{t.code}</td>
                      <td style={tdStyle}>{t.description}</td>
                      <td style={{ ...tdStyle, textAlign:'right', fontWeight:700, color:'#0F172A' }}>₹{t.cost}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ ...tdStyle, textAlign:'center', color:'#94A3B8', padding:'28px 16px' }}>No treatments recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div style={{ padding:'20px 24px', background:'#F8FAFC', borderTop:'1px solid #E2E8F0' }}>
            <div style={{ maxWidth:320, marginLeft:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #E2E8F0' }}>
                <span style={{ fontSize:14, color:'#64748B' }}>Subtotal</span>
                <span style={{ fontSize:14, fontWeight:600, color:'#0F172A' }}>₹{total}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #E2E8F0' }}>
                <span style={{ fontSize:14, color:'#64748B' }}>Tax (5%)</span>
                <span style={{ fontSize:14, fontWeight:600, color:'#0F172A' }}>₹{tax.toFixed(2)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0' }}>
                <span style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>Total Amount</span>
                <span style={{ fontSize:20, fontWeight:800, color:'#0D9488' }}>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display:'flex', gap:12, marginTop:20, flexWrap:'wrap' }}>
          <button onClick={downloadPDF}
            style={{ ...btnBase, background:'linear-gradient(135deg,#3B82F6,#1D4ED8)' }}>
            📥 Download PDF
          </button>

          {bill.status !== "Paid" && (
            <button onClick={markPaid}
              style={{ ...btnBase, background:'linear-gradient(135deg,#10B981,#059669)' }}>
              ✅ Mark as Paid
            </button>
          )}

          <button onClick={submitClaim} disabled={loadingClaim}
            style={{ ...btnBase, background: loadingClaim ? '#94A3B8' : 'linear-gradient(135deg,#8B5CF6,#6D28D9)', cursor: loadingClaim ? 'not-allowed' : 'pointer' }}>
            {loadingClaim ? "Submitting…" : "🏥 Submit Insurance Claim"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default BillingPage;