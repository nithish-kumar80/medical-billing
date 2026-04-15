import React, { useState, useEffect } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

function PatientPortal() {
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [activeTab, setActiveTab] = useState("book"); // 'book', 'appointments', 'history'
  
  // States
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [myHistory, setMyHistory] = useState(null);

  // Booking Form State
  const [form, setForm] = useState({
    patient_id: user?.name, // Temporarily sending name as the ID lookup based on reqs
    doctor_name: "",
    date: "",
    time: "",
    notes: ""
  });

  useEffect(() => {
    if (activeTab === "book") fetchDoctors();
    if (activeTab === "appointments") fetchMyAppointments();
    if (activeTab === "history") fetchMyHistory();
  }, [activeTab]);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
      if (res.data.length > 0) {
        setForm(f => ({ ...f, doctor_name: res.data[0].name }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const res = await API.get(`/appointments/patient/${user.name}`);
      setMyAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyHistory = async () => {
    try {
      const res = await API.get(`/history/patient/${user.name}`);
      setMyHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await API.post("/appointments", form);
      alert("Appointment booked successfully!");
      setForm({ ...form, date: "", time: "", notes: "" });
      setActiveTab("appointments"); // Redirect to see it
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h2>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button 
            className={`px-4 py-2 rounded-md transition-all ${activeTab==='book' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-600'}`}
            onClick={() => setActiveTab("book")}
          >Book Visit</button>
          <button 
            className={`px-4 py-2 rounded-md transition-all ${activeTab==='appointments' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-600'}`}
            onClick={() => setActiveTab("appointments")}
          >My Appointments</button>
          <button 
            className={`px-4 py-2 rounded-md transition-all ${activeTab==='history' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-600'}`}
            onClick={() => setActiveTab("history")}
          >Medical History</button>
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* TAB 1: BOOK APPOINTMENT */}
        {activeTab === "book" && (
          <div className="bg-white p-6 rounded-xl shadow border border-gray-100 max-w-lg mx-auto">
             <h3 className="text-xl font-bold mb-4 text-gray-700">Schedule an Appointment</h3>
             <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                  <select 
                    className="w-full border-gray-300 rounded-lg shadow-sm border p-2 focus:ring-blue-500"
                    value={form.doctor_name}
                    onChange={e => setForm({...form, doctor_name: e.target.value})}
                  >
                    {doctors.map((d, i) => <option key={i} value={d.name}>Dr. {d.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" required className="w-full border p-2 rounded-lg" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input type="time" required className="w-full border p-2 rounded-lg" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit (Optional)</label>
                  <textarea className="w-full border p-2 rounded-lg" rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                  Confirm Booking
                </button>
             </form>
          </div>
        )}

        {/* TAB 2: MY APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-4">
            {myAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-10">You have no scheduled appointments.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myAppointments.map(app => (
                  <div key={app._id} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-gray-800">Dr. {app.doctor_name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          app.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          app.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>{app.status}</span>
                      </div>
                      <p className="text-gray-600">📅 {app.date} at {app.time}</p>
                      {app.notes && <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">"{app.notes}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEDICAL HISTORY */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl shadow p-6">
            {!myHistory?.patient ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No official medical records found.</p>
                <p className="text-sm text-gray-400">Records will appear here once you complete a visit.</p>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex space-x-6 border-b pb-4">
                  <div><span className="text-gray-500 text-sm">Patient ID:</span> <span className="font-bold text-gray-800">{myHistory.patient.patient_id}</span></div>
                  <div><span className="text-gray-500 text-sm">Age:</span> <span className="font-bold text-gray-800">{myHistory.patient.age}</span></div>
                  <div><span className="text-gray-500 text-sm">Gender:</span> <span className="font-bold text-gray-800">{myHistory.patient.gender}</span></div>
                </div>
                
                <h3 className="font-bold text-xl mb-4 text-gray-700">Treatment Timeline</h3>
                {myHistory.visits.length === 0 ? <p className="text-gray-500">No past visits recorded.</p> : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                    {myHistory.visits.map(visit => {
                      const vTreatments = myHistory.treatments.filter(t => t.visit_id === visit.visit_id);
                      const vDiagnosis = myHistory.diagnosis.filter(d => d.visit_id === visit.visit_id);
                      return (
                        <div key={visit.visit_id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-white border-4 bg-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                            <span className="text-white text-xs font-bold">🩺</span>
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-blue-50/50 p-4 rounded border shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-bold text-blue-800">Dr. {visit.doctor} ({visit.department})</h4>
                              <span className="text-xs text-gray-500 font-mono">{new Date(visit.visit_date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 font-medium">Symptoms: {visit.symptoms || "N/A"}</p>
                            
                            {vDiagnosis.length > 0 && (
                              <div className="mb-2">
                                <strong className="text-xs text-gray-500 uppercase tracking-wide">Diagnosis:</strong>
                                <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                  {vDiagnosis.map(d => <li key={d._id}>{d.condition} <span className="text-xs text-gray-400">({d.type})</span></li>)}
                                </ul>
                              </div>
                            )}

                            {vTreatments.length > 0 && (
                              <div>
                                <strong className="text-xs text-gray-500 uppercase tracking-wide">Treatments & Meds:</strong>
                                <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                  {vTreatments.map(t => <li key={t._id}>{t.description} <span className="text-xs text-gray-400">({t.type})</span></li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default PatientPortal;
