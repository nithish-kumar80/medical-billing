import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

function IPBillPage() {
  const { visit_id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => { fetchBill(); }, []);

  const fetchBill = async () => {
    try { const res = await API.get(`/visits/${visit_id}/final-bill`); setData(res.data); }
    catch (err) { console.error(err); }
  };

  const submitClaim = async () => {
    try {
      await API.post(`/claims/${visit_id}`, { provider: "City Hospital", payer: "Insurance Co." });
      alert("Claim submitted ✅");
    } catch (err) { alert("Claim already exists or error"); }
  };

  if (!data) return <p className="text-center mt-10 text-gray-500">Loading final bill...</p>;

  const { visit, patient, treatments, treatmentTotal, dailyChargesTotal, daysAdmitted, grandTotal } = data;
  const tax = grandTotal * 0.05;
  const finalAmount = grandTotal + tax;
  const wardColor = visit.admissionDetails?.ward === "ICU" ? "text-red-600" : visit.admissionDetails?.ward === "Private" ? "text-green-600" : "text-blue-600";

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="p-6 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">City Hospital</h1>
            <p className="text-gray-500">In-Patient Final Bill</p>
          </div>
          <div className="text-right">
            <p className="font-mono font-bold">{visit.visit_id}</p>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Patient & Admission Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold text-gray-700 mb-2">Patient Info</h3>
            <p>Name: <strong>{patient?.name}</strong></p>
            <p>ID: <strong>{patient?.patient_id}</strong></p>
            <p>Age: {patient?.age} | Gender: {patient?.gender}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold text-gray-700 mb-2">Admission Details</h3>
            <p>Ward: <strong className={wardColor}>{visit.admissionDetails?.ward}</strong></p>
            <p>Room: {visit.admissionDetails?.roomNumber} / Bed: {visit.admissionDetails?.bedNumber}</p>
            <p>Days Admitted: <strong>{daysAdmitted}</strong></p>
            {visit.dischargeDetails?.dischargeDate && <p>Discharged: {new Date(visit.dischargeDetails.dischargeDate).toLocaleDateString()}</p>}
          </div>
        </div>

        {/* Discharge Summary */}
        {visit.dischargeDetails?.summary && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-bold text-blue-800 mb-1">Discharge Summary</h3>
            <p className="text-sm text-gray-700">{visit.dischargeDetails.summary}</p>
            <p className="text-sm mt-1"><strong>Final Diagnosis:</strong> {visit.dischargeDetails.finalDiagnosis}</p>
          </div>
        )}

        {/* Treatments */}
        <h3 className="font-bold text-gray-700 mb-2">Treatments</h3>
        <table className="w-full border mb-4">
          <thead className="bg-gray-200"><tr><th className="border p-2">Code</th><th className="border p-2">Description</th><th className="border p-2 text-right">Cost</th></tr></thead>
          <tbody>
            {treatments.length > 0 ? treatments.map((t, i) => (
              <tr key={i} className="text-center"><td className="border p-2">{t.code}</td><td className="border p-2">{t.description}</td><td className="border p-2 text-right">₹{t.cost}</td></tr>
            )) : <tr><td colSpan="3" className="p-4 text-center text-gray-500">No treatments</td></tr>}
          </tbody>
        </table>

        {/* Daily Charges */}
        <h3 className="font-bold text-gray-700 mb-2">Daily Charges</h3>
        <table className="w-full border mb-6">
          <thead className="bg-gray-200"><tr><th className="border p-2">Type</th><th className="border p-2">Date</th><th className="border p-2 text-right">Amount</th></tr></thead>
          <tbody>
            {(visit.dailyCharges || []).length > 0 ? visit.dailyCharges.map((c, i) => (
              <tr key={i} className="text-center"><td className="border p-2">{c.type}</td><td className="border p-2">{c.date ? new Date(c.date).toLocaleDateString() : "-"}</td><td className="border p-2 text-right">₹{c.amount}</td></tr>
            )) : <tr><td colSpan="3" className="p-4 text-center text-gray-500">No daily charges</td></tr>}
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-right space-y-1 border-t pt-4">
          <p>Treatment Total: <strong>₹{treatmentTotal}</strong></p>
          <p>Daily Charges Total: <strong>₹{dailyChargesTotal}</strong></p>
          <p>Tax (5%): <strong>₹{tax.toFixed(2)}</strong></p>
          <p className="text-2xl font-bold text-green-600 mt-2">Grand Total: ₹{finalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={() => navigate(`/billing/${visit_id}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex-1 transition">View OP Invoice</button>
        <button onClick={submitClaim} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex-1 transition">Submit Insurance Claim</button>
      </div>
    </motion.div>
  );
}

export default IPBillPage;
