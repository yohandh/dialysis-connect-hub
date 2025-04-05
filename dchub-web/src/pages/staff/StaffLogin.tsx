
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { validateCredentials } from '@/data/loginCredentials';

const StaffLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const credential = validateCredentials(email, password);
    
    if (credential && credential.role === "staff") {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${credential.name}`,
      });
      navigate('/staff/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password for staff access.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-medical-blue/10 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Staff Portal</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the Staff Portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="staff@example.com" 
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
            <Button type="submit" className="w-full bg-medical-blue hover:bg-medical-blue/90">
              Login
            </Button>
          </CardFooter>
        </form>
        <div className="px-8 pb-6 text-center">
          <p className="mt-4 text-xs text-gray-500">
            Staff portal is secure and follows HIPAA compliance
          </p>
        </div>
      </Card>
    </div>
  );
};

export default StaffLogin;
