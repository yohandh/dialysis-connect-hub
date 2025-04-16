// Import the shared DialysisCenter interface
import { DialysisCenter } from '../types/centerTypes';

// Mock data that matches the MySQL database schema
export const dialysisCenters: DialysisCenter[] = [
  {
    id: 1,
    name: "The National Institute For Nephrology Dialysis & Transplantation",
    address: "Colombo",
    contactNo: "011-200-0000",
    email: "national.center@dialysis.org",
    totalCapacity: 10,
    isActive: true,
    centerHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "9:00 AM - 1:00 PM",
      sunday: "Closed"
    }
  },
  {
    id: 2,
    name: "Nawaloka",
    address: "Colombo",
    contactNo: "011-200-0001",
    email: "nawaloka@dialysis.org",
    totalCapacity: 10,
    isActive: true,
    centerHours: {
      monday: "7:00 AM - 6:00 PM",
      tuesday: "7:00 AM - 6:00 PM",
      wednesday: "7:00 AM - 6:00 PM",
      thursday: "7:00 AM - 6:00 PM",
      friday: "7:00 AM - 6:00 PM",
      saturday: "8:00 AM - 2:00 PM",
      sunday: "Closed"
    }
  },
  {
    id: 3,
    name: "Asiri Surgical",
    address: "Colombo",
    contactNo: "011-200-0002",
    email: "asirisurgical@dialysis.org",
    totalCapacity: 10,
    isActive: true,
    centerHours: {
      monday: "8:30 AM - 5:30 PM",
      tuesday: "8:30 AM - 5:30 PM",
      wednesday: "8:30 AM - 5:30 PM",
      thursday: "8:30 AM - 5:30 PM",
      friday: "8:30 AM - 5:30 PM",
      saturday: "9:00 AM - 1:00 PM",
      sunday: "Closed"
    }
  },
  {
    id: 4,
    name: "Kings Hospital",
    address: "Colombo",
    contactNo: "011-200-0003",
    email: "kingshospital@dialysis.org",
    totalCapacity: 10,
    isActive: true,
    centerHours: {
      monday: "7:30 AM - 6:30 PM",
      tuesday: "7:30 AM - 6:30 PM",
      wednesday: "7:30 AM - 6:30 PM",
      thursday: "7:30 AM - 6:30 PM",
      friday: "7:30 AM - 6:30 PM",
      saturday: "8:00 AM - 2:00 PM",
      sunday: "8:00 AM - 12:00 PM"
    }
  },
  {
    id: 5,
    name: "Lanka Hospital",
    address: "Colombo",
    contactNo: "011-200-0004",
    email: "lankahospital@dialysis.org",
    totalCapacity: 10,
    isActive: true,
    centerHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 3:00 PM",
      sunday: "Closed"
    }
  }
];

export const getCenterById = (id: string): DialysisCenter | undefined => {
  return dialysisCenters.find(center => center.id.toString() === id);
};
