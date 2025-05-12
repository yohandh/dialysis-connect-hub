
export type CKDStage = {
  stage: number;
  name: string;
  egfrRange: string;
  description: string;
  recommendations: {
    diet: string[];
    lifestyle: string[];
    monitoring: string[];
  };
  keyPoints?: string[]; // Add this optional property
};

export const ckdStages: CKDStage[] = [
  {
    stage: 1,
    name: "Kidney Damage with Normal Function",
    egfrRange: "90 or higher",
    description: "At this early stage, there is mild kidney damage but kidneys still filter blood effectively. Usually no symptoms are present, and detection often occurs during testing for other conditions.",
    recommendations: {
      diet: [
        "Maintain a balanced diet",
        "Limit sodium to 2,300mg daily",
        "Stay well hydrated",
        "Eat plenty of fruits and vegetables",
        "Limit processed foods"
      ],
      lifestyle: [
        "Exercise regularly (30 minutes, 5 days a week)",
        "Maintain healthy weight",
        "Control blood pressure and blood sugar",
        "Avoid smoking",
        "Limit alcohol consumption"
      ],
      monitoring: [
        "Annual check-ups to monitor kidney function",
        "Regular blood pressure monitoring",
        "Blood glucose monitoring if diabetic",
        "Urine protein testing annually",
        "Review medications with your doctor"
      ]
    }
  },
  {
    stage: 2,
    name: "Mild Reduction in Kidney Function",
    egfrRange: "60-89",
    description: "Kidney function is slightly decreased but still working well. Most people still don't experience symptoms, but the damage is progressing and may be detected through tests.",
    recommendations: {
      diet: [
        "Monitor protein intake (0.8g/kg body weight)",
        "Reduce sodium to 2,000mg daily",
        "Monitor phosphorus intake",
        "Limit processed foods",
        "Stay well hydrated"
      ],
      lifestyle: [
        "Regular exercise tailored to your ability",
        "Blood pressure control is critical",
        "Avoid NSAIDs and nephrotoxic medications",
        "Manage diabetes carefully if applicable",
        "Get adequate sleep (7-8 hours nightly)"
      ],
      monitoring: [
        "Check-ups every 6 months",
        "Track blood pressure regularly",
        "Monitor eGFR and creatinine levels",
        "Urine protein testing twice yearly",
        "Track any new symptoms"
      ]
    }
  },
  {
    stage: 3,
    name: "Moderate Reduction in Kidney Function",
    egfrRange: "30-59",
    description: "Kidney function is moderately reduced, and waste products may begin to build up in the blood. Symptoms might start to appear such as fatigue, fluid retention, and changes in urination.",
    recommendations: {
      diet: [
        "Limit protein (0.6-0.8g/kg body weight)",
        "Reduce sodium to 1,500-2,000mg daily",
        "Monitor potassium and phosphorus intake",
        "Consider vitamin D supplements",
        "Limit processed and high-phosphorus foods"
      ],
      lifestyle: [
        "Gentle regular exercise",
        "Strict blood pressure management",
        "Avoid all nephrotoxic medications",
        "Monitor and manage fluid intake",
        "Consider consultation with a nephrologist"
      ],
      monitoring: [
        "Check-ups every 3-4 months",
        "Monitor for anemia and bone problems",
        "Regular metabolic panel blood tests",
        "Track fluid retention and weight changes",
        "Consider medication adjustments"
      ]
    }
  },
  {
    stage: 4,
    name: "Severe Reduction in Kidney Function",
    egfrRange: "15-29",
    description: "Severe decrease in kidney function with considerable waste buildup in the blood. Symptoms often include fatigue, swelling, back pain, and sleep problems. Planning for dialysis or transplant typically begins.",
    recommendations: {
      diet: [
        "Strict protein restriction (0.6g/kg body weight)",
        "Low potassium, phosphorus, and sodium diet",
        "Fluid restriction often necessary",
        "Work with renal dietitian",
        "Consider nutritional supplements"
      ],
      lifestyle: [
        "Light activity as tolerated",
        "Conserve energy throughout the day",
        "Prepare for renal replacement therapy",
        "Strict medication management",
        "Join a kidney disease support group"
      ],
      monitoring: [
        "Monthly nephrologist visits",
        "Comprehensive blood work monthly",
        "Track symptoms daily",
        "Monitor fluid intake/output",
        "Education about dialysis or transplant options"
      ]
    }
  },
  {
    stage: 5,
    name: "Kidney Failure",
    egfrRange: "Less than 15",
    description: "End-stage renal disease (ESRD) where kidneys can no longer keep up with waste removal. Dialysis or kidney transplant is necessary for survival. Symptoms are typically severe and affect multiple body systems.",
    recommendations: {
      diet: [
        "Very strict dietary management",
        "Diet tailored to dialysis schedule if applicable",
        "Protein requirements may increase with dialysis",
        "Careful fluid management",
        "Potassium and phosphorus restrictions"
      ],
      lifestyle: [
        "Activity as tolerated, with rest periods",
        "Dialysis schedule adherence",
        "Active transplant list management if eligible",
        "Symptom tracking and management",
        "Ongoing emotional/mental health support"
      ],
      monitoring: [
        "Frequent dialysis treatments as prescribed",
        "Regular blood work before/after dialysis",
        "Vascular access site monitoring",
        "Strict medication schedule",
        "Comprehensive care coordination"
      ]
    }
  }
];
