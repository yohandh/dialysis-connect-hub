import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';

const PatientRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyContactNo: '',
    agreeToTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Registration Error",
        description: "Please enter your first and last name.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email) {
      toast({
        title: "Registration Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.password) {
      toast({
        title: "Registration Error",
        description: "Please enter a password.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Registration Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Registration Error",
        description: "You must agree to the terms and conditions.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Step 1: Create user with patient role
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        mobileNo: formData.mobileNo,
        password: formData.password,
        roleId: 1003, // Patient role
        status: 'active'
      };

      // Register the user
      const userResponse = await axios.post('/api/auth/register', userData);
      console.log('Registration response:', userResponse.data);
      
      // The response structure from the backend includes user object
      if (userResponse.data && userResponse.data.user && userResponse.data.user.id) {
        // Step 2: Create patient profile with additional details
        const patientData = {
          userId: userResponse.data.user.id,
          gender: formData.gender,
          dob: formData.dob,
          address: formData.address,
          bloodGroup: formData.bloodGroup,
          emergencyContact: formData.emergencyContact,
          emergencyContactNo: formData.emergencyContactNo
        };

        // Create patient profile - only if not already created during registration
        if (!userResponse.data.patient) {
          console.log('Creating patient profile with data:', patientData);
          try {
            const patientResponse = await axios.post('/api/patients', patientData);
            console.log('Patient creation response:', patientResponse.data);
          } catch (patientError) {
            console.error('Error creating patient profile:', patientError);
            // If this is a 'patient already exists' error, we can continue
            if (patientError.response?.status !== 400) {
              throw patientError;
            }
          }
        } else {
          console.log('Patient profile already created during registration');
        }

        // Show success message
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully!",
        });

        // Store success message in sessionStorage
        sessionStorage.setItem('registrationSuccess', 'Registration successful! You can now log in with your new account.');
        
        // Use direct location change for more reliable redirection
        setTimeout(() => {
          window.location.href = '/patient/login';
        }, 1000);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-t-4 border-medical-blue">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-medical-blue/10 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-medical-blue">Patient Registration</CardTitle>
          <CardDescription className="text-center">
            Create your account to access the Patient Portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  placeholder="John" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  placeholder="Doe" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="patient@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNo">Mobile Number</Label>
                <Input 
                  id="mobileNo" 
                  name="mobileNo"
                  placeholder="+1 (555) 123-4567" 
                  value={formData.mobileNo}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob" 
                  name="dob"
                  type="date" 
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                name="address"
                placeholder="123 Main St, City, State, ZIP" 
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select onValueChange={(value) => handleSelectChange('bloodGroup', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input 
                  id="emergencyContact" 
                  name="emergencyContact"
                  placeholder="Jane Doe" 
                  value={formData.emergencyContact}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactNo">Emergency Contact Number</Label>
                <Input 
                  id="emergencyContactNo" 
                  name="emergencyContactNo"
                  placeholder="+1 (555) 987-6543" 
                  value={formData.emergencyContactNo}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.agreeToTerms}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the terms and conditions *
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-medical-blue hover:bg-medical-blue/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/patient/login" className="text-medical-blue hover:underline">
                Login here
              </Link>
            </div>
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

export default PatientRegister;
