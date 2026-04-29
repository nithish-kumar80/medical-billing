import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState({ opPatients: 0, ipPatients: 0, todayAppointments: 0 });
  const [appointments, setAppointments] = useState([]);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => { fetchDashboard(); fetchAppointments(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData({ opPatients: res.data.opPatients || 0, ipPatients: res.data.ipPatients || 0, todayAppointments: res.data.todayAppointments || 0 });
    } catch (err) { console.error("Doctor Dashboard error:", err); }
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get(`/appointments/doctor/${encodeURIComponent(user.name)}`);
      setAppointments(res.data);
    } catch (err) { console.error("Doctor Appointments fetch error:", err); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.patch(`/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) { alert("Failed to update status"); }
  };

  const viewPatientHistory = async (patientName) => {
    setHistoryLoading(true);
    try {
      const res = await API.get(`/history/patient/${encodeURIComponent(patientName)}`);
      setSelectedPatientHistory(res.data);
    } catch (err) { alert("Failed to fetch patient history"); }
    finally { setHistoryLoading(false); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dr. {user?.name}'s Dashboard</h2>
          <p className="text-gray-500">Manage your appointments and patient records.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg">
          <h3>Total OP Patients</h3><p className="text-3xl font-bold">{data.opPatients}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-lg">
          <h3>Total IP Patients</h3><p className="text-3xl font-bold">{data.ipPatients}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg">
          <h3>Today's Appointments</h3><p className="text-3xl font-bold">{data.todayAppointments}</p>
        </motion.div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">My Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">You have no appointments.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b">
                  <th className="p-4">Patient</th><th className="p-4">Date & Time</th><th className="p-4">Notes</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app, idx) => (
                  <motion.tr key={app._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:idx*0.05}} className="border-b last:border-0 hover:bg-indigo-50/50">
                    <td className="p-4 font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => viewPatientHistory(app.patient_id)}>{app.patient_id}</td>
                    <td className="p-4 font-mono text-gray-600 text-sm">{app.date}<br/>{app.time}</td>
                    <td className="p-4 text-sm text-gray-500 italic max-w-[200px] truncate">{app.notes || "-"}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        app.status==='Scheduled'?'bg-blue-100 text-blue-700':app.status==='Completed'?'bg-green-100 text-green-700':app.status==='Cancelled'?'bg-red-100 text-red-700':app.status==='No-show'?'bg-orange-100 text-orange-700':'bg-gray-100 text-gray-700'
                      }`}>{app.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center space-x-2">
                        {app.status === 'Scheduled' && (<>
                          <button onClick={() => handleStatusChange(app._id,'Completed')} className="bg-green-100 hover:bg-green-200 text-green-800 text-xs py-1 px-3 rounded shadow-sm font-semibold transition">Complete</button>
                          <button onClick={() => handleStatusChange(app._id,'No-show')} className="bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs py-1 px-3 rounded shadow-sm font-semibold transition">No-show</button>
                          <button onClick={() => handleStatusChange(app._id,'Cancelled')} className="bg-red-100 hover:bg-red-200 text-red-800 text-xs py-1 px-3 rounded shadow-sm font-semibold transition">Cancel</button>
                        </>)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {historyLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-2"></div>
            <p className="font-bold text-gray-700">Loading Patient Records...</p>
          </div>
        </div>
      )}

      {selectedPatientHistory && !historyLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPatientHistory(null)}>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Medical History</h2>
              <button onClick={() => setSelectedPatientHistory(null)} className="text-gray-400 hover:text-red-500 text-2xl font-bold">×</button>
            </div>
            {!selectedPatientHistory?.patient ? (
              <p className="text-gray-500 text-center py-10">No records found for this patient.</p>
            ) : (
              <div>
                <div className="mb-4 grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border">
                  <div><span className="text-gray-500 text-sm block">Patient ID</span><span className="font-bold">{selectedPatientHistory.patient.patient_id}</span></div>
                  <div><span className="text-gray-500 text-sm block">Name</span><span className="font-bold">{selectedPatientHistory.patient.name}</span></div>
                  <div><span className="text-gray-500 text-sm block">Age/Gender</span><span className="font-bold">{selectedPatientHistory.patient.age} / {selectedPatientHistory.patient.gender}</span></div>
                </div>
                <div className="space-y-4">
                  {selectedPatientHistory.visits.map(visit => {
                    const vT = selectedPatientHistory.treatments.filter(t => t.visit_id === visit.visit_id);
                    const vD = selectedPatientHistory.diagnosis.filter(d => d.visit_id === visit.visit_id);
                    return (
                      <div key={visit.visit_id} className="border p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                          <div><span className="font-bold text-blue-700 mr-2">Dr. {visit.doctor}</span><span className="text-xs bg-gray-200 px-2 rounded-full">{visit.department}</span></div>
                          <span className="text-sm font-mono text-gray-500">{new Date(visit.visit_date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2"><strong>Symptoms:</strong> {visit.symptoms||"N/A"}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-red-50 p-3 rounded"><strong className="text-xs text-red-800 uppercase">Diagnosis</strong>{vD.length>0?<ul className="list-disc list-inside text-sm mt-1">{vD.map(d=><li key={d._id}>{d.description}</li>)}</ul>:<p className="text-xs text-gray-500 mt-1">None</p>}</div>
                          <div className="bg-blue-50 p-3 rounded"><strong className="text-xs text-blue-800 uppercase">Treatments</strong>{vT.length>0?<ul className="list-disc list-inside text-sm mt-1">{vT.map(t=><li key={t._id}>{t.description}</li>)}</ul>:<p className="text-xs text-gray-500 mt-1">None</p>}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;