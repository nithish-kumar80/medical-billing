import { useState, useEffect } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

function PrescriptionPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [patients, setPatients] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medications, setMedications] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [notes, setNotes] = useState("");

  useEffect(() => { fetchPatients(); fetchMyPrescriptions(); }, []);

  const fetchPatients = async () => {
    try { const res = await API.get("/patients"); setPatients(res.data); } catch (err) { console.error(err); }
  };

  const fetchMyPrescriptions = async () => {
    try { const res = await API.get(`/prescriptions/doctor/${user._id}`); setMyPrescriptions(res.data); } catch (err) { console.error(err); }
  };

  const addMedRow = () => setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  const removeMedRow = (i) => setMedications(medications.filter((_, idx) => idx !== i));
  const updateMed = (i, field, val) => { const m = [...medications]; m[i][field] = val; setMedications(m); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return alert("Please select a patient");
    try {
      await API.post("/prescriptions", {
        patient_id: selectedPatient.patient_id,
        patient_name: selectedPatient.name,
        doctor_name: user.name,
        doctor_user_id: user._id,
        medications: medications.filter(m => m.name),
        notes
      });
      alert("Prescription created ✅");
      setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
      setNotes("");
      setSelectedPatient(null);
      fetchMyPrescriptions();
    } catch (err) { alert("Error creating prescription"); }
  };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">💊 Prescriptions</h2>

      {/* CREATE PRESCRIPTION */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h3 className="font-bold text-lg text-gray-700 mb-4">Write New Prescription</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
            <select className="w-full border p-2 rounded-lg" value={selectedPatient?.patient_id || ""} onChange={e => setSelectedPatient(patients.find(p => p.patient_id === e.target.value) || null)}>
              <option value="">-- Choose Patient --</option>
              {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.name} ({p.patient_id})</option>)}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Medications</label>
              <button type="button" onClick={addMedRow} className="text-blue-600 text-sm font-semibold hover:underline">+ Add Row</button>
            </div>
            <div className="space-y-2">
              {medications.map((med, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-center">
                  <input placeholder="Medicine Name" value={med.name} onChange={e => updateMed(i,"name",e.target.value)} className="border p-2 rounded col-span-1" />
                  <input placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={e => updateMed(i,"dosage",e.target.value)} className="border p-2 rounded" />
                  <input placeholder="Frequency (e.g. 2x/day)" value={med.frequency} onChange={e => updateMed(i,"frequency",e.target.value)} className="border p-2 rounded" />
                  <input placeholder="Duration (e.g. 5 days)" value={med.duration} onChange={e => updateMed(i,"duration",e.target.value)} className="border p-2 rounded" />
                  {medications.length > 1 && <button type="button" onClick={() => removeMedRow(i)} className="text-red-500 text-sm font-bold">✕</button>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="2" className="w-full border p-2 rounded-lg" placeholder="e.g. Take after meals..." />
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition w-full">Create Prescription</button>
        </form>
      </div>

      {/* MY PRESCRIPTIONS */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h3 className="font-bold text-lg text-gray-700 mb-4">Recent Prescriptions</h3>
        {myPrescriptions.length === 0 ? <p className="text-gray-500">No prescriptions yet.</p> : (
          <div className="space-y-4">
            {myPrescriptions.map(rx => (
              <motion.div key={rx._id} initial={{opacity:0}} animate={{opacity:1}} className="border p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-bold text-gray-800">{rx.patient_name}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">{rx.patient_id}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(rx.createdAt).toLocaleDateString()}</span>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="text-gray-500 border-b"><th className="text-left py-1">Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead>
                  <tbody>{rx.medications.map((m, i) => <tr key={i} className="border-b last:border-0"><td className="py-1 font-medium">{m.name}</td><td className="text-center">{m.dosage}</td><td className="text-center">{m.frequency}</td><td className="text-center">{m.duration}</td></tr>)}</tbody>
                </table>
                {rx.notes && <p className="text-sm text-gray-600 mt-2 italic">📝 {rx.notes}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default PrescriptionPage;
