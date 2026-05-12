// Contraindication database — medication, condition, and pregnancy
// interactions for the herbs in herbs.ts.
//
// Source priorities (in order of trust):
//   1. NIH National Center for Complementary and Integrative Health (NCCIH)
//   2. Memorial Sloan Kettering "About Herbs" database
//   3. WHO Monographs on Selected Medicinal Plants
//   4. Drugs.com / Lexicomp interaction registries
//
// SEVERITY GRADES
//   - 'severe': avoid combination outright; can cause hospitalization
//   - 'caution': dose-dependent or worth monitoring; consult prescriber
//   - 'mild': watch for symptoms; usually fine at culinary doses
//
// THIS IS NOT MEDICAL ADVICE. The checker surfaces known interactions to
// prompt clinician conversations — it does not replace one.

export type Severity = 'severe' | 'caution' | 'mild';

export type ContraindicationRule = {
  herbSlug: string;
  triggerType: 'medication' | 'condition' | 'pregnancy';
  trigger: string;             // slug of medication or condition
  severity: Severity;
  explanation: string;
  source: string;
};

// === MEDICATION CATALOG ===
// Common medications most likely to interact with culinary-dose herbs.
// User selects from this list in the UI.

export type MedicationSlug =
  | 'warfarin' | 'aspirin' | 'eliquis' | 'clopidogrel'
  | 'metformin' | 'insulin' | 'sulfonylurea'
  | 'lisinopril' | 'losartan' | 'amlodipine' | 'metoprolol' | 'hctz'
  | 'atorvastatin' | 'simvastatin'
  | 'levothyroxine' | 'methimazole'
  | 'sertraline' | 'fluoxetine' | 'citalopram'
  | 'lithium'
  | 'tacrolimus' | 'cyclosporine'
  | 'phenytoin' | 'carbamazepine'
  | 'mao-inhibitor';

export const MEDICATIONS: Array<{ slug: MedicationSlug; name: string; category: string }> = [
  // Blood thinners / anticoagulants
  { slug: 'warfarin', name: 'Warfarin (Coumadin)', category: 'Blood thinner' },
  { slug: 'aspirin', name: 'Aspirin (daily low-dose)', category: 'Blood thinner' },
  { slug: 'eliquis', name: 'Apixaban (Eliquis)', category: 'Blood thinner' },
  { slug: 'clopidogrel', name: 'Clopidogrel (Plavix)', category: 'Blood thinner' },
  // Diabetes
  { slug: 'metformin', name: 'Metformin', category: 'Diabetes' },
  { slug: 'insulin', name: 'Insulin (any)', category: 'Diabetes' },
  { slug: 'sulfonylurea', name: 'Sulfonylurea (glipizide, glyburide)', category: 'Diabetes' },
  // Blood pressure
  { slug: 'lisinopril', name: 'Lisinopril (ACE inhibitor)', category: 'Blood pressure' },
  { slug: 'losartan', name: 'Losartan (ARB)', category: 'Blood pressure' },
  { slug: 'amlodipine', name: 'Amlodipine (calcium channel blocker)', category: 'Blood pressure' },
  { slug: 'metoprolol', name: 'Metoprolol (beta blocker)', category: 'Blood pressure' },
  { slug: 'hctz', name: 'Hydrochlorothiazide (HCTZ)', category: 'Blood pressure' },
  // Cholesterol
  { slug: 'atorvastatin', name: 'Atorvastatin (Lipitor)', category: 'Cholesterol' },
  { slug: 'simvastatin', name: 'Simvastatin', category: 'Cholesterol' },
  // Thyroid
  { slug: 'levothyroxine', name: 'Levothyroxine (Synthroid)', category: 'Thyroid' },
  { slug: 'methimazole', name: 'Methimazole', category: 'Thyroid' },
  // Mental health
  { slug: 'sertraline', name: 'Sertraline (Zoloft) — SSRI', category: 'Antidepressant' },
  { slug: 'fluoxetine', name: 'Fluoxetine (Prozac) — SSRI', category: 'Antidepressant' },
  { slug: 'citalopram', name: 'Citalopram (Celexa) — SSRI', category: 'Antidepressant' },
  { slug: 'lithium', name: 'Lithium', category: 'Mood stabilizer' },
  // Immune
  { slug: 'tacrolimus', name: 'Tacrolimus (transplant)', category: 'Immunosuppressant' },
  { slug: 'cyclosporine', name: 'Cyclosporine (transplant)', category: 'Immunosuppressant' },
  // Seizure
  { slug: 'phenytoin', name: 'Phenytoin (seizure)', category: 'Anticonvulsant' },
  { slug: 'carbamazepine', name: 'Carbamazepine (seizure / mood)', category: 'Anticonvulsant' },
  { slug: 'mao-inhibitor', name: 'MAO Inhibitor (rare)', category: 'Antidepressant' },
];

// === USER-FACING CONDITION CATALOG ===
export type UserConditionSlug =
  | 'pregnancy' | 'breastfeeding'
  | 'gallstones' | 'kidney-stones'
  | 'hyperthyroid' | 'hypothyroid'
  | 'hypertension'
  | 'gerd' | 'ulcer'
  | 'autoimmune-active-flare'
  | 'pre-surgery-2-weeks';

export const USER_CONDITIONS: Array<{ slug: UserConditionSlug; name: string }> = [
  { slug: 'pregnancy', name: 'Currently pregnant' },
  { slug: 'breastfeeding', name: 'Currently breastfeeding' },
  { slug: 'gallstones', name: 'Gallstones / gallbladder removed' },
  { slug: 'kidney-stones', name: 'Kidney stones (history)' },
  { slug: 'hyperthyroid', name: 'Hyperthyroidism / Graves' },
  { slug: 'hypothyroid', name: 'Hypothyroidism / Hashimoto' },
  { slug: 'hypertension', name: 'High blood pressure' },
  { slug: 'gerd', name: 'GERD / acid reflux (active)' },
  { slug: 'ulcer', name: 'Peptic ulcer (active)' },
  { slug: 'autoimmune-active-flare', name: 'Autoimmune condition (active flare)' },
  { slug: 'pre-surgery-2-weeks', name: 'Surgery scheduled within 2 weeks' },
];

// === CONTRAINDICATION RULES ===
// Cross-reference for the herbs documented in herbs.ts. Sourced rules.

export const CONTRAINDICATIONS: ContraindicationRule[] = [
  // TURMERIC
  { herbSlug: 'turmeric', triggerType: 'medication', trigger: 'warfarin', severity: 'severe', explanation: 'High-dose curcumin has mild anticoagulant effect that adds to warfarin. INR can rise unpredictably; bleeding risk increases. Culinary use (1/2 tsp/day) is usually safe; therapeutic supplementation requires INR re-monitoring.', source: 'NIH NCCIH; Memorial Sloan Kettering' },
  { herbSlug: 'turmeric', triggerType: 'medication', trigger: 'aspirin', severity: 'caution', explanation: 'Additive anticoagulant effect. Daily aspirin + therapeutic turmeric doses can prolong bleeding time. Monitor for unusual bruising.', source: 'NIH NCCIH' },
  { herbSlug: 'turmeric', triggerType: 'medication', trigger: 'eliquis', severity: 'severe', explanation: 'Direct oral anticoagulants stack additively with curcumin. Avoid concentrated curcumin supplements.', source: 'Drugs.com interaction registry' },
  { herbSlug: 'turmeric', triggerType: 'medication', trigger: 'clopidogrel', severity: 'severe', explanation: 'Combined antiplatelet effect raises bleeding risk substantially.', source: 'Drugs.com' },
  { herbSlug: 'turmeric', triggerType: 'condition', trigger: 'gallstones', severity: 'severe', explanation: 'Turmeric stimulates bile production. With gallstones present, this can trigger a painful gallstone attack.', source: 'NIH NCCIH' },
  { herbSlug: 'turmeric', triggerType: 'condition', trigger: 'pre-surgery-2-weeks', severity: 'severe', explanation: 'Pause turmeric supplementation 2 weeks before surgery to normalize bleeding parameters.', source: 'Common surgical pre-op guidance' },
  { herbSlug: 'turmeric', triggerType: 'pregnancy', trigger: 'pregnancy', severity: 'caution', explanation: 'Culinary use is fine. Therapeutic supplementation lacks long-term pregnancy safety data — avoid concentrated curcumin extracts.', source: 'WHO Monograph' },

  // GINGER
  { herbSlug: 'ginger', triggerType: 'medication', trigger: 'warfarin', severity: 'caution', explanation: 'Mild antiplatelet activity at high doses. Daily 2+ tsp fresh ginger may slightly extend INR.', source: 'NIH NCCIH' },
  { herbSlug: 'ginger', triggerType: 'medication', trigger: 'aspirin', severity: 'mild', explanation: 'Additive bleeding-time effect at high doses. Usually safe at culinary intake.', source: 'NIH NCCIH' },
  { herbSlug: 'ginger', triggerType: 'medication', trigger: 'metformin', severity: 'caution', explanation: 'Ginger can lower glucose. Combined with metformin, monitor for hypoglycemia symptoms (shakiness, sweating, confusion).', source: 'Drugs.com' },

  // CINNAMON
  { herbSlug: 'cinnamon', triggerType: 'medication', trigger: 'metformin', severity: 'caution', explanation: 'Cinnamon lowers fasting glucose. Combined with metformin, may cause hypoglycemia. Glucose-monitor for first 2 weeks of daily intake.', source: 'NIH NCCIH' },
  { herbSlug: 'cinnamon', triggerType: 'medication', trigger: 'insulin', severity: 'caution', explanation: 'Insulin dosage may need adjustment. Discuss with prescriber.', source: 'Drugs.com' },
  { herbSlug: 'cinnamon', triggerType: 'medication', trigger: 'sulfonylurea', severity: 'caution', explanation: 'Hypoglycemia risk increases. Monitor glucose during first 2 weeks.', source: 'Drugs.com' },

  // GARLIC
  { herbSlug: 'garlic', triggerType: 'medication', trigger: 'warfarin', severity: 'severe', explanation: 'Garlic has measurable anticoagulant effect at supplement doses. Adds to warfarin unpredictably.', source: 'NIH NCCIH' },
  { herbSlug: 'garlic', triggerType: 'medication', trigger: 'aspirin', severity: 'caution', explanation: 'Additive antiplatelet effect. Culinary use is fine; supplements warrant prescriber conversation.', source: 'NIH NCCIH' },
  { herbSlug: 'garlic', triggerType: 'condition', trigger: 'pre-surgery-2-weeks', severity: 'severe', explanation: 'Pause garlic supplements 1 week before surgery. Culinary intake from food is fine.', source: 'AHA pre-op guidance' },

  // ASHWAGANDHA
  { herbSlug: 'ashwagandha', triggerType: 'medication', trigger: 'levothyroxine', severity: 'severe', explanation: 'Ashwagandha boosts thyroid hormone production. Combined with thyroid medication, can cause hyperthyroidism. Requires TSH re-monitoring.', source: 'NIH NCCIH; Memorial Sloan Kettering' },
  { herbSlug: 'ashwagandha', triggerType: 'medication', trigger: 'methimazole', severity: 'severe', explanation: 'Methimazole suppresses thyroid; ashwagandha boosts it. Direct opposition — avoid combination.', source: 'Drugs.com' },
  { herbSlug: 'ashwagandha', triggerType: 'condition', trigger: 'hyperthyroid', severity: 'severe', explanation: 'Ashwagandha worsens hyperthyroid symptoms. Avoid.', source: 'NIH NCCIH' },
  { herbSlug: 'ashwagandha', triggerType: 'condition', trigger: 'autoimmune-active-flare', severity: 'caution', explanation: 'Immune-stimulating effect can worsen autoimmune flares. Pause during active flare; consult specialist.', source: 'Memorial Sloan Kettering' },
  { herbSlug: 'ashwagandha', triggerType: 'pregnancy', trigger: 'pregnancy', severity: 'severe', explanation: 'Avoid in pregnancy — abortifacient at high doses.', source: 'WHO Monograph' },

  // FENUGREEK
  { herbSlug: 'fenugreek', triggerType: 'medication', trigger: 'metformin', severity: 'caution', explanation: 'Lowers blood sugar — combined with metformin can cause hypoglycemia. Monitor glucose for first 2 weeks.', source: 'NIH NCCIH' },
  { herbSlug: 'fenugreek', triggerType: 'medication', trigger: 'insulin', severity: 'caution', explanation: 'Insulin dosage may need adjustment — discuss with prescriber.', source: 'Drugs.com' },
  { herbSlug: 'fenugreek', triggerType: 'medication', trigger: 'warfarin', severity: 'caution', explanation: 'Coumarin content has mild anticoagulant effect at high doses.', source: 'NIH NCCIH' },
  { herbSlug: 'fenugreek', triggerType: 'pregnancy', trigger: 'pregnancy', severity: 'severe', explanation: 'Uterine stimulant. Avoid in pregnancy.', source: 'WHO Monograph' },

  // HIBISCUS
  { herbSlug: 'hibiscus', triggerType: 'medication', trigger: 'lisinopril', severity: 'caution', explanation: 'Hibiscus lowers blood pressure. Combined with ACE inhibitor, can cause hypotension.', source: 'NIH NCCIH' },
  { herbSlug: 'hibiscus', triggerType: 'medication', trigger: 'amlodipine', severity: 'caution', explanation: 'Additive blood-pressure lowering. Monitor for dizziness.', source: 'NIH NCCIH' },
  { herbSlug: 'hibiscus', triggerType: 'medication', trigger: 'hctz', severity: 'caution', explanation: 'Combined diuretic + vasodilation effect. Monitor for low blood pressure.', source: 'Drugs.com' },

  // CAYENNE
  { herbSlug: 'cayenne', triggerType: 'medication', trigger: 'aspirin', severity: 'mild', explanation: 'Mild antiplatelet effect at high doses. Usually fine.', source: 'NIH NCCIH' },
  { herbSlug: 'cayenne', triggerType: 'condition', trigger: 'gerd', severity: 'severe', explanation: 'Capsaicin worsens acid reflux. Avoid during active GERD flares.', source: 'Clinical observation' },
  { herbSlug: 'cayenne', triggerType: 'condition', trigger: 'ulcer', severity: 'severe', explanation: 'Direct irritation to ulcer site. Avoid until healed.', source: 'Clinical observation' },

  // BLACK PEPPER
  { herbSlug: 'black-pepper', triggerType: 'medication', trigger: 'phenytoin', severity: 'caution', explanation: 'Piperine slows phenytoin clearance, potentially raising blood levels. Monitor for drug levels.', source: 'Drugs.com' },
  { herbSlug: 'black-pepper', triggerType: 'condition', trigger: 'gerd', severity: 'mild', explanation: 'Can worsen reflux symptoms. Reduce intake during active flares.', source: 'Clinical observation' },

  // GINSENG
  { herbSlug: 'ginseng', triggerType: 'medication', trigger: 'warfarin', severity: 'severe', explanation: 'Ginseng decreases warfarin effectiveness (lowers INR). Avoid combination.', source: 'NIH NCCIH' },
  { herbSlug: 'ginseng', triggerType: 'medication', trigger: 'mao-inhibitor', severity: 'severe', explanation: 'Can cause hypertensive crisis with MAOIs. Avoid.', source: 'NIH NCCIH' },
  { herbSlug: 'ginseng', triggerType: 'medication', trigger: 'metformin', severity: 'caution', explanation: 'Mild hypoglycemic effect — monitor.', source: 'Drugs.com' },
  { herbSlug: 'ginseng', triggerType: 'medication', trigger: 'sertraline', severity: 'caution', explanation: 'Stimulant-like effect can compound SSRI side effects. Watch for insomnia, anxiety.', source: 'NIH NCCIH' },

  // CLOVE
  { herbSlug: 'clove', triggerType: 'medication', trigger: 'warfarin', severity: 'caution', explanation: 'Eugenol is a mild blood thinner. Therapeutic clove oil doses can extend bleeding time.', source: 'NIH NCCIH' },
  { herbSlug: 'clove', triggerType: 'condition', trigger: 'pre-surgery-2-weeks', severity: 'caution', explanation: 'Pause concentrated clove use 1 week before surgery.', source: 'Common surgical pre-op guidance' },

  // OLIVE OIL
  { herbSlug: 'olive-oil', triggerType: 'medication', trigger: 'hctz', severity: 'mild', explanation: 'Polyphenols can mildly lower BP, additive with diuretics — usually beneficial. Watch for low BP.', source: 'NIH NCCIH' },

  // GREEN TEA
  { herbSlug: 'green-tea', triggerType: 'medication', trigger: 'warfarin', severity: 'caution', explanation: 'Vitamin K content in green tea can reduce warfarin effect. Keep daily intake consistent.', source: 'NIH NCCIH' },
  { herbSlug: 'green-tea', triggerType: 'medication', trigger: 'mao-inhibitor', severity: 'severe', explanation: 'Caffeine + MAOIs can cause hypertensive crisis.', source: 'NIH NCCIH' },
  { herbSlug: 'green-tea', triggerType: 'pregnancy', trigger: 'pregnancy', severity: 'caution', explanation: 'Limit caffeine to <200 mg/day in pregnancy (~2 cups green tea).', source: 'ACOG guidance' },

  // PEPPERMINT
  { herbSlug: 'peppermint', triggerType: 'condition', trigger: 'gerd', severity: 'severe', explanation: 'Peppermint relaxes the lower esophageal sphincter, worsening reflux. Avoid during active GERD.', source: 'Clinical observation' },

  // RAW HONEY
  { herbSlug: 'raw-honey', triggerType: 'pregnancy', trigger: 'pregnancy', severity: 'mild', explanation: 'Safe in pregnancy but never give to infants under 12 months (botulism risk).', source: 'ACOG / AAP guidance' },

  // FENNEL
  { herbSlug: 'fennel', triggerType: 'pregnancy', trigger: 'pregnancy', severity: 'caution', explanation: 'High-dose fennel has phytoestrogenic effect. Culinary use is fine; avoid supplements.', source: 'WHO Monograph' },
];

// === SCANNER FUNCTION ===

export type ContraindicationHit = {
  herbSlug: string;
  rule: ContraindicationRule;
};

export function scanForContraindications(
  ownedHerbs: string[],
  medications: MedicationSlug[],
  conditions: UserConditionSlug[],
): ContraindicationHit[] {
  const hits: ContraindicationHit[] = [];
  const medSet = new Set(medications);
  const condSet = new Set(conditions);
  for (const rule of CONTRAINDICATIONS) {
    if (ownedHerbs.length > 0 && !ownedHerbs.includes(rule.herbSlug)) continue;
    if (rule.triggerType === 'medication' && medSet.has(rule.trigger as MedicationSlug)) {
      hits.push({ herbSlug: rule.herbSlug, rule });
    } else if (rule.triggerType === 'condition' && condSet.has(rule.trigger as UserConditionSlug)) {
      hits.push({ herbSlug: rule.herbSlug, rule });
    } else if (rule.triggerType === 'pregnancy' && condSet.has('pregnancy')) {
      hits.push({ herbSlug: rule.herbSlug, rule });
    }
  }
  return hits;
}

export function severityRank(s: Severity): number {
  return s === 'severe' ? 3 : s === 'caution' ? 2 : 1;
}
