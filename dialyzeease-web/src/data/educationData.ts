
export interface EducationResource {
  id: string;
  title: string;
  summary: string;
  content: string;
  type: 'diet' | 'medication' | 'lifestyle' | 'general';
  ckdStages: number[];
  imageUrl?: string;
  author?: string;
  datePublished: string;
  readTime: string;
}

export const educationResources: EducationResource[] = [
  {
    id: "edu1",
    title: "Dietary Recommendations for CKD Stage 3",
    summary: "Learn about dietary guidelines that can help manage CKD Stage 3",
    content: `
      <h2>Managing Your Diet in CKD Stage 3</h2>
      <p>As kidney function declines, dietary adjustments become increasingly important. Here are key dietary guidelines for CKD Stage 3:</p>
      
      <h3>Protein Intake</h3>
      <p>Moderating protein consumption can help reduce the workload on your kidneys. Aim for 0.8 grams of protein per kilogram of body weight daily. Focus on high-quality protein sources such as egg whites, fish, and lean poultry.</p>
      
      <h3>Sodium Restriction</h3>
      <p>Limiting sodium helps control blood pressure and reduces fluid retention. Restrict sodium intake to 2,300 mg per day or less. Avoid processed foods, canned soups, and table salt.</p>
      
      <h3>Potassium Management</h3>
      <p>In Stage 3, you may need to moderate potassium intake. Foods high in potassium include bananas, oranges, potatoes, tomatoes, and nuts. Your doctor may recommend specific limits based on your blood tests.</p>
      
      <h3>Phosphorus Control</h3>
      <p>As kidney function declines, phosphorus can build up in your blood. Limit intake of dairy products, nuts, whole grains, and cola beverages. Your doctor may prescribe phosphate binders to take with meals.</p>
      
      <h3>Fluid Intake</h3>
      <p>In Stage 3, moderate fluid restriction may be necessary. Your doctor will provide specific recommendations based on your urine output and overall health status.</p>
      
      <h3>Caloric Intake</h3>
      <p>Maintaining adequate calories is important to prevent malnutrition. Focus on healthy fats like olive oil and nutrient-dense foods that comply with your other dietary restrictions.</p>
      
      <h3>Working with a Dietitian</h3>
      <p>A renal dietitian can create a personalized meal plan that accommodates your specific needs, preferences, and laboratory values. Regular nutritional counseling is an essential part of CKD management.</p>
    `,
    type: "diet",
    ckdStages: [3, 4],
    imageUrl: "/images/diet-kidney.jpg",
    author: "Dr. Susan Reynolds, RD",
    datePublished: "2023-05-15",
    readTime: "8 min"
  },
  {
    id: "edu2",
    title: "Managing Medications with CKD",
    summary: "Important information about medication management for kidney patients",
    content: `
      <h2>Medication Management for CKD Patients</h2>
      <p>Proper medication management is critical for people with chronic kidney disease. Here's what you need to know:</p>
      
      <h3>Understanding Your Medications</h3>
      <p>Keep a complete list of all medications you take, including over-the-counter drugs, supplements, and herbs. Share this list with all healthcare providers you see.</p>
      
      <h3>Common Medications for CKD</h3>
      <p>Several types of medications are commonly prescribed to manage CKD and its complications:</p>
      <ul>
        <li>Blood pressure medications (ACE inhibitors, ARBs)</li>
        <li>Diuretics to reduce fluid retention</li>
        <li>Phosphate binders to control phosphorus levels</li>
        <li>Vitamin D supplements to maintain bone health</li>
        <li>Erythropoietin to treat anemia</li>
        <li>Statins to manage cholesterol</li>
      </ul>
      
      <h3>Medications to Use with Caution</h3>
      <p>Some medications can harm kidney function and should be used cautiously or avoided:</p>
      <ul>
        <li>NSAIDs (ibuprofen, naproxen)</li>
        <li>Certain antibiotics</li>
        <li>Some contrast dyes used in imaging studies</li>
        <li>High-dose vitamin supplements</li>
      </ul>
      
      <h3>Medication Dosage Adjustments</h3>
      <p>As kidney function decreases, the dosage of certain medications may need adjustment. Your doctor will monitor your kidney function and adjust medications accordingly.</p>
      
      <h3>Medication Adherence Tips</h3>
      <p>Taking medications as prescribed is essential. Consider these strategies:</p>
      <ul>
        <li>Use pill organizers</li>
        <li>Set alarms as medication reminders</li>
        <li>Link medication times to daily routines</li>
        <li>Ask your pharmacy about medication synchronization</li>
        <li>Use a medication tracking app</li>
      </ul>
      
      <h3>Regular Medication Reviews</h3>
      <p>Schedule regular medication reviews with your healthcare provider to ensure your regimen remains appropriate as your condition changes.</p>
    `,
    type: "medication",
    ckdStages: [1, 2, 3, 4, 5],
    imageUrl: "/images/medication.jpg",
    author: "Dr. Michael Chen, PharmD",
    datePublished: "2023-06-22",
    readTime: "10 min"
  },
  {
    id: "edu3",
    title: "Physical Activity Guidelines",
    summary: "Staying active safely with kidney disease",
    content: `
      <h2>Exercise and Physical Activity with CKD</h2>
      <p>Regular physical activity offers many benefits for people with chronic kidney disease, but it's important to exercise safely.</p>
      
      <h3>Benefits of Exercise for CKD Patients</h3>
      <p>Regular physical activity can:</p>
      <ul>
        <li>Improve cardiovascular health</li>
        <li>Help control blood pressure</li>
        <li>Improve muscle function and strength</li>
        <li>Enhance insulin sensitivity</li>
        <li>Boost energy levels and reduce fatigue</li>
        <li>Improve sleep quality</li>
        <li>Help manage weight</li>
        <li>Enhance overall quality of life</li>
      </ul>
      
      <h3>Recommended Activities</h3>
      <p>The following types of exercise are generally safe and beneficial for people with CKD:</p>
      <ul>
        <li>Walking</li>
        <li>Swimming</li>
        <li>Cycling</li>
        <li>Light resistance training</li>
        <li>Yoga and tai chi</li>
        <li>Gentle stretching</li>
      </ul>
      
      <h3>Exercise Guidelines</h3>
      <p>Aim for at least 30 minutes of moderate activity most days of the week. Start slowly and gradually increase intensity and duration.</p>
      
      <h3>Safety Precautions</h3>
      <p>Consider these safety measures when exercising:</p>
      <ul>
        <li>Consult your healthcare provider before starting any exercise program</li>
        <li>Stay well hydrated, but follow fluid restrictions if applicable</li>
        <li>Avoid exercising in extreme temperatures</li>
        <li>Stop if you experience chest pain, severe shortness of breath, or dizziness</li>
        <li>If you have a dialysis access, avoid activities that could damage it</li>
        <li>Consider exercising during non-dialysis days if you're on dialysis</li>
      </ul>
      
      <h3>Customizing Your Exercise Plan</h3>
      <p>Work with a physical therapist or exercise physiologist with experience in renal rehabilitation to develop a personalized exercise program that considers your specific condition, limitations, and goals.</p>
    `,
    type: "lifestyle",
    ckdStages: [1, 2, 3, 4],
    imageUrl: "/images/exercise.jpg",
    author: "Dr. Jennifer Wilson, PT",
    datePublished: "2023-04-10",
    readTime: "7 min"
  },
  {
    id: "edu4",
    title: "Understanding Lab Values in CKD",
    summary: "Learn how to interpret your kidney function test results",
    content: `
      <h2>Making Sense of Your Lab Results</h2>
      <p>Regular laboratory tests are essential for monitoring kidney function. Understanding these values can help you take an active role in your care.</p>
      
      <h3>Key Lab Values to Monitor</h3>
      <ul>
        <li>eGFR (estimated Glomerular Filtration Rate): Measures how well your kidneys filter blood</li>
        <li>Serum Creatinine: A waste product that can build up when kidney function declines</li>
        <li>BUN (Blood Urea Nitrogen): Another waste product that increases with reduced kidney function</li>
        <li>Electrolytes: Including sodium, potassium, calcium, and phosphorus</li>
        <li>Albumin: A protein that can indicate nutritional status and kidney damage</li>
        <li>Hemoglobin and Hematocrit: Can indicate anemia, common in CKD</li>
        <li>Parathyroid Hormone (PTH): Often elevated in CKD, affects bone health</li>
      </ul>
      
      <h3>Understanding Your GFR</h3>
      <p>GFR is reported in mL/min/1.73m² and helps determine your CKD stage:</p>
      <ul>
        <li>Stage 1: GFR 90 or higher (normal kidney function but signs of kidney disease)</li>
        <li>Stage 2: GFR 60-89 (mildly reduced kidney function)</li>
        <li>Stage 3a: GFR 45-59 (mildly to moderately reduced)</li>
        <li>Stage 3b: GFR 30-44 (moderately to severely reduced)</li>
        <li>Stage 4: GFR 15-29 (severely reduced)</li>
        <li>Stage 5: GFR less than 15 (kidney failure)</li>
      </ul>
      
      <h3>Tracking Changes Over Time</h3>
      <p>The trend in your lab values over time is often more important than a single reading. Keep a personal record of your lab results and note any significant changes.</p>
      
      <h3>Questions to Ask Your Healthcare Provider</h3>
      <p>When reviewing lab results, consider asking:</p>
      <ul>
        <li>How have my values changed since last time?</li>
        <li>Are any values outside the normal range?</li>
        <li>What lifestyle or medication changes might improve these values?</li>
        <li>How often should these tests be repeated?</li>
      </ul>
    `,
    type: "general",
    ckdStages: [1, 2, 3, 4, 5],
    datePublished: "2023-03-05",
    readTime: "9 min"
  },
  {
    id: "edu5",
    title: "Managing Blood Pressure with CKD",
    summary: "Strategies for controlling hypertension when you have kidney disease",
    content: `
      <h2>Blood Pressure Control for Kidney Health</h2>
      <p>Hypertension (high blood pressure) is both a cause and a consequence of chronic kidney disease. Controlling blood pressure is one of the most important ways to slow CKD progression.</p>
      
      <h3>Blood Pressure Goals</h3>
      <p>For most people with CKD, the target blood pressure is below 130/80 mmHg. Your doctor may recommend different targets based on your individual situation.</p>
      
      <h3>Medication Strategies</h3>
      <p>Several types of blood pressure medications are particularly beneficial for CKD patients:</p>
      <ul>
        <li>ACE inhibitors (names often end in "-pril")</li>
        <li>ARBs (Angiotensin II Receptor Blockers, names often end in "-sartan")</li>
        <li>Diuretics ("water pills")</li>
        <li>Calcium channel blockers</li>
        <li>Beta-blockers</li>
      </ul>
      <p>Many patients need multiple medications to achieve good control.</p>
      
      <h3>Lifestyle Modifications</h3>
      <p>Non-medication approaches can significantly impact blood pressure:</p>
      <ul>
        <li>Limiting sodium intake to less than 2,300 mg per day</li>
        <li>Following a DASH-style diet rich in fruits, vegetables, and low-fat dairy</li>
        <li>Regular physical activity</li>
        <li>Maintaining a healthy weight</li>
        <li>Limiting alcohol consumption</li>
        <li>Not smoking</li>
        <li>Managing stress</li>
      </ul>
      
      <h3>Home Blood Pressure Monitoring</h3>
      <p>Measuring your blood pressure at home provides valuable information about how well your treatment is working. Tips for accurate readings:</p>
      <ul>
        <li>Use a validated monitor with the correct cuff size</li>
        <li>Sit quietly for 5 minutes before measuring</li>
        <li>Position your arm at heart level</li>
        <li>Take readings at the same time each day</li>
        <li>Record your readings to share with your healthcare provider</li>
      </ul>
    `,
    type: "general",
    ckdStages: [1, 2, 3, 4, 5],
    datePublished: "2023-07-12",
    readTime: "8 min"
  }
];

export const getEducationResourceById = (id: string): EducationResource | undefined => {
  return educationResources.find(resource => resource.id === id);
};

export const getEducationResourcesByCkdStage = (stage: number): EducationResource[] => {
  return educationResources.filter(resource => resource.ckdStages.includes(stage));
};

export const getEducationResourcesByType = (type: string): EducationResource[] => {
  return educationResources.filter(resource => resource.type === type);
};
