
import { 
  Role, 
  User, 
  Patient,
  Doctor,
  Center, 
  CenterHours, 
  CenterUser, 
  CkdStage,
  EducationMaterial
} from "@/types/adminTypes";

// Mock Roles data
export const roles: Role[] = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'staff' },
  { id: 3, name: 'patient' },
  { id: 4, name: 'doctor' }
];

// Mock Users data
export const users: User[] = [
  { 
    id: 1, 
    roleId: 1, 
    name: 'Suwan Ratnayake', 
    email: 'michael.adams@example.com', 
    mobileNo: '555-123-4567',
    status: 'active',
    roleName: 'admin'
  },
  { 
    id: 2, 
    roleId: 1, 
    name: 'Jennifer Wilson', 
    email: 'jennifer.wilson@example.com', 
    mobileNo: '555-987-6543',
    status: 'active',
    roleName: 'admin'
  },
  { 
    id: 3, 
    roleId: 2, 
    name: 'Sarah Johnson', 
    email: 'sarah.johnson@example.com', 
    mobileNo: '555-456-7890',
    status: 'active',
    roleName: 'staff'
  },
  { 
    id: 4, 
    roleId: 2, 
    name: 'David Chen', 
    email: 'david.chen@example.com', 
    mobileNo: '555-789-0123',
    status: 'active',
    roleName: 'staff'
  },
  { 
    id: 5, 
    roleId: 3, 
    name: 'John Smith', 
    email: 'john.smith@example.com', 
    mobileNo: '555-234-5678',
    status: 'active',
    roleName: 'patient'
  },
  { 
    id: 6, 
    roleId: 3, 
    name: 'Maria Rodriguez', 
    email: 'maria.rodriguez@example.com', 
    mobileNo: '555-345-6789',
    status: 'active',
    roleName: 'patient'
  },
  { 
    id: 7, 
    roleId: 4, 
    name: 'Dr. Thomas Brown', 
    email: 'thomas.brown@example.com', 
    mobileNo: '555-567-8901',
    status: 'active',
    roleName: 'doctor'
  },
  { 
    id: 8, 
    roleId: 4, 
    name: 'Dr. Linda Martinez', 
    email: 'linda.martinez@example.com', 
    mobileNo: '555-678-9012',
    status: 'active',
    roleName: 'doctor'
  }
];

// Mock Patients data
export const patients: Patient[] = [
  {
    id: 1,
    userId: 5,
    gender: 'male',
    dob: '1980-05-15',
    address: '123 Main St, Metropolis, NY',
    bloodGroup: 'O+',
    emergencyContactNo: '555-111-2222',
    emergencyContact: 'Jane Smith (Wife)',
    insuranceProvider: 'MetLife Health',
    allergies: 'Penicillin',
    chronicConditions: 'Hypertension, CKD Stage 3',
    name: 'John Smith',
    email: 'john.smith@example.com',
    mobileNo: '555-234-5678'
  },
  {
    id: 2,
    userId: 6,
    gender: 'female',
    dob: '1975-09-22',
    address: '456 Oak Ave, Centerville, CA',
    bloodGroup: 'A-',
    emergencyContactNo: '555-222-3333',
    emergencyContact: 'Carlos Rodriguez (Husband)',
    insuranceProvider: 'Blue Shield',
    allergies: 'Sulfa drugs',
    chronicConditions: 'Diabetes, CKD Stage 4',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    mobileNo: '555-345-6789'
  }
];

// Mock Doctors data
export const doctors: Doctor[] = [
  {
    id: 1,
    userId: 7,
    specialization: 'Nephrology',
    address: '789 Medical Drive, Riverside, TX',
    emergencyContactNo: '555-444-5555',
    gender: 'male',
    name: 'Dr. Thomas Brown',
    email: 'thomas.brown@example.com',
    mobileNo: '555-567-8901'
  },
  {
    id: 2,
    userId: 8,
    specialization: 'Nephrology, Dialysis',
    address: '101 Highland Ave, Highland, IL',
    emergencyContactNo: '555-555-6666',
    gender: 'female',
    name: 'Dr. Linda Martinez',
    email: 'linda.martinez@example.com',
    mobileNo: '555-678-9012'
  }
];

// Mock Centers data
export const centers: Center[] = [
  {
    id: 1,
    name: 'Metro Dialysis Center',
    address: '123 Healthcare Blvd, Metropolis, NY',
    phoneNo: '555-111-2222',
    email: 'contact@metrodialysis.example.com',
    totalCapacity: 50
  },
  {
    id: 2,
    name: 'Central Kidney Care',
    address: '456 Medical Drive, Centerville, CA',
    phoneNo: '555-333-4444',
    email: 'info@centralkidneycare.example.com',
    totalCapacity: 40
  },
  {
    id: 3,
    name: 'Riverside Renal Center',
    address: '789 River Road, Riverside, TX',
    phoneNo: '555-555-6666',
    email: 'contact@riversiderenal.example.com',
    totalCapacity: 35
  },
  {
    id: 4,
    name: 'Highland Dialysis',
    address: '101 Highland Ave, Highland, IL',
    phoneNo: '555-777-8888',
    email: 'info@highlanddialysis.example.com',
    totalCapacity: 25
  },
  {
    id: 5,
    name: 'Eastside Kidney Center',
    address: '202 East Main Street, Eastville, FL',
    phoneNo: '555-999-0000',
    email: 'contact@eastsidekidney.example.com',
    totalCapacity: 30
  }
];

// Mock Center Hours data
export const centerHours: CenterHours[] = [
  { id: 1, centerId: 1, weekday: 'Mon', openTime: '06:00', closeTime: '21:00' },
  { id: 2, centerId: 1, weekday: 'Tue', openTime: '06:00', closeTime: '21:00' },
  { id: 3, centerId: 1, weekday: 'Wed', openTime: '06:00', closeTime: '21:00' },
  { id: 4, centerId: 1, weekday: 'Thu', openTime: '06:00', closeTime: '21:00' },
  { id: 5, centerId: 1, weekday: 'Fri', openTime: '06:00', closeTime: '21:00' },
  { id: 6, centerId: 1, weekday: 'Sat', openTime: '07:00', closeTime: '17:00' },
  { id: 7, centerId: 1, weekday: 'Sun', openTime: '07:00', closeTime: '17:00' },
  
  { id: 8, centerId: 2, weekday: 'Mon', openTime: '07:00', closeTime: '20:00' },
  { id: 9, centerId: 2, weekday: 'Tue', openTime: '07:00', closeTime: '20:00' },
  { id: 10, centerId: 2, weekday: 'Wed', openTime: '07:00', closeTime: '20:00' },
  { id: 11, centerId: 2, weekday: 'Thu', openTime: '07:00', closeTime: '20:00' },
  { id: 12, centerId: 2, weekday: 'Fri', openTime: '07:00', closeTime: '20:00' },
  { id: 13, centerId: 2, weekday: 'Sat', openTime: '08:00', closeTime: '16:00' },
  
  { id: 14, centerId: 3, weekday: 'Mon', openTime: '06:30', closeTime: '19:30' },
  { id: 15, centerId: 3, weekday: 'Tue', openTime: '06:30', closeTime: '19:30' },
  { id: 16, centerId: 3, weekday: 'Wed', openTime: '06:30', closeTime: '19:30' },
  { id: 17, centerId: 3, weekday: 'Thu', openTime: '06:30', closeTime: '19:30' },
  { id: 18, centerId: 3, weekday: 'Fri', openTime: '06:30', closeTime: '19:30' },
  { id: 19, centerId: 3, weekday: 'Sat', openTime: '07:30', closeTime: '15:30' }
];

// Mock Center Users data
export const centerUsers: CenterUser[] = [
  { 
    id: 1, 
    userId: 3, 
    centerId: 1, 
    assignedRole: 'staff', 
    assignedAt: '2023-01-15T08:00:00', 
    status: 'active',
    userName: 'Sarah Johnson',
    centerName: 'Metro Dialysis Center'
  },
  { 
    id: 2, 
    userId: 4, 
    centerId: 2, 
    assignedRole: 'staff', 
    assignedAt: '2023-02-01T09:00:00', 
    status: 'active',
    userName: 'David Chen',
    centerName: 'Central Kidney Care'
  },
  { 
    id: 3, 
    userId: 7, 
    centerId: 3, 
    assignedRole: 'doctor', 
    assignedAt: '2023-01-10T08:30:00', 
    status: 'active',
    userName: 'Dr. Thomas Brown',
    centerName: 'Riverside Renal Center'
  },
  { 
    id: 4, 
    userId: 8, 
    centerId: 4, 
    assignedRole: 'doctor', 
    assignedAt: '2023-03-05T10:00:00', 
    status: 'active',
    userName: 'Dr. Linda Martinez',
    centerName: 'Highland Dialysis'
  }
];

// Mock CKD Stages data
export const ckdStages: CkdStage[] = [
  {
    id: 1,
    stageNumber: 1,
    minEgfr: 90,
    maxEgfr: Infinity,
    description: 'Normal kidney function but urine findings or structural abnormalities or genetic trait point to kidney disease'
  },
  {
    id: 2,
    stageNumber: 2,
    minEgfr: 60,
    maxEgfr: 89,
    description: 'Mildly reduced kidney function, and other findings (as for stage 1) point to kidney disease'
  },
  {
    id: 3,
    stageNumber: 3,
    minEgfr: 30,
    maxEgfr: 59,
    description: 'Moderately reduced kidney function'
  },
  {
    id: 4,
    stageNumber: 4,
    minEgfr: 15,
    maxEgfr: 29,
    description: 'Severely reduced kidney function'
  },
  {
    id: 5,
    stageNumber: 5,
    minEgfr: 0,
    maxEgfr: 15,
    description: 'Very severe, or end-stage kidney failure (sometimes called established renal failure)'
  }
];

// Mock Education Materials data
export const educationMaterials: EducationMaterial[] = [
  {
    id: 1,
    ckdStage: 1,
    langCode: 'en',
    type: 'diet',
    title: 'Healthy Eating for Early Kidney Disease',
    content: 'Focus on a balanced diet with plenty of fruits and vegetables. Limit processed foods high in sodium. Stay hydrated with water. Consult with your healthcare provider before making major dietary changes.'
  },
  {
    id: 2,
    ckdStage: 1,
    langCode: 'en',
    type: 'lifestyle',
    title: 'Physical Activity with Early CKD',
    content: 'Regular exercise is beneficial for kidney health. Aim for at least 30 minutes of moderate activity most days of the week. This can include walking, swimming, cycling, or light strength training.'
  },
  {
    id: 3,
    ckdStage: 2,
    langCode: 'en',
    type: 'diet',
    title: 'Dietary Guidelines for Stage 2 CKD',
    content: 'Continue focusing on a balanced diet. Begin monitoring sodium and protein intake. Consider consulting with a renal dietitian for personalized advice based on your specific needs and lab results.'
  },
  {
    id: 4,
    ckdStage: 3,
    langCode: 'en',
    type: 'diet',
    title: 'Managing Your Diet with Moderate CKD',
    content: 'At this stage, dietary changes become more important. Work with a renal dietitian to monitor intake of sodium, potassium, phosphorus, and protein. Stay hydrated but avoid excessive fluid intake.'
  },
  {
    id: 5,
    ckdStage: 4,
    langCode: 'en',
    type: 'general',
    title: 'Preparing for Dialysis',
    content: 'As kidney function declines, it\'s important to understand your treatment options. This may include hemodialysis, peritoneal dialysis, or kidney transplantation. Your healthcare team will help you understand what option might be best for you and how to prepare.'
  },
  {
    id: 6,
    ckdStage: 5,
    langCode: 'en',
    type: 'diet',
    title: 'Dietary Management for End-Stage Kidney Disease',
    content: 'Strict dietary management is essential. This typically includes restrictions on potassium, phosphorus, sodium, and fluids. Regular consultation with your renal dietitian is crucial as needs may change based on lab results and dialysis schedule.'
  },
  {
    id: 7,
    ckdStage: 5,
    langCode: 'en',
    type: 'lifestyle',
    title: 'Living Well on Dialysis',
    content: 'While on dialysis, maintaining a routine becomes important. Plan activities around your treatment schedule, take medications as prescribed, monitor your fluid intake between treatments, and continue regular physical activity as able.'
  }
];

// Helper functions
export const getCenterById = (id: number): Center | undefined => {
  return centers.find(center => center.id === id);
};

export const getCenterHours = (centerId: number): CenterHours[] => {
  return centerHours.filter(hour => hour.centerId === centerId);
};

export const getUsersByRole = (roleId: number): User[] => {
  return users.filter(user => user.roleId === roleId);
};

export const getEducationalMaterialsByStage = (stage: number): EducationMaterial[] => {
  return educationMaterials.filter(material => material.ckdStage === stage);
};
