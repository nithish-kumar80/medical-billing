import { useState, useEffect } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AddVisit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    patient_id: "",
    diagnosis_code: "", diagnosis_desc: "",
    treatment_code: "", treatment_desc: "",
    cost: "",
    // IP fields
    admitAsIP: false,
    ward: "General", roomNumber: "", bedNumber: "", attendingDoctor: ""
  });

  useEffect(() => { if (id) setForm(prev => ({ ...prev, patient_id: id })); }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. CREATE VISIT
      const visitRes = await API.post("/visits", { patient_id: form.patient_id });
      const visit_id = visitRes.data.visitId;

      // 2. ADD DIAGNOSIS
      await API.post("/diagnosis", { visit_id, code: form.diagnosis_code, description: form.diagnosis_desc });

      // 3. ADD TREATMENT
      await API.post("/treatments", { visit_id, code: form.treatment_code, description: form.treatment_desc, cost: Number(form.cost) });

      // 4. IF IP → ADMIT
      if (form.admitAsIP) {
        await API.put(`/visits/${visit_id}/admit`, {
          ward: form.ward,
          roomNumber: form.roomNumber,
          bedNumber: form.bedNumber,
          attendingDoctor: form.attendingDoctor,
          admissionDate: new Date().toISOString()
        });
      }

      alert(`Visit created successfully ✅${form.admitAsIP ? " (Patient Admitted as IP)" : ""}`);
      setForm({ ...form, diagnosis_code: "", diagnosis_desc: "", treatment_code: "", treatment_desc: "", cost: "", admitAsIP: false, ward: "General", roomNumber: "", bedNumber: "", attendingDoctor: "" });

    } catch (err) {
      console.error(err);
      alert("Error adding visit ❌");
    }
  };

  const WARD_COLORS = { ICU: "border-red-500 bg-red-50 text-red-700", General: "border-blue-500 bg-blue-50 text-blue-700", Private: "border-green-500 bg-green-50 text-green-700" };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold text-gray-700 text-center">Add Visit</h2>

        <input name="patient_id" value={form.patient_id} readOnly className="border p-3 w-full rounded bg-gray-100" />

        {/* Diagnosis */}
        <h3 className="font-semibold text-gray-600">Diagnosis (ICD)</h3>
        <input name="diagnosis_code" placeholder="ICD Code (e.g. A01)" className="border p-2 w-full rounded" value={form.diagnosis_code} onChange={handleChange} />
        <input name="diagnosis_desc" placeholder="Diagnosis Description" className="border p-2 w-full rounded" value={form.diagnosis_desc} onChange={handleChange} />

        {/* Treatment */}
        <h3 className="font-semibold text-gray-600">Treatment (CPT)</h3>
        <input name="treatment_code" placeholder="CPT Code (e.g. T100)" className="border p-2 w-full rounded" value={form.treatment_code} onChange={handleChange} />
        <input name="treatment_desc" placeholder="Treatment Description" className="border p-2 w-full rounded" value={form.treatment_desc} onChange={handleChange} />
        <input name="cost" type="number" placeholder="Cost (₹)" className="border p-2 w-full rounded" value={form.cost} onChange={handleChange} />

        {/* IP TOGGLE */}
        <div className="border-t pt-4 mt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.admitAsIP} onChange={e => setForm({...form, admitAsIP: e.target.checked})}
              className="w-5 h-5 text-red-600 rounded" />
            <span className="font-semibold text-gray-700">🏥 Admit as In-Patient (IP)</span>
          </label>
        </div>

        {/* IP FIELDS (conditional) */}
        {form.admitAsIP && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="space-y-3 bg-gray-50 p-4 rounded-lg border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ward Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["ICU","General","Private"].map(w => (
                  <button key={w} type="button" onClick={() => setForm({...form, ward: w})}
                    className={`py-2 rounded-lg border-2 font-semibold text-sm transition-all ${form.ward === w ? WARD_COLORS[w] : "border-gray-200 text-gray-500"}`}>
                    {w === "ICU" ? "🚨" : w === "General" ? "🛏️" : "✨"} {w}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="roomNumber" placeholder="Room No." value={form.roomNumber} onChange={handleChange} className="border p-2 rounded" required={form.admitAsIP} />
              <input name="bedNumber" placeholder="Bed No." value={form.bedNumber} onChange={handleChange} className="border p-2 rounded" required={form.admitAsIP} />
            </div>
            <input name="attendingDoctor" placeholder="Attending Doctor" value={form.attendingDoctor} onChange={handleChange} className="border p-2 w-full rounded" required={form.admitAsIP} />
          </motion.div>
        )}

        <button className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-semibold transition">
          {form.admitAsIP ? "Create Visit & Admit Patient" : "Create Visit"}
        </button>
      </form>
    </motion.div>
  );
}

export default AddVisit;