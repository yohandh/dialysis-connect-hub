import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
}

/**
 * A component that protects routes by checking if the user is authenticated
 * and has the required role to access the route
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the location they were trying to access for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If there are allowed roles specified and user's role is not included
  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    // Redirect based on role
    if (role === 1000) { // Admin
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 1001) { // Staff
      return <Navigate to="/staff/dashboard" replace />;
    } else if (role === 1002) { // Doctor
      return <Navigate to="/doctor/dashboard" replace />;
    } else if (role === 1003) { // Patient
      return <Navigate to="/patient/dashboard" replace />;
    } else {
      // Fallback to home page if role doesn't match any known role
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and has the right role (or no role specified), render the children
  return <>{children}</>;
};

export default ProtectedRoute;
