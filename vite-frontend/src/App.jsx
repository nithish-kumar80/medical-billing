import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patient";
import AddPatient from "./pages/AddPatient";
import PatientHistory from "./pages/PatientHistory";
import AddVisit from "./pages/AddVisit";
import SearchPatient from "./pages/SearchPatient";
import BillingPage from "./pages/BillingPage";
import ClaimsPage from "./pages/ClaimsPage";
import Appointment from "./pages/Appointment";

function App() {
  return (
    <Routes>

      {/* Layout wrapper */}
      <Route path="/" element={<Layout />}>

        {/* Default */}
        <Route index element={<Dashboard />} />

        {/* Pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="add-patient" element={<AddPatient />} />
        <Route path="history/:id" element={<PatientHistory />} />
        <Route path="add-visit/:id" element={<AddVisit />} /> {/* FIXED */}
        <Route path="search" element={<SearchPatient />} />
        <Route path="billing/:visit_id" element={<BillingPage />} />
        <Route path="claims" element={<ClaimsPage />} />
        <Route path="appointment" element={<Appointment />} />
      </Route>

    </Routes>
  );
}

export default App;