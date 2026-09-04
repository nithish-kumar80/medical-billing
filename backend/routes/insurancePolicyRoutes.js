const express         = require("express");
const router          = express.Router();
const InsurancePolicy = require("../models/InsurancePolicy");
const Patient         = require("../models/Patient");
const AuditLog        = require("../models/AuditLog");

// POST /api/patients/:patientId/insurance-policies
// patientId here is the Patient._id (ObjectId), not the patient_id string
router.post("/patients/:patientId/insurance-policies", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const policy = new InsurancePolicy({
      ...req.body,
      patient: req.params.patientId
    });
    await policy.save();

    await AuditLog.create({
      action: "CREATE_INSURANCE_POLICY",
      entity: "InsurancePolicy",
      entityId: policy._id,
      diff: req.body,
      meta: { patientId: req.params.patientId }
    });

    res.status(201).json(policy);
  } catch (err) {
    console.error("CREATE_POLICY error:", err);
    res.status(500).json({ error: "Error creating insurance policy" });
  }
});

// GET /api/patients/:patientId/insurance-policies
router.get("/patients/:patientId/insurance-policies", async (req, res) => {
  try {
    const policies = await InsurancePolicy
      .find({ patient: req.params.patientId })
      .populate("payer", "payerName payerType electronicPayerId phone")
      .sort({ policyRank: 1 });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: "Error fetching insurance policies" });
  }
});

// PATCH /api/insurance-policies/:id — update a policy
router.patch("/insurance-policies/:id", async (req, res) => {
  try {
    const before = await InsurancePolicy.findById(req.params.id).lean();
    const policy = await InsurancePolicy.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).populate("payer", "payerName payerType");

    if (!policy) return res.status(404).json({ error: "Policy not found" });

    await AuditLog.create({
      action: "UPDATE_INSURANCE_POLICY",
      entity: "InsurancePolicy",
      entityId: policy._id,
      diff: { before, after: req.body }
    });

    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: "Error updating insurance policy" });
  }
});

module.exports = router;
