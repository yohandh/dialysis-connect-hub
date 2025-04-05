
interface LoginCredential {
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'patient';
  name: string;
  userId: string;
}

export const loginCredentials: LoginCredential[] = [
  {
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    name: "Michael Adams",
    userId: "user-007"
  },
  {
    email: "admin2@example.com",
    password: "admin123",
    role: "admin",
    name: "Jennifer Wilson",
    userId: "user-008"
  },
  {
    email: "staff@example.com",
    password: "staff123",
    role: "staff",
    name: "Sarah Johnson",
    userId: "user-005"
  },
  {
    email: "staff2@example.com",
    password: "staff123",
    role: "staff",
    name: "David Chen",
    userId: "user-006"
  },
  {
    email: "patient@example.com",
    password: "patient123",
    role: "patient",
    name: "John Smith",
    userId: "user-001"
  },
  {
    email: "patient2@example.com",
    password: "patient123",
    role: "patient",
    name: "Maria Rodriguez",
    userId: "user-002"
  }
];

export const validateCredentials = (email: string, password: string): LoginCredential | null => {
  const credential = loginCredentials.find(
    cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
  );
  
  return credential || null;
};
