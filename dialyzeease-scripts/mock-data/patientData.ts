
export interface PatientRecord {
  id: string;
  userId: string;
  firstName?: string; // Added
  lastName?: string;  // Added
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height: number; // in cm
  weight: number; // in kg
  primaryNephrologist: string;
  diagnosisDate: string;
  ckdStage: 1 | 2 | 3 | 4 | 5;
  dialysisStartDate?: string;
  accessType?: 'fistula' | 'graft' | 'catheter';
  comorbidities: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredCenter: string;
}

export const patients: PatientRecord[] = [
  {
    id: "patient-001",
    userId: "user-001",
    dateOfBirth: "1965-04-15",
    gender: "male",
    bloodType: "A+",
    height: 175,
    weight: 82,
    primaryNephrologist: "Dr. Sarah Johnson",
    diagnosisDate: "2020-03-10",
    ckdStage: 4,
    dialysisStartDate: "2021-09-15",
    accessType: "fistula",
    comorbidities: ["Diabetes Type 2", "Hypertension", "Coronary Artery Disease"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "twice daily" },
      { name: "Calcitriol", dosage: "0.25mcg", frequency: "once daily" }
    ],
    allergies: ["Penicillin"],
    emergencyContact: {
      name: "Mary Smith",
      relationship: "Wife",
      phone: "555-234-5678"
    },
    preferredCenter: "center-001"
  },
  {
    id: "patient-002",
    userId: "user-002",
    dateOfBirth: "1978-09-23",
    gender: "female",
    bloodType: "O+",
    height: 162,
    weight: 65,
    primaryNephrologist: "Dr. David Chen",
    diagnosisDate: "2019-11-05",
    ckdStage: 3,
    comorbidities: ["Polycystic Kidney Disease"],
    medications: [
      { name: "Losartan", dosage: "50mg", frequency: "once daily" },
      { name: "Sevelamer", dosage: "800mg", frequency: "with meals" }
    ],
    allergies: ["Sulfa drugs"],
    emergencyContact: {
      name: "Carlos Rodriguez",
      relationship: "Husband",
      phone: "555-876-5432"
    },
    preferredCenter: "center-001"
  },
  {
    id: "patient-003",
    userId: "user-003",
    dateOfBirth: "1952-01-30",
    gender: "male",
    bloodType: "B+",
    height: 180,
    weight: 79,
    primaryNephrologist: "Dr. Patricia Garcia",
    diagnosisDate: "2018-06-20",
    ckdStage: 5,
    dialysisStartDate: "2020-02-10",
    accessType: "catheter",
    comorbidities: ["Hypertension", "Gout"],
    medications: [
      { name: "Amlodipine", dosage: "5mg", frequency: "once daily" },
      { name: "Allopurinol", dosage: "100mg", frequency: "once daily" },
      { name: "Epoetin alfa", dosage: "10,000 units", frequency: "three times weekly" }
    ],
    allergies: [],
    emergencyContact: {
      name: "Linda Johnson",
      relationship: "Daughter",
      phone: "555-345-6789"
    },
    preferredCenter: "center-002"
  },
  {
    id: "patient-004",
    userId: "user-004",
    dateOfBirth: "1989-07-12",
    gender: "female",
    bloodType: "AB-",
    height: 165,
    weight: 58,
    primaryNephrologist: "Dr. Thomas Brown",
    diagnosisDate: "2021-01-15",
    ckdStage: 2,
    comorbidities: ["Lupus Nephritis"],
    medications: [
      { name: "Prednisone", dosage: "5mg", frequency: "once daily" },
      { name: "Hydroxychloroquine", dosage: "200mg", frequency: "twice daily" },
      { name: "Calcium carbonate", dosage: "500mg", frequency: "twice daily" }
    ],
    allergies: ["Ibuprofen", "Aspirin"],
    emergencyContact: {
      name: "Wei Chen",
      relationship: "Brother",
      phone: "555-456-7890"
    },
    preferredCenter: "center-003"
  }
];

export const getPatientByUserId = (userId: string): PatientRecord | undefined => {
  return patients.find(patient => patient.userId === userId);
};

export const getPatientById = (id: string): PatientRecord | undefined => {
  return patients.find(patient => patient.id === id);
};
