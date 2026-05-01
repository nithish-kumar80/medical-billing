const express = require("express");
const router = express.Router();

const Patient = require("../models/Patient");
const Visit = require("../models/Visit");
const Billing = require("../models/Billing");
const Treatment = require("../models/Treatment");
const Diagnosis = require("../models/Diagnosis");
const Claim = require("../models/Claim");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const InventoryRequest = require("../models/InventoryRequest");




// =============================
// 🧍 PATIENT ROUTES
// =============================

// CREATE PATIENT
router.post("/patients", async (req, res) => {
  try {
    const count = await Patient.countDocuments();
    const year = new Date().getFullYear();

    const patientId = `PAT-${year}-${String(count + 1).padStart(4, "0")}`;

    const newPatient = new Patient({
      patient_id: patientId,
      ...req.body
    });

    await newPatient.save();

    res.json({
      message: "Patient created",
      patient: newPatient
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating patient");
  }
});


// GET ALL PATIENTS
router.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching patients");
  }
});


// =============================
// 🏥 VISIT ROUTES
// =============================

// CREATE VISIT
router.post("/visits", async (req, res) => {
  console.log("VISIT BODY:", req.body);
  try {
    if (!req.body.patient_id) {
      return res.status(400).send("patient_id is required");
    }

    const count = await Visit.countDocuments();
    const year = new Date().getFullYear();

    const visitId = `VIS-${year}-${String(count + 1).padStart(4, "0")}`;

    const newVisit = new Visit({
      visit_id: visitId,
      patient_id: req.body.patient_id
    });

    await newVisit.save();

    // ✅ IMPORTANT FIX
    res.json({
      message: "Visit created",
      visitId: visitId
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating visit");
  }
});


// =============================
// 📜 PATIENT HISTORY
// =============================

router.get("/patient-history/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patient_id: req.params.id });
    const visits = await Visit.find({ patient_id: req.params.id });

    const totalBill = visits.reduce((sum, v) => sum + (v.amount || 0), 0);

    res.json({
      patient,
      visits,
      totalBill
    });

  } catch (err) {
    console.error("HISTORY ERROR:", err);
    res.status(500).send("Error fetching history");
  }
});


// =============================
// 🧾 DIAGNOSIS ROUTES
// =============================

// ADD DIAGNOSIS
router.post("/diagnosis", async (req, res) => {
  try {
    if (!req.body.visit_id) {
      return res.status(400).send("visit_id is required");
    }

    const newDiagnosis = new Diagnosis(req.body);
    await newDiagnosis.save();

    res.json({
      message: "Diagnosis added",
      data: newDiagnosis
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding diagnosis");
  }
});


// GET DIAGNOSIS BY VISIT
router.get("/diagnosis/:visit_id", async (req, res) => {
  try {
    const data = await Diagnosis.find({ visit_id: req.params.visit_id });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching diagnosis");
  }
});


// =============================
// 💉 TREATMENT ROUTES
// =============================

// ADD TREATMENT
router.post("/treatments", async (req, res) => {
  try {
    if (!req.body.visit_id) {
      return res.status(400).send("visit_id is required");
    }

    const newTreatment = new Treatment(req.body);
    await newTreatment.save();

    res.json({
      message: "Treatment added",
      data: newTreatment
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding treatment");
  }
});


// GET TREATMENTS BY VISIT
router.get("/treatments/:visit_id", async (req, res) => {
  try {
    const data = await Treatment.find({ visit_id: req.params.visit_id });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching treatments");
  }
});


// =============================
// 💰 BILLING ROUTES
// =============================

// GENERATE BILL
router.post("/billing/:visit_id", async (req, res) => {
  try {
    const visitId = req.params.visit_id;

    const treatments = await Treatment.find({ visit_id: visitId });

    const total = treatments.reduce((sum, t) => sum + (t.cost || 0), 0);

    const newBill = new Billing({
      visit_id: visitId,
      patient_id: req.body.patient_id,
      total_amount: total,
      status: "Pending"
    });

    await newBill.save();

    res.json({
      message: "Bill generated",
      bill: newBill
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating bill");
  }
});


// GET BILL
router.get("/billing/:visit_id", async (req, res) => {
  try {
    const visitId = req.params.visit_id;

    const visit = await Visit.findOne({ visit_id: visitId });

    if (!visit) {
      return res.status(404).send("Visit not found");
    }

    const patient = await Patient.findOne({
      patient_id: visit.patient_id
    });

    const diagnosis = await Diagnosis.find({ visit_id: visitId });
    const treatments = await Treatment.find({ visit_id: visitId });

    const total = treatments.reduce(
      (sum, t) => sum + (t.cost || 0),
      0
    );

    // ✅ CHECK IF BILL EXISTS
    let bill = await Billing.findOne({ visit_id: visitId });

    // ✅ AUTO CREATE IF NOT EXISTS
    if (!bill) {
      bill = new Billing({
        visit_id: visitId,
        patient_id: visit.patient_id,
        total_amount: total,
        status: "Pending"
      });

      await bill.save();
    }

    res.json({
      bill,
      patient,
      visit,
      diagnosis,
      treatments,
      total
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching invoice");
  }
});


// MARK BILL AS PAID
router.put("/billing/pay/:visit_id", async (req, res) => {
  try {
    await Billing.findOneAndUpdate(
      { visit_id: req.params.visit_id },
      { status: "Paid" }
    );

    res.send("Payment updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating payment");
  }
});


// =============================
// 📊 DASHBOARD
// =============================

router.get("/dashboard", async (req, res) => {
  try {
    const patients = await Patient.countDocuments();
    const visits = await Visit.countDocuments();

    const bills = await Billing.find();
    const claims = await Claim.find();
    const appointments = await Appointment.find(); // ✅ NEW

    // 🔹 Total revenue
    const revenue = bills.reduce(
      (sum, b) => sum + (b.total_amount || 0),
      0
    );

    // 🔹 Revenue chart data (last 5)
    const revenueData = bills.slice(-5).map((b, i) => ({
      name: `Bill ${i + 1}`,
      amount: b.total_amount
    }));

    // 🔹 Claims chart
    const claimStats = {
      approved: claims.filter(c => c.status === "Approved").length,
      pending: claims.filter(c => c.status === "Pending").length,
      rejected: claims.filter(c => c.status === "Rejected").length
    };

    // ✅ TODAY APPOINTMENTS
    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = appointments.filter(
      (a) => a.date === today
    ).length;

    // ✅ OP / IP logic (REAL counts)
    const ipCount = await Visit.countDocuments({ admitted: true });
    const opCount = visits - ipCount;
    const currentlyAdmitted = await Visit.countDocuments({ admitted: true, "dischargeDetails.dischargeDate": { $exists: false } });

    // ✅ FINAL RESPONSE (MERGED)
    res.json({
      totalPatients: patients,
      totalVisits: visits,
      totalRevenue: revenue,
      revenueData,
      claimStats,
      opPatients: opCount,
      ipPatients: ipCount,
      currentlyAdmitted,
      todayAppointments
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Dashboard error");
  }
});

router.post("/claims/:visit_id", async (req, res) => {
  try {
    const visitId = req.params.visit_id;

    const visit = await Visit.findOne({ visit_id: visitId });

    if (!visit) {
      return res.status(404).send("Visit not found");
    }

    const bill = await Billing.findOne({ visit_id: visitId });

    const count = await Claim.countDocuments();
    const year = new Date().getFullYear();

    const claimId = `CLM-${year}-${String(count + 1).padStart(4, "0")}`;

    const newClaim = new Claim({
      claim_id: claimId,
      visit_id: visitId,
      patient_id: visit.patient_id,
      provider: req.body.provider,
      payer: req.body.payer,
      total_amount: bill?.total_amount || 0
    });

    await newClaim.save();

    res.json(newClaim);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating claim");
  }
});

router.get("/claims", async (req, res) => {
  try {
    const claims = await Claim.find();
    res.json(claims);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).send("Server Error");
  }
});

// ✅ UPDATE CLAIM STATUS
router.put("/claims/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedClaim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedClaim) {
      return res.status(404).send("Claim not found");
    }

    res.json(updatedClaim);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).send("Error updating claim");
  }
});

// =============================
// 📅 APPOINTMENT ROUTES
// =============================

// CREATE APPOINTMENT
router.post("/appointments", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    res.json({
      message: "Appointment created",
      data: newAppointment
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating appointment");
  }
});

// GET ALL APPOINTMENTS
router.get("/appointments", async (req, res) => {
  try {
    const data = await Appointment.find();
    res.json(data);
  } catch (err) {
    console.error("GET /appointments error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET TODAY'S APPOINTMENTS FOR ADMIN (must be before parameterized routes)
router.get("/appointments/today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const data = await Appointment.find({ date: today });
    res.json(data);
  } catch (err) {
    console.error("GET /appointments/today error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET APPOINTMENTS BY PATIENT (by name, encoded in URL)
router.get("/appointments/patient/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    console.log("🔍 Looking up patient appointments for:", name);
    const data = await Appointment.find({ patient_id: name });
    console.log("📋 Found:", data.length, "appointments");
    res.json(data);
  } catch (err) {
    console.error("Patient appointments error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET APPOINTMENTS BY DOCTOR (by name, encoded in URL)
router.get("/appointments/doctor/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    console.log("🔍 Looking up doctor appointments for:", name);
    const data = await Appointment.find({ doctor_name: name });
    console.log("📋 Found:", data.length, "appointments");
    res.json(data);
  } catch (err) {
    console.error("Doctor appointments error:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE APPOINTMENT STATUS
router.patch("/appointments/:id/status", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send("Error updating appointment status");
  }
});

// =============================
// 🗂 NATIVE PATIENT HISTORY (READ-ONLY LOOKUP BY NAME)
// =============================
router.get("/history/patient/:name", async (req, res) => {
  try {
    const patientNameRegex = new RegExp(`^${req.params.name}$`, "i");
    const patient = await Patient.findOne({ name: patientNameRegex });

    if (!patient) {
      return res.json({ patient: null, visits: [], treatments: [], diagnosis: [] });
    }

    const visits = await Visit.find({ patient_id: patient.patient_id }).sort({ visit_date: -1 });
    const visitIds = visits.map(v => v.visit_id);
    const treatments = await Treatment.find({ visit_id: { $in: visitIds } });
    const diagnosis = await Diagnosis.find({ visit_id: { $in: visitIds } });

    res.json({
      patient,
      visits,
      treatments,
      diagnosis
    });

  } catch (err) {
    console.error("HISTORY LOOKUP ERROR:", err);
    res.status(500).send("Error fetching history by name");
  }
});


// =============================
// 🏥 IN-PATIENT (IP) ROUTES
// =============================

// ADMIT PATIENT (mark visit as IP)
router.put("/visits/:visit_id/admit", async (req, res) => {
  try {
    const visit = await Visit.findOne({ visit_id: req.params.visit_id });
    if (!visit) return res.status(404).send("Visit not found");

    visit.admitted = true;
    visit.admissionDetails = {
      admissionDate: req.body.admissionDate || new Date(),
      ward: req.body.ward,
      roomNumber: req.body.roomNumber,
      bedNumber: req.body.bedNumber,
      attendingDoctor: req.body.attendingDoctor
    };
    await visit.save();

    res.json({ message: "Patient admitted", visit });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error admitting patient");
  }
});

// DISCHARGE PATIENT
router.put("/visits/:visit_id/discharge", async (req, res) => {
  try {
    const visit = await Visit.findOne({ visit_id: req.params.visit_id });
    if (!visit) return res.status(404).send("Visit not found");

    visit.dischargeDetails = {
      dischargeDate: req.body.dischargeDate || new Date(),
      summary: req.body.summary,
      finalDiagnosis: req.body.finalDiagnosis
    };
    await visit.save();

    res.json({ message: "Patient discharged", visit });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error discharging patient");
  }
});

// ADD DAILY CHARGE
router.post("/visits/:visit_id/daily-charges", async (req, res) => {
  try {
    const visit = await Visit.findOne({ visit_id: req.params.visit_id });
    if (!visit) return res.status(404).send("Visit not found");

    if (!visit.dailyCharges) visit.dailyCharges = [];
    visit.dailyCharges.push({
      type: req.body.type,
      amount: req.body.amount,
      date: req.body.date || new Date()
    });
    await visit.save();

    res.json({ message: "Daily charge added", visit });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding daily charge");
  }
});

// GET DAILY CHARGES FOR A VISIT
router.get("/visits/:visit_id/daily-charges", async (req, res) => {
  try {
    const visit = await Visit.findOne({ visit_id: req.params.visit_id });
    if (!visit) return res.status(404).send("Visit not found");
    res.json(visit.dailyCharges || []);
  } catch (err) {
    res.status(500).send("Error fetching daily charges");
  }
});

// GET ALL CURRENTLY ADMITTED PATIENTS
router.get("/visits/admitted", async (req, res) => {
  try {
    const admittedVisits = await Visit.find({
      admitted: true,
      "dischargeDetails.dischargeDate": { $exists: false }
    }).sort({ "admissionDetails.admissionDate": -1 });

    // Enrich with patient info
    const enriched = [];
    for (const v of admittedVisits) {
      const patient = await Patient.findOne({ patient_id: v.patient_id });
      enriched.push({ visit: v, patient });
    }
    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching admitted patients");
  }
});

// FINAL IP BILL CALCULATION
router.get("/visits/:visit_id/final-bill", async (req, res) => {
  try {
    const visit = await Visit.findOne({ visit_id: req.params.visit_id });
    if (!visit) return res.status(404).send("Visit not found");

    const treatments = await Treatment.find({ visit_id: req.params.visit_id });
    const treatmentTotal = treatments.reduce((sum, t) => sum + (t.cost || 0), 0);
    const dailyChargesTotal = (visit.dailyCharges || []).reduce((sum, c) => sum + (c.amount || 0), 0);

    let daysAdmitted = 0;
    if (visit.admissionDetails?.admissionDate) {
      const endDate = visit.dischargeDetails?.dischargeDate ? new Date(visit.dischargeDetails.dischargeDate) : new Date();
      daysAdmitted = Math.max(1, Math.ceil((endDate - new Date(visit.admissionDetails.admissionDate)) / (1000 * 60 * 60 * 24)));
    }

    const grandTotal = treatmentTotal + dailyChargesTotal;
    const patient = await Patient.findOne({ patient_id: visit.patient_id });

    res.json({
      visit, patient, treatments,
      treatmentTotal, dailyChargesTotal, daysAdmitted, grandTotal
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error calculating final bill");
  }
});

// =============================
// 💊 PRESCRIPTION ROUTES
// =============================

// CREATE PRESCRIPTION
router.post("/prescriptions", async (req, res) => {
  try {
    const p = new Prescription(req.body);
    await p.save();
    res.json({ message: "Prescription created", data: p });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating prescription");
  }
});

// GET PRESCRIPTIONS BY PATIENT (by patient_id like PAT-XXXX)
router.get("/prescriptions/patient/:patient_id", async (req, res) => {
  try {
    const data = await Prescription.find({ patient_id: req.params.patient_id });
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching prescriptions");
  }
});

// GET PRESCRIPTIONS BY PATIENT NAME (for patient portal)
router.get("/prescriptions/by-name/:name", async (req, res) => {
  try {
    const nameRegex = new RegExp(`^${req.params.name}$`, "i");
    const data = await Prescription.find({ patient_name: nameRegex });
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching prescriptions");
  }
});

// GET PRESCRIPTIONS BY DOCTOR
router.get("/prescriptions/doctor/:uid", async (req, res) => {
  try {
    const data = await Prescription.find({ doctor_user_id: req.params.uid });
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching prescriptions");
  }
});

// =============================
// 📦 INVENTORY REQUEST ROUTES
// =============================

// CREATE REQUEST (doctor)
router.post("/inventory-requests", async (req, res) => {
  try {
    const r = new InventoryRequest(req.body);
    await r.save();
    res.json({ message: "Request submitted", data: r });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating request");
  }
});

// GET ALL REQUESTS (admin)
router.get("/inventory-requests", async (req, res) => {
  try {
    const data = await InventoryRequest.find();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching requests");
  }
});

// GET REQUESTS BY DOCTOR
router.get("/inventory-requests/doctor/:uid", async (req, res) => {
  try {
    const data = await InventoryRequest.find({ requested_by_id: req.params.uid });
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching requests");
  }
});

// UPDATE REQUEST STATUS (admin)
router.patch("/inventory-requests/:id", async (req, res) => {
  try {
    const updated = await InventoryRequest.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
      admin_notes: req.body.admin_notes
    }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send("Error updating request");
  }
});

module.exports = router;
