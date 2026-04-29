import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patient";
import AddPatient from "./pages/AddPatient";
import PatientHistory from "./pages/PatientHistory";
import AddVisit from "./pages/AddVisit";
import SearchPatient from "./pages/SearchPatient";
import BillingPage from "./pages/BillingPage";
import ClaimsPage from "./pages/ClaimsPage";
import PatientPortal from "./pages/PatientPortal";
import DoctorDashboard from "./pages/DoctorDashboard";
import Login from "./pages/Login";
import AdmissionForm from "./pages/AdmissionForm";
import DailyCharges from "./pages/DailyCharges";
import DischargePage from "./pages/DischargePage";
import IPBillPage from "./pages/IPBillPage";
import PrescriptionPage from "./pages/PrescriptionPage";
import InventoryRequestPage from "./pages/InventoryRequestPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/redirect" />} />

      <Route path="/redirect" element={
        user ? (
          user.role === "admin" ? <Navigate to="/dashboard" /> :
          user.role === "doctor" ? <Navigate to="/doctor-dashboard" /> :
          <Navigate to="/patient-portal" />
        ) : <Navigate to="/login" />
      } />

      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        {/* ADMIN */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="add-patient" element={<AddPatient />} />
        <Route path="history/:id" element={<PatientHistory />} />
        <Route path="add-visit/:id" element={<AddVisit />} />
        <Route path="search" element={<SearchPatient />} />
        <Route path="billing/:visit_id" element={<BillingPage />} />
        <Route path="claims" element={<ClaimsPage />} />

        {/* IP MANAGEMENT */}
        <Route path="admission/:visit_id" element={<AdmissionForm />} />
        <Route path="daily-charges/:visit_id" element={<DailyCharges />} />
        <Route path="discharge/:visit_id" element={<DischargePage />} />
        <Route path="ip-bill/:visit_id" element={<IPBillPage />} />

        {/* PRESCRIPTIONS & INVENTORY */}
        <Route path="prescriptions" element={<PrescriptionPage />} />
        <Route path="inventory-requests" element={<InventoryRequestPage />} />

        {/* PATIENT */}
        <Route path="patient-portal" element={<PatientPortal />} />

        {/* DOCTOR */}
        <Route path="doctor-dashboard" element={<DoctorDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;