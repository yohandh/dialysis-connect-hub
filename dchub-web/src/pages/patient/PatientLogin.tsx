
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const PatientLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would authenticate with a backend
    if (email && password) {
      toast({
        title: "Login Successful",
        description: "Welcome to the Patient Portal.",
      });
      navigate('/patient/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
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
            <Button type="submit" className="w-full bg-medical-blue hover:bg-medical-blue/90 text-white">
              Login
            </Button>
          </CardFooter>
        </form>
        <div className="px-8 pb-6 text-center">
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
