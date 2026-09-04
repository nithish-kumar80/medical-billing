/**
 * seedCodes.js — Run once after deployment
 * Usage: node backend/scripts/seedCodes.js
 *
 * Seeds ~200 common ICD-10-CM codes (CMS public domain)
 * and ~30 HCPCS Level II codes (CMS public domain).
 *
 * NOTE: CPT codes (AMA-copyrighted) are NOT included.
 * Obtain an AMA CPT license before production claims submission.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const IcdCode  = require("../models/IcdCode");
const CptCode  = require("../models/CptCode");

// ──────────────────────────────────────────────
// 200 common ICD-10-CM codes (CMS public domain)
// ──────────────────────────────────────────────
const ICD_CODES = [
  // Infectious diseases
  { code: "A00.0",  description: "Cholera due to Vibrio cholerae 01, biovar cholerae" },
  { code: "A01.0",  description: "Typhoid fever" },
  { code: "A02.0",  description: "Salmonella enteritis" },
  { code: "A04.7",  description: "Enterocolitis due to Clostridium difficile" },
  { code: "A09",    description: "Infectious gastroenteritis and colitis, unspecified" },
  { code: "A15.0",  description: "Tuberculosis of lung" },
  { code: "A36.0",  description: "Pharyngeal diphtheria" },
  { code: "A37.01", description: "Whooping cough due to Bordetella pertussis with pneumonia" },
  { code: "A40.0",  description: "Sepsis due to streptococcus, group A" },
  { code: "A41.9",  description: "Sepsis, unspecified organism" },
  { code: "A49.0",  description: "Staphylococcal infection, unspecified site" },
  { code: "A50.0",  description: "Early congenital syphilis, symptomatic" },
  { code: "A63.0",  description: "Anogenital (venereal) warts" },
  { code: "A77.0",  description: "Spotted fever due to Rickettsia rickettsii" },
  { code: "A80.0",  description: "Acute paralytic poliomyelitis, vaccine-associated" },
  { code: "A90",    description: "Dengue fever (classical dengue)" },
  { code: "A91",    description: "Dengue hemorrhagic fever" },
  { code: "B00.0",  description: "Eczema herpeticum" },
  { code: "B01.9",  description: "Varicella without complication" },
  { code: "B02.9",  description: "Zoster without complications" },
  { code: "B05.9",  description: "Measles without complication" },
  { code: "B06.9",  description: "Rubella without complication" },
  { code: "B15.9",  description: "Hepatitis A without hepatic coma" },
  { code: "B16.9",  description: "Acute hepatitis B without delta-agent and without hepatic coma" },
  { code: "B18.1",  description: "Chronic viral hepatitis B without delta-agent" },
  { code: "B20",    description: "Human immunodeficiency virus (HIV) disease" },
  { code: "B34.9",  description: "Viral infection, unspecified" },
  { code: "B35.0",  description: "Tinea barbae and tinea capitis" },
  { code: "B49",    description: "Unspecified mycosis" },
  // Neoplasms
  { code: "C00.0",  description: "Malignant neoplasm of external upper lip" },
  { code: "C18.0",  description: "Malignant neoplasm of cecum" },
  { code: "C18.9",  description: "Malignant neoplasm of colon, unspecified" },
  { code: "C20",    description: "Malignant neoplasm of rectum" },
  { code: "C34.10", description: "Malignant neoplasm of upper lobe, unspecified bronchus or lung" },
  { code: "C50.911",description: "Malignant neoplasm of unspecified site of right female breast" },
  { code: "C61",    description: "Malignant neoplasm of prostate" },
  { code: "C73",    description: "Malignant neoplasm of thyroid gland" },
  { code: "C80.1",  description: "Malignant (primary) neoplasm, unspecified" },
  { code: "C90.00", description: "Multiple myeloma not having achieved remission" },
  { code: "C91.00", description: "Acute lymphoblastic leukemia not having achieved remission" },
  // Blood / immune
  { code: "D50.0",  description: "Iron deficiency anemia secondary to blood loss (chronic)" },
  { code: "D50.9",  description: "Iron deficiency anemia, unspecified" },
  { code: "D51.0",  description: "Vitamin B12 deficiency anemia due to intrinsic factor deficiency" },
  { code: "D55.0",  description: "Anemia due to glucose-6-phosphate dehydrogenase deficiency" },
  { code: "D64.9",  description: "Anemia, unspecified" },
  { code: "D69.3",  description: "Immune thrombocytopenic purpura" },
  { code: "D89.9",  description: "Disorder involving the immune mechanism, unspecified" },
  // Endocrine / metabolic
  { code: "E10.9",  description: "Type 1 diabetes mellitus without complications" },
  { code: "E11.9",  description: "Type 2 diabetes mellitus without complications" },
  { code: "E11.65", description: "Type 2 diabetes mellitus with hyperglycemia" },
  { code: "E13.9",  description: "Other specified diabetes mellitus without complications" },
  { code: "E03.9",  description: "Hypothyroidism, unspecified" },
  { code: "E05.90", description: "Thyrotoxicosis, unspecified, without thyrotoxic crisis" },
  { code: "E06.3",  description: "Autoimmune thyroiditis" },
  { code: "E11.40", description: "Type 2 diabetes mellitus with diabetic neuropathy, unspecified" },
  { code: "E11.51", description: "Type 2 diabetes mellitus with diabetic peripheral angiopathy without gangrene" },
  { code: "E66.9",  description: "Obesity, unspecified" },
  { code: "E78.5",  description: "Hyperlipidemia, unspecified" },
  { code: "E83.51", description: "Hypocalcemia" },
  { code: "E86.0",  description: "Dehydration" },
  { code: "E87.1",  description: "Hypo-osmolality and hyponatremia" },
  { code: "E87.6",  description: "Hypokalemia" },
  // Mental / behavioral
  { code: "F10.20", description: "Alcohol dependence, uncomplicated" },
  { code: "F20.9",  description: "Schizophrenia, unspecified" },
  { code: "F31.9",  description: "Bipolar disorder, unspecified" },
  { code: "F32.9",  description: "Major depressive disorder, single episode, unspecified" },
  { code: "F33.0",  description: "Major depressive disorder, recurrent, mild" },
  { code: "F40.10", description: "Social phobia, unspecified" },
  { code: "F41.0",  description: "Panic disorder without agoraphobia" },
  { code: "F41.1",  description: "Generalized anxiety disorder" },
  { code: "F43.10", description: "Post-traumatic stress disorder, unspecified" },
  { code: "F50.00", description: "Anorexia nervosa, unspecified" },
  // Nervous system
  { code: "G20",    description: "Parkinson's disease" },
  { code: "G30.9",  description: "Alzheimer's disease, unspecified" },
  { code: "G35",    description: "Multiple sclerosis" },
  { code: "G40.909",description: "Epilepsy, unspecified, not intractable, without status epilepticus" },
  { code: "G43.909",description: "Migraine, unspecified, not intractable, without status migrainosus" },
  { code: "G47.00", description: "Insomnia, unspecified" },
  { code: "G47.30", description: "Sleep apnea, unspecified" },
  { code: "G62.9",  description: "Polyneuropathy, unspecified" },
  // Eye
  { code: "H25.10", description: "Age-related nuclear cataract, unspecified eye" },
  { code: "H26.9",  description: "Unspecified cataract" },
  { code: "H35.30", description: "Unspecified macular degeneration" },
  { code: "H40.10X0",description:"Open-angle glaucoma, unspecified, stage unspecified" },
  // Ear
  { code: "H60.90", description: "Unspecified otitis externa, unspecified ear" },
  { code: "H65.90", description: "Unspecified nonsuppurative otitis media, unspecified ear" },
  { code: "H66.90", description: "Otitis media, unspecified, unspecified ear" },
  { code: "H81.10", description: "Benign paroxysmal vertigo, unspecified ear" },
  // Circulatory
  { code: "I10",    description: "Essential (primary) hypertension" },
  { code: "I11.9",  description: "Hypertensive heart disease without heart failure" },
  { code: "I20.9",  description: "Angina pectoris, unspecified" },
  { code: "I21.9",  description: "Acute myocardial infarction, unspecified" },
  { code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery without angina pectoris" },
  { code: "I26.99", description: "Other pulmonary embolism without acute cor pulmonale" },
  { code: "I35.0",  description: "Nonrheumatic aortic (valve) stenosis" },
  { code: "I42.0",  description: "Dilated cardiomyopathy" },
  { code: "I48.0",  description: "Paroxysmal atrial fibrillation" },
  { code: "I48.91", description: "Unspecified atrial fibrillation" },
  { code: "I50.9",  description: "Heart failure, unspecified" },
  { code: "I63.9",  description: "Cerebral infarction, unspecified" },
  { code: "I64",    description: "Stroke, not specified as haemorrhage or infarction" },
  { code: "I70.0",  description: "Atherosclerosis of aorta" },
  { code: "I82.401",description: "Acute embolism and thrombosis of unspecified deep veins of right lower extremity" },
  // Respiratory
  { code: "J00",    description: "Acute nasopharyngitis (common cold)" },
  { code: "J01.90", description: "Acute sinusitis, unspecified" },
  { code: "J02.9",  description: "Acute pharyngitis, unspecified" },
  { code: "J03.90", description: "Acute tonsillitis, unspecified" },
  { code: "J06.9",  description: "Acute upper respiratory infection, unspecified" },
  { code: "J18.9",  description: "Pneumonia, unspecified organism" },
  { code: "J20.9",  description: "Acute bronchitis, unspecified" },
  { code: "J30.9",  description: "Allergic rhinitis, unspecified" },
  { code: "J44.0",  description: "Chronic obstructive pulmonary disease with acute lower respiratory infection" },
  { code: "J44.1",  description: "Chronic obstructive pulmonary disease with (acute) exacerbation" },
  { code: "J45.20", description: "Mild intermittent asthma, uncomplicated" },
  { code: "J45.40", description: "Moderate persistent asthma, uncomplicated" },
  { code: "J45.50", description: "Severe persistent asthma, uncomplicated" },
  { code: "J80",    description: "Acute respiratory distress syndrome" },
  { code: "J96.00", description: "Acute respiratory failure, unspecified whether with hypoxia or hypercapnia" },
  // Digestive
  { code: "K21.0",  description: "Gastro-oesophageal reflux disease with oesophagitis" },
  { code: "K21.9",  description: "Gastro-oesophageal reflux disease without oesophagitis" },
  { code: "K25.0",  description: "Gastric ulcer, acute with haemorrhage" },
  { code: "K29.70", description: "Gastritis, unspecified, without bleeding" },
  { code: "K35.80", description: "Other and unspecified acute appendicitis without abscess" },
  { code: "K40.90", description: "Unilateral inguinal hernia, without obstruction or gangrene, not specified as recurrent" },
  { code: "K50.90", description: "Crohn's disease of small intestine without complications" },
  { code: "K51.90", description: "Ulcerative colitis, unspecified, without complications" },
  { code: "K57.30", description: "Diverticulosis of large intestine without perforation or abscess without bleeding" },
  { code: "K70.30", description: "Alcoholic cirrhosis of liver without ascites" },
  { code: "K72.10", description: "Chronic hepatic failure without coma" },
  { code: "K74.60", description: "Unspecified cirrhosis of liver" },
  { code: "K80.20", description: "Calculus of gallbladder without cholecystitis without obstruction" },
  { code: "K85.90", description: "Acute pancreatitis without necrosis or infection, unspecified" },
  { code: "K92.1",  description: "Melaena" },
  // Skin
  { code: "L02.91", description: "Cutaneous abscess, unspecified" },
  { code: "L03.90", description: "Cellulitis, unspecified" },
  { code: "L20.9",  description: "Atopic dermatitis, unspecified" },
  { code: "L40.0",  description: "Psoriasis vulgaris" },
  { code: "L50.9",  description: "Urticaria, unspecified" },
  { code: "L70.0",  description: "Acne vulgaris" },
  // Musculoskeletal
  { code: "M06.9",  description: "Rheumatoid arthritis, unspecified" },
  { code: "M10.9",  description: "Gout, unspecified" },
  { code: "M15.9",  description: "Polyosteoarthritis, unspecified" },
  { code: "M16.9",  description: "Osteoarthritis of hip, unspecified" },
  { code: "M17.9",  description: "Osteoarthritis of knee, unspecified" },
  { code: "M19.90", description: "Primary osteoarthritis, unspecified site" },
  { code: "M25.511",description: "Pain in right shoulder" },
  { code: "M25.561",description: "Pain in right knee" },
  { code: "M41.20", description: "Other idiopathic scoliosis, site unspecified" },
  { code: "M47.816",description: "Spondylosis without myelopathy or radiculopathy, lumbar region" },
  { code: "M54.5",  description: "Low back pain" },
  { code: "M54.2",  description: "Cervicalgia" },
  { code: "M79.3",  description: "Panniculitis, unspecified" },
  { code: "M80.00XA",description:"Age-related osteoporosis with current pathological fracture, unspecified site" },
  { code: "M81.0",  description: "Age-related osteoporosis without current pathological fracture" },
  // Genitourinary
  { code: "N00.9",  description: "Acute nephritic syndrome with unspecified morphological changes" },
  { code: "N18.3",  description: "Chronic kidney disease, stage 3 (moderate)" },
  { code: "N18.9",  description: "Chronic kidney disease, unspecified" },
  { code: "N20.0",  description: "Calculus of kidney" },
  { code: "N20.9",  description: "Urinary calculus, unspecified" },
  { code: "N30.00", description: "Acute cystitis without hematuria" },
  { code: "N39.0",  description: "Urinary tract infection, site not specified" },
  { code: "N40.0",  description: "Benign prostatic hyperplasia without lower urinary tract symptoms" },
  { code: "N92.0",  description: "Excessive and frequent menstruation with regular cycle" },
  { code: "N95.1",  description: "Menopausal and female climacteric states" },
  // Pregnancy
  { code: "O00.10", description: "Tubal pregnancy without intrauterine pregnancy" },
  { code: "O10.012",description: "Pre-existing essential hypertension complicating pregnancy, second trimester" },
  { code: "O24.010",description: "Pre-existing type 1 diabetes mellitus in pregnancy, unspecified trimester" },
  { code: "O30.003",description: "Twin pregnancy, unspecified number of placenta, unspecified number of amniotic sacs, third trimester" },
  // Perinatal
  { code: "P07.30", description: "Preterm newborn, unspecified weeks of gestation" },
  { code: "P22.0",  description: "Respiratory distress syndrome of newborn" },
  { code: "P36.9",  description: "Bacterial sepsis of newborn, unspecified" },
  // Congenital
  { code: "Q00.0",  description: "Anencephaly" },
  { code: "Q21.0",  description: "Ventricular septal defect" },
  { code: "Q90.9",  description: "Down syndrome, unspecified" },
  // Injury / poisoning
  { code: "S00.00XA",description:"Unspecified superficial injury of scalp, initial encounter" },
  { code: "S06.0X0A",description:"Concussion without loss of consciousness, initial encounter" },
  { code: "S09.90XA",description:"Unspecified injury of head, initial encounter" },
  { code: "S22.000A",description:"Wedge compression fracture of unspecified thoracic vertebra, initial encounter for closed fracture" },
  { code: "S52.001A",description:"Fracture of upper end of right ulna, initial encounter for closed fracture" },
  { code: "S72.001A",description:"Fracture of unspecified part of neck of right femur, initial encounter for closed fracture" },
  { code: "S80.00XA",description:"Contusion of unspecified knee, initial encounter" },
  { code: "S82.001A",description:"Displaced fracture of right patella, initial encounter for closed fracture" },
  { code: "S92.001A",description:"Displaced fracture of medial tuberosity of right calcaneus, initial encounter for closed fracture" },
  { code: "T07.XXXA",description:"Unspecified multiple injuries, initial encounter" },
  { code: "T14.90",  description: "Injury, unspecified" },
  { code: "T78.40XA",description:"Allergy, unspecified, initial encounter" },
  { code: "T78.41XA",description:"Anaphylaxis, initial encounter" },
  // Factors influencing health
  { code: "Z00.00", description: "Encounter for general adult medical examination without abnormal findings" },
  { code: "Z00.01", description: "Encounter for general adult medical examination with abnormal findings" },
  { code: "Z00.110",description: "Health examination for newborn under 8 days old" },
  { code: "Z11.1",  description: "Encounter for screening for respiratory tuberculosis" },
  { code: "Z11.3",  description: "Encounter for screening for infections with a predominantly sexual mode of transmission" },
  { code: "Z12.11", description: "Encounter for screening for malignant neoplasm of colon" },
  { code: "Z12.31", description: "Encounter for screening mammogram for malignant neoplasm of breast" },
  { code: "Z23",    description: "Encounter for immunization" },
  { code: "Z48.01", description: "Encounter for change or removal of surgical wound dressing" },
  { code: "Z51.11", description: "Encounter for antineoplastic chemotherapy" },
  { code: "Z51.12", description: "Encounter for antineoplastic immunotherapy" },
  { code: "Z71.3",  description: "Dietary counseling and surveillance" },
  { code: "Z79.4",  description: "Long term (current) use of insulin" },
  { code: "Z87.891",description: "Personal history of nicotine dependence" },
  { code: "Z96.641",description: "Presence of right artificial knee joint" },
];

// ──────────────────────────────────────────────
// 30 HCPCS Level II codes (CMS public domain)
// ──────────────────────────────────────────────
const HCPCS_CODES = [
  { code: "A4253", description: "Blood glucose test or reagent strips for home blood glucose monitor, per 50 strips", codeSystem: "HCPCS" },
  { code: "A4570", description: "Splint", codeSystem: "HCPCS" },
  { code: "A4590", description: "Special casting material (e.g. fiberglass)", codeSystem: "HCPCS" },
  { code: "A6216", description: "Gauze, non-impregnated, sterile, pad size 16 sq. in. or less, without adhesive border", codeSystem: "HCPCS" },
  { code: "A9150", description: "Non-prescription drugs", codeSystem: "HCPCS" },
  { code: "B4034", description: "Enteral feeding supply kit: syringe fed, per day", codeSystem: "HCPCS" },
  { code: "D0150", description: "Comprehensive oral evaluation — new or established patient", codeSystem: "HCPCS" },
  { code: "E0100", description: "Cane, includes canes of all materials, adjustable or fixed, with tip", codeSystem: "HCPCS" },
  { code: "E0105", description: "Cane, quad or three-prong, includes canes of all materials, adjustable or fixed, with tips", codeSystem: "HCPCS" },
  { code: "E0110", description: "Crutches, forearm, includes crutches of various materials, adjustable or fixed, pair, complete with tips and handgrips", codeSystem: "HCPCS" },
  { code: "E0130", description: "Walker, rigid (pickup), adjustable or fixed height", codeSystem: "HCPCS" },
  { code: "E0143", description: "Walker, folding (pickup), adjustable or fixed height", codeSystem: "HCPCS" },
  { code: "E0155", description: "Wheel attachment, rigid, for use with walker, any type, each", codeSystem: "HCPCS" },
  { code: "E0250", description: "Hospital bed, fixed height, with any type side rails, with mattress", codeSystem: "HCPCS" },
  { code: "E0560", description: "Humidifier, durable, for supplemental humidification during IPPB treatment or oxygen delivery", codeSystem: "HCPCS" },
  { code: "E0601", description: "Continuous airway pressure (CPAP) device", codeSystem: "HCPCS" },
  { code: "E1399", description: "Durable medical equipment, miscellaneous", codeSystem: "HCPCS" },
  { code: "G0008", description: "Administration of influenza virus vaccine", codeSystem: "HCPCS" },
  { code: "G0009", description: "Administration of pneumococcal vaccine", codeSystem: "HCPCS" },
  { code: "G0010", description: "Administration of hepatitis B vaccine", codeSystem: "HCPCS" },
  { code: "G0101", description: "Cervical or vaginal cancer screening; pelvic and clinical breast examination", codeSystem: "HCPCS" },
  { code: "G0102", description: "Prostate cancer screening; digital rectal examination", codeSystem: "HCPCS" },
  { code: "G0180", description: "Physician certification for Medicare-covered home health service (patient not present) per certification period", codeSystem: "HCPCS" },
  { code: "G0248", description: "Demonstration, prior to initiation of home INR monitoring for patient with mechanical heart valve(s)", codeSystem: "HCPCS" },
  { code: "J0878", description: "Injection, daptomycin, 1 mg", codeSystem: "HCPCS" },
  { code: "J1040", description: "Injection, methylprednisolone acetate, 80 mg", codeSystem: "HCPCS" },
  { code: "J3420", description: "Injection, vitamin B-12 cyanocobalamin, up to 1,000 mcg", codeSystem: "HCPCS" },
  { code: "M0064", description: "Brief office visit for the sole purpose of monitoring or changing drug prescriptions used in the treatment of mental psychoneurotic and personality disorders", codeSystem: "HCPCS" },
  { code: "S0020", description: "Injection, bupivacaine hydrochloride, 30 ml", codeSystem: "HCPCS" },
  { code: "V2020", description: "Frames, purchases", codeSystem: "HCPCS" },
];

async function seed() {
  try {
    console.log("🔗 Connecting to MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected.");

    // ── ICD codes ──
    let icdInserted = 0, icdSkipped = 0;
    for (const c of ICD_CODES) {
      try {
        await IcdCode.updateOne({ code: c.code }, { $setOnInsert: c }, { upsert: true });
        icdInserted++;
      } catch { icdSkipped++; }
    }
    console.log(`✅ ICD-10-CM: ${icdInserted} upserted, ${icdSkipped} skipped.`);

    // ── HCPCS codes ──
    let hcpcsInserted = 0, hcpcsSkipped = 0;
    for (const c of HCPCS_CODES) {
      try {
        await CptCode.updateOne({ code: c.code }, { $setOnInsert: c }, { upsert: true });
        hcpcsInserted++;
      } catch { hcpcsSkipped++; }
    }
    console.log(`✅ HCPCS Level II: ${hcpcsInserted} upserted, ${hcpcsSkipped} skipped.`);

    console.log("🎉 Seed complete.");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
