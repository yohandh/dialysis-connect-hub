
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { loginUser } from '@/api/authApi';
import { useAuth } from '@/hooks/useAuth';

const PatientLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("patient@dialyzeease.org");
  const [password, setPassword] = useState("example.com");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  // Check for success message from registration in sessionStorage
  useEffect(() => {
    const successMessage = sessionStorage.getItem('registrationSuccess');
    if (successMessage) {
      toast.success("Registration Successful", {
        description: successMessage,
      });
      
      // Clear the message from sessionStorage
      sessionStorage.removeItem('registrationSuccess');
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Login Failed", {
        description: "Please enter both email and password.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the backend API to authenticate
      const response = await loginUser({ email, password });
      
      if (response && response.token) {
        // Store the token and user data using the auth context
        login({
          user: response.user,
          token: response.token,
          role: response.user.role_id
        });
        
        toast.success("Login Successful", {
          description: "Welcome to the Patient Portal.",
        });
        
        // Redirect to the intended page or dashboard
        const from = location.state?.from?.pathname || '/patient/dashboard';
        navigate(from);
      } else {
        toast.error("Login Failed", {
          description: "Invalid credentials. Please try again.",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error("Login Failed", {
        description: error.response?.data?.message || "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-medical-blue">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-medical-blue/10 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-medical-blue">Patient Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the Patient Portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="patient@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-medical-blue hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-medical-blue hover:bg-medical-blue/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
        <div className="px-8 pb-6 text-center">
          <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/patient/register" className="text-medical-blue hover:underline">
              Register here
            </Link>
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Patient portal is secure and HIPAA compliant
          </p>
          <div className="mt-4 flex justify-center">
            <img src="/logo.png" alt="DialyzeEase Logo" className="h-6 mr-2" />
            <span className="text-xs font-semibold text-gray-700">DialyzeEase</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PatientLogin;
