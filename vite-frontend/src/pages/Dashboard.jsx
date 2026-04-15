import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const pageVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

function Dashboard() {
  const [data, setData] = useState({
    totalPatients: 0,
    totalVisits: 0,
    totalRevenue: 0,
    revenueData: [],
    claimStats: {}
  });

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchDoctors();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Doctors list error:", err);
    }
  };

  // 📊 BAR CHART DATA (FROM BACKEND)
  const revenueData = data.revenueData || [];

  // 🥧 PIE CHART DATA (CLAIMS)
  const claimData = [
    { name: "Approved", value: data.claimStats.approved || 0 },
    { name: "Pending", value: data.claimStats.pending || 0 },
    { name: "Rejected", value: data.claimStats.rejected || 0 }
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <motion.div
      variants={pageVariant}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-700">
        Dashboard
      </h1>

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-5 gap-6">

        <motion.div whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg">
          <h3>Total Patients</h3>
          <p className="text-3xl font-bold">{data.totalPatients}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg">
          <h3>Total Visits</h3>
          <p className="text-3xl font-bold">{data.totalVisits}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-lg">
          <h3>Total Revenue</h3>
          <p className="text-3xl font-bold">₹{data.totalRevenue}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl shadow-lg">
          <h3>Claims</h3>
          <p className="text-3xl font-bold">
            {(data.claimStats.approved || 0) +
             (data.claimStats.pending || 0) +
             (data.claimStats.rejected || 0)}
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-xl shadow-lg">
          <h3>Today's Appts</h3>
          <p className="text-3xl font-bold">{data.todayAppointments || 0}</p>
        </motion.div>

      </div>

      {/* 📊 CHARTS */}
      <div className="grid grid-cols-2 gap-6">

        {/* 📊 REVENUE BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold mb-4 text-gray-700">
            Revenue per Bill
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <XAxis 
                dataKey="name"
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 CLAIMS PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold mb-4 text-gray-700">
            Claims Status
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={claimData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {claimData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 👨‍⚕️ DOCTORS LIST */}
      <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
        <h3 className="font-bold mb-4 text-gray-700 text-xl">Registered Doctors</h3>
        {doctors.length === 0 ? (
          <p className="text-gray-500">No doctors registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="p-4 border rounded-lg shadow flex flex-col space-y-2 bg-blue-50/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                    {doc.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{doc.name}</h4>
                    <span className="text-sm text-gray-500">{doc.email}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
}

export default Dashboard;