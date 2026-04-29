import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

function DischargePage() {
  const { visit_id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ summary: "", finalDiagnosis: "", dischargeDate: new Date().toISOString().split("T")[0] });

  const handleDischarge = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/visits/${visit_id}/discharge`, form);
      alert("Patient discharged successfully ✅");
      navigate(`/ip-bill/${visit_id}`);
    } catch (err) { console.error(err); alert("Error discharging patient ❌"); }
  };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex justify-center mt-10">
      <form onSubmit={handleDischarge} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-5">
        <h2 className="text-2xl font-bold text-gray-700 text-center">🏥 Discharge Patient</h2>
        <p className="text-center text-gray-500 text-sm">Visit ID: <span className="font-mono font-bold">{visit_id}</span></p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discharge Date</label>
          <input type="date" required value={form.dischargeDate} onChange={e => setForm({...form, dischargeDate: e.target.value})} className="border p-3 w-full rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Final Diagnosis</label>
          <input required placeholder="e.g. Pneumonia — Resolved" value={form.finalDiagnosis} onChange={e => setForm({...form, finalDiagnosis: e.target.value})} className="border p-3 w-full rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discharge Summary</label>
          <textarea required rows="4" placeholder="Patient was admitted for... Treatment included... Patient is advised to..." value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className="border p-3 w-full rounded-lg" />
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-semibold transition">Confirm Discharge & Generate Bill</button>
      </form>
    </motion.div>
  );
}

export default DischargePage;
