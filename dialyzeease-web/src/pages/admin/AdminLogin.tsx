import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { loginUser } from '@/api/authApi';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the authentication API
      const response = await loginUser({ email, password });
      
      if (response && response.token) {
        // Get user data and role from the API response
        const { user, token } = response;
        const roleId = user.roleId || user.role_id;
        
        // Store user data and token in auth context
        login({
          user,
          token,
          role: roleId
        });
        
        toast({
          title: "Login Successful",
          description: `Welcome to the ${getRoleName(roleId)} Portal.`,
        });
        
        // Redirect based on role
        redirectBasedOnRole(roleId);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please check your email and password.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Authentication failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to get role name from role_id
  const getRoleName = (roleId: number): string => {
    switch (roleId) {
      case 1000: return 'Admin';
      case 1001: return 'Staff';
      case 1002: return 'Doctor';
      case 1003: return 'Patient';
      default: return 'User';
    }
  };
  
  // Redirect user based on role
  const redirectBasedOnRole = (roleId: number): void => {
    switch (roleId) {
      case 1000: // Admin
        navigate('/admin/dashboard');
        break;
      case 1001: // Staff
        navigate('/staff/dashboard');
        break;
      case 1002: // Doctor
        navigate('/doctor/dashboard');
        break;
      case 1003: // Patient
        navigate('/patient/dashboard');
        break;
      default:
        navigate('/');
        break;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your.name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="/forgot-password" className="text-sm text-red-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
        <div className="px-8 pb-6 text-center">
          <p className="mt-4 text-xs text-gray-500">
            Admin portal is restricted to authorized personnel only
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
