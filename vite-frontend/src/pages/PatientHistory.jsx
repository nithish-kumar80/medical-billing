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

  if (!data) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  const wardBadge = (ward) => {
    if (ward === "ICU") return "bg-red-100 text-red-700";
    if (ward === "Private") return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Patient History</h2>

      {/* Patient Info */}
      <div className="bg-white p-5 shadow-lg rounded-xl mb-6 flex justify-between items-center">
        <div>
          <p className="text-lg font-bold text-gray-800">{data.patient.name}</p>
          <p className="text-sm text-gray-500">ID: {data.patient.patient_id} | Age: {data.patient.age} | Gender: {data.patient.gender}</p>
        </div>
        <p className="text-lg font-bold text-green-600">Total: ₹{data.totalBill}</p>
      </div>

      {/* Visits */}
      {data.visits.length > 0 ? data.visits.map((v) => {
        const visitDiagnosis = diagnosis[v.visit_id] || [];
        const visitTreatments = treatments[v.visit_id] || [];
        const total = visitTreatments.reduce((sum, t) => sum + (t.cost || 0), 0);
        const isIP = v.admitted === true;
        const isDischarged = !!v.dischargeDetails?.dischargeDate;

        return (
          <motion.div key={v.visit_id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="bg-white p-5 mb-4 shadow rounded-xl border">
            {/* Visit Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg">{v.visit_id}</h3>
                {isIP ? (
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${isDischarged ? "bg-gray-200 text-gray-600" : wardBadge(v.admissionDetails?.ward)}`}>
                    {isDischarged ? "Discharged" : `IP — ${v.admissionDetails?.ward}`}
                  </span>
                ) : (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">OP</span>
                )}
              </div>
              <span className="text-sm text-gray-500 font-mono">{v.visit_date ? new Date(v.visit_date).toLocaleDateString() : ""}</span>
            </div>

            {/* IP Admission Info */}
            {isIP && v.admissionDetails && (
              <div className="bg-gray-50 p-3 rounded-lg border mb-3 text-sm">
                <p>🏥 Ward: <strong className={v.admissionDetails.ward === "ICU" ? "text-red-600" : v.admissionDetails.ward === "Private" ? "text-green-600" : "text-blue-600"}>{v.admissionDetails.ward}</strong> | Room: <strong>{v.admissionDetails.roomNumber}</strong> | Bed: <strong>{v.admissionDetails.bedNumber}</strong></p>
                <p>👨‍⚕️ Attending: <strong>{v.admissionDetails.attendingDoctor}</strong></p>
              </div>
            )}

            {/* Diagnosis */}
            <div className="mt-2">
              <h4 className="font-semibold text-sm text-gray-600 uppercase">Diagnosis (ICD)</h4>
              {visitDiagnosis.length > 0 ? visitDiagnosis.map((d, i) => <p key={i} className="text-sm">{d.code} — {d.description}</p>) : <p className="text-gray-400 text-sm">No diagnosis</p>}
            </div>

            {/* Treatments */}
            <div className="mt-2">
              <h4 className="font-semibold text-sm text-gray-600 uppercase">Treatments (CPT)</h4>
              {visitTreatments.length > 0 ? visitTreatments.map((t, i) => <p key={i} className="text-sm">{t.code} — {t.description} <span className="font-bold">₹{t.cost}</span></p>) : <p className="text-gray-400 text-sm">No treatments</p>}
            </div>

            <div className="mt-3 font-bold text-green-600">OP Total: ₹{total}</div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => navigate(`/billing/${v.visit_id}`)} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">View Invoice</button>
              
              {!isIP && (
                <button onClick={() => navigate(`/admission/${v.visit_id}`)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Admit as IP</button>
              )}
              
              {isIP && !isDischarged && (
                <>
                  <button onClick={() => navigate(`/daily-charges/${v.visit_id}`)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Daily Charges</button>
                  <button onClick={() => navigate(`/discharge/${v.visit_id}`)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Discharge</button>
                </>
              )}
              
              {isIP && isDischarged && (
                <button onClick={() => navigate(`/ip-bill/${v.visit_id}`)} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">View IP Bill</button>
              )}
            </div>
          </motion.div>
        );
      }) : <p className="text-center text-gray-500">No visits found</p>}
    </motion.div>
  );
}

export default PatientHistory;