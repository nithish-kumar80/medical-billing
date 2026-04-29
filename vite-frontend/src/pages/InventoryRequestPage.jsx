import { useState, useEffect } from "react";
import API from "../services/api";
import { motion } from "framer-motion";

function InventoryRequestPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ item: "", quantity: "", urgency: "Normal", reason: "" });

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const url = isAdmin ? "/inventory-requests" : `/inventory-requests/doctor/${user._id}`;
      const res = await API.get(url);
      setRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/inventory-requests", {
        ...form, quantity: Number(form.quantity),
        requested_by: user.name, requested_by_id: user._id
      });
      alert("Request submitted ✅");
      setForm({ item: "", quantity: "", urgency: "Normal", reason: "" });
      fetchRequests();
    } catch (err) { alert("Error submitting request"); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/inventory-requests/${id}`, { status });
      fetchRequests();
    } catch (err) { alert("Error updating request"); }
  };

  const urgencyColors = { Normal: "bg-blue-100 text-blue-700", Urgent: "bg-orange-100 text-orange-700", Critical: "bg-red-100 text-red-700" };
  const statusColors = { Pending: "bg-yellow-100 text-yellow-700", Approved: "bg-green-100 text-green-700", Rejected: "bg-red-100 text-red-700" };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📦 Inventory Requests</h2>

      {/* CREATE FORM (doctors only) */}
      {!isAdmin && (
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="font-bold text-lg text-gray-700 mb-4">New Request</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
              <input required placeholder="e.g. Oxygen Cylinder" value={form.item} onChange={e => setForm({...form, item: e.target.value})} className="w-full border p-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="number" required placeholder="5" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-full border p-2 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})} className="w-full border p-2 rounded-lg">
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <input placeholder="Why do you need this?" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="w-full border p-2 rounded-lg" />
            </div>
            <div className="col-span-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition w-full">Submit Request</button>
            </div>
          </form>
        </div>
      )}

      {/* REQUESTS LIST */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h3 className="font-bold text-lg text-gray-700 mb-4">{isAdmin ? "All Requests" : "My Requests"}</h3>
        {requests.length === 0 ? <p className="text-gray-500">No requests found.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-100 text-gray-700 border-b">
                <th className="p-3">Item</th><th className="p-3">Qty</th><th className="p-3">Urgency</th>
                {isAdmin && <th className="p-3">Requested By</th>}
                <th className="p-3">Reason</th><th className="p-3">Status</th>
                {isAdmin && <th className="p-3 text-center">Actions</th>}
              </tr></thead>
              <tbody>
                {requests.map((r, idx) => (
                  <motion.tr key={r._id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:idx*0.05}} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 font-medium">{r.item}</td>
                    <td className="p-3">{r.quantity}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${urgencyColors[r.urgency]}`}>{r.urgency}</span></td>
                    {isAdmin && <td className="p-3 text-sm">{r.requested_by}</td>}
                    <td className="p-3 text-sm text-gray-600">{r.reason || "-"}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColors[r.status]}`}>{r.status}</span></td>
                    {isAdmin && (
                      <td className="p-3">
                        {r.status === "Pending" && (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleStatusChange(r._id, "Approved")} className="bg-green-100 hover:bg-green-200 text-green-800 text-xs py-1 px-3 rounded font-semibold transition">Approve</button>
                            <button onClick={() => handleStatusChange(r._id, "Rejected")} className="bg-red-100 hover:bg-red-200 text-red-800 text-xs py-1 px-3 rounded font-semibold transition">Reject</button>
                          </div>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default InventoryRequestPage;
