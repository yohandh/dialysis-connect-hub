// Import the shared DialysisCenter interface
import { DialysisCenter } from '../types/centerTypes';

// Mock data that matches the MySQL database schema
export const dialysisCenters: DialysisCenter[] = [
  {
    id: 1,
    name: "The National Institute For Nephrology Dialysis & Transplantation",
    address: "Colombo",
    contact_no: "011-200-0000",
    email: "national.center@dialysis.org",
    total_capacity: 10,
    is_active: true
  },
  {
    id: 2,
    name: "Nawaloka",
    address: "Colombo",
    contact_no: "011-200-0001",
    email: "nawaloka@dialysis.org",
    total_capacity: 10,
    is_active: true
  },
  {
    id: 3,
    name: "Asiri Surgical",
    address: "Colombo",
    contact_no: "011-200-0002",
    email: "asirisurgical@dialysis.org",
    total_capacity: 10,
    is_active: true
  },
  {
    id: 4,
    name: "Kings Hospital",
    address: "Colombo",
    contact_no: "011-200-0003",
    email: "kingshospital@dialysis.org",
    total_capacity: 10,
    is_active: true
  },
  {
    id: 5,
    name: "Lanka Hospital",
    address: "Colombo",
    contact_no: "011-200-0004",
    email: "lankahospital@dialysis.org",
    total_capacity: 10,
    is_active: true
  }
];

export const getCenterById = (id: string): DialysisCenter | undefined => {
  return dialysisCenters.find(center => center.id.toString() === id);
};
