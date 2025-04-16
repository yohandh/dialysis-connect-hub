
export interface DialysisCenter {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  email: string;
  capacity: number;
  currentPatients: number;
  type?: string; // Add type property
  centerHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  nephrologists: string[];
}

export const dialysisCenters: DialysisCenter[] = [
  {
    id: "center-001",
    name: "Metro Dialysis Center",
    address: {
      street: "123 Healthcare Blvd",
      city: "Metropolis",
      state: "NY",
      zipCode: "10001"
    },
    phone: "555-111-2222",
    email: "contact@metrodialysis.example.com",
    capacity: 50,
    currentPatients: 42,
    type: "Hospital-based",
    centerHours: {
      monday: "6:00 AM - 9:00 PM",
      tuesday: "6:00 AM - 9:00 PM",
      wednesday: "6:00 AM - 9:00 PM",
      thursday: "6:00 AM - 9:00 PM",
      friday: "6:00 AM - 9:00 PM",
      saturday: "7:00 AM - 5:00 PM",
      sunday: "7:00 AM - 5:00 PM"
    },
    nephrologists: ["Dr. Sarah Johnson", "Dr. David Chen", "Dr. Emma Williams"]
  },
  {
    id: "center-002",
    name: "Central Kidney Care",
    address: {
      street: "456 Medical Drive",
      city: "Centerville",
      state: "CA",
      zipCode: "90210"
    },
    phone: "555-333-4444",
    email: "info@centralkidneycare.example.com",
    capacity: 40,
    currentPatients: 35,
    type: "Independent",
    centerHours: {
      monday: "7:00 AM - 8:00 PM",
      tuesday: "7:00 AM - 8:00 PM",
      wednesday: "7:00 AM - 8:00 PM",
      thursday: "7:00 AM - 8:00 PM",
      friday: "7:00 AM - 8:00 PM",
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    nephrologists: ["Dr. Robert Miller", "Dr. Patricia Garcia", "Dr. James Wilson"]
  },
  {
    id: "center-003",
    name: "Riverside Renal Center",
    address: {
      street: "789 River Road",
      city: "Riverside",
      state: "TX",
      zipCode: "77001"
    },
    phone: "555-555-6666",
    email: "contact@riversiderenal.example.com",
    capacity: 35,
    currentPatients: 28,
    type: "Freestanding",
    centerHours: {
      monday: "6:30 AM - 7:30 PM",
      tuesday: "6:30 AM - 7:30 PM",
      wednesday: "6:30 AM - 7:30 PM",
      thursday: "6:30 AM - 7:30 PM",
      friday: "6:30 AM - 7:30 PM",
      saturday: "7:30 AM - 3:30 PM",
      sunday: "Closed"
    },
    nephrologists: ["Dr. Thomas Brown", "Dr. Linda Martinez"]
  },
  {
    id: "center-004",
    name: "Highland Dialysis",
    address: {
      street: "101 Highland Ave",
      city: "Highland",
      state: "IL",
      zipCode: "60035"
    },
    phone: "555-777-8888",
    email: "info@highlanddialysis.example.com",
    capacity: 25,
    currentPatients: 21,
    type: "Satellite",
    centerHours: {
      monday: "7:00 AM - 7:00 PM",
      tuesday: "7:00 AM - 7:00 PM",
      wednesday: "7:00 AM - 7:00 PM",
      thursday: "7:00 AM - 7:00 PM",
      friday: "7:00 AM - 7:00 PM",
      saturday: "8:00 AM - 3:00 PM",
      sunday: "Closed"
    },
    nephrologists: ["Dr. Michael Johnson", "Dr. Susan Lee"]
  },
  {
    id: "center-005",
    name: "Eastside Kidney Center",
    address: {
      street: "202 East Main Street",
      city: "Eastville",
      state: "FL",
      zipCode: "33101"
    },
    phone: "555-999-0000",
    email: "contact@eastsidekidney.example.com",
    capacity: 30,
    currentPatients: 26,
    type: "Hospital-based",
    centerHours: {
      monday: "6:00 AM - 8:00 PM",
      tuesday: "6:00 AM - 8:00 PM",
      wednesday: "6:00 AM - 8:00 PM",
      thursday: "6:00 AM - 8:00 PM",
      friday: "6:00 AM - 8:00 PM",
      saturday: "7:00 AM - 5:00 PM",
      sunday: "7:00 AM - 12:00 PM"
    },
    nephrologists: ["Dr. Jennifer Adams", "Dr. Richard Taylor", "Dr. Elizabeth Clark"]
  }
];

export const getCenterById = (id: string): DialysisCenter | undefined => {
  return dialysisCenters.find(center => center.id === id);
};
