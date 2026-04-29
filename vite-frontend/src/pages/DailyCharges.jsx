import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

function DailyCharges() {
  const { visit_id } = useParams();
  const [charges, setCharges] = useState([]);
  const [form, setForm] = useState({ type: "Room", amount: "", date: new Date().toISOString().split("T")[0] });
  const [visit, setVisit] = useState(null);

  useEffect(() => { fetchCharges(); fetchVisit(); }, []);

  const fetchCharges = async () => {
    try { const res = await API.get(`/visits/${visit_id}/daily-charges`); setCharges(res.data); }
    catch (err) { console.error(err); }
  };

  const fetchVisit = async () => {
    try {
      const res = await API.get(`/billing/${visit_id}`);
      setVisit(res.data.visit);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/visits/${visit_id}/daily-charges`, { ...form, amount: Number(form.amount) });
      setForm({ type: "Room", amount: "", date: new Date().toISOString().split("T")[0] });
      fetchCharges();
    } catch (err) { alert("Error adding charge"); }
  };

  const total = charges.reduce((s, c) => s + (c.amount || 0), 0);

  const typeColors = { Room: "bg-blue-100 text-blue-800", ICU: "bg-red-100 text-red-800", Nursing: "bg-purple-100 text-purple-800", Medicine: "bg-green-100 text-green-800" };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daily Charges</h2>
          <p className="text-gray-500">Visit: <span className="font-mono font-bold">{visit_id}</span>
            {visit?.admitted && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">IP — {visit.admissionDetails?.ward}</span>}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Running Total</p>
          <p className="text-3xl font-bold text-green-600">₹{total}</p>
        </div>
      </div>

      {/* Add Charge Form */}
      <form onSubmit={handleAdd} className="bg-white p-5 rounded-xl shadow border flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Charge Type</label>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border p-2 rounded-lg">
            {["Room","ICU","Nursing","Medicine"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input type="number" required placeholder="500" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full border p-2 rounded-lg" />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border p-2 rounded-lg" />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">+ Add</button>
      </form>

      {/* Charges Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="bg-gray-100 text-gray-700 border-b">
            <th className="p-4">#</th><th className="p-4">Type</th><th className="p-4">Date</th><th className="p-4 text-right">Amount</th>
          </tr></thead>
          <tbody>
            {charges.length === 0 ? (
              <tr><td colSpan="4" className="p-6 text-center text-gray-500">No charges recorded yet.</td></tr>
            ) : charges.map((c, i) => (
              <motion.tr key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 text-gray-500">{i + 1}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-bold ${typeColors[c.type] || "bg-gray-100 text-gray-700"}`}>{c.type}</span></td>
                <td className="p-4 font-mono text-sm text-gray-600">{c.date ? new Date(c.date).toLocaleDateString() : "-"}</td>
                <td className="p-4 text-right font-bold">₹{c.amount}</td>
              </motion.tr>
            ))}
          </tbody>
          {charges.length > 0 && <tfoot><tr className="bg-gray-50 font-bold"><td colSpan="3" className="p-4 text-right">Total:</td><td className="p-4 text-right text-green-600 text-lg">₹{total}</td></tr></tfoot>}
        </table>
      </div>
    </motion.div>
  );
}

export default DailyCharges;
