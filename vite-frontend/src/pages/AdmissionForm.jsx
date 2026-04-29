import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

const WARD_COLORS = { ICU: "from-red-500 to-red-700", General: "from-blue-500 to-blue-700", Private: "from-green-500 to-green-700" };

function AdmissionForm() {
  const { visit_id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ward: "General", roomNumber: "", bedNumber: "", attendingDoctor: "", admissionDate: new Date().toISOString().split("T")[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/visits/${visit_id}/admit`, form);
      alert("Patient admitted successfully ✅");
      navigate(-1);
    } catch (err) { console.error(err); alert("Error admitting patient ❌"); }
  };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-5">
        <h2 className="text-2xl font-bold text-gray-700 text-center">🏥 Admit Patient (IP)</h2>
        <p className="text-center text-gray-500 text-sm">Visit ID: <span className="font-mono font-bold">{visit_id}</span></p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ward Type</label>
          <div className="grid grid-cols-3 gap-3">
            {["ICU", "General", "Private"].map(w => (
              <button key={w} type="button" onClick={() => setForm({...form, ward: w})}
                className={`py-3 rounded-lg border-2 font-semibold text-sm transition-all ${form.ward === w
                  ? `bg-gradient-to-r ${WARD_COLORS[w]} text-white border-transparent shadow-lg` : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                {w === "ICU" ? "🚨" : w === "General" ? "🛏️" : "✨"} {w}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
            <input required placeholder="e.g. 201" value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})} className="border p-3 w-full rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number</label>
            <input required placeholder="e.g. B3" value={form.bedNumber} onChange={e => setForm({...form, bedNumber: e.target.value})} className="border p-3 w-full rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attending Doctor</label>
          <input required placeholder="Dr. Smith" value={form.attendingDoctor} onChange={e => setForm({...form, attendingDoctor: e.target.value})} className="border p-3 w-full rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
          <input type="date" required value={form.admissionDate} onChange={e => setForm({...form, admissionDate: e.target.value})} className="border p-3 w-full rounded-lg" />
        </div>

        <button className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-lg font-semibold transition">Confirm Admission</button>
      </form>
    </motion.div>
  );
}

export default AdmissionForm;
