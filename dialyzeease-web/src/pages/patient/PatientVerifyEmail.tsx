import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const PatientVerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (!token) {
          setVerificationStatus('error');
          setMessage('Verification token is missing. Please check your email link.');
          return;
        }

        // Call API to verify email
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        
        setVerificationStatus('success');
        setMessage(response.data.message || 'Email verified successfully! You can now log in.');
        
        // Show success toast
        toast({
          title: 'Email Verified',
          description: 'Your email has been successfully verified.',
        });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/patient/login');
        }, 3000);
      } catch (error: any) {
        setVerificationStatus('error');
        setMessage(error.response?.data?.message || 'Failed to verify email. The token may be invalid or expired.');
        
        // Show error toast
        toast({
          title: 'Verification Failed',
          description: 'Failed to verify your email. Please try again or contact support.',
          variant: 'destructive',
        });
      }
    };

    verifyEmail();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-medical-blue">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-medical-blue/10 rounded-full p-3">
              {verificationStatus === 'loading' && (
                <Loader2 className="h-8 w-8 text-medical-blue animate-spin" />
              )}
              {verificationStatus === 'success' && (
                <CheckCircle className="h-8 w-8 text-green-500" />
              )}
              {verificationStatus === 'error' && (
                <XCircle className="h-8 w-8 text-red-500" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-medical-blue">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === 'loading' && 'Please wait while we verify your email address'}
            {verificationStatus === 'success' && 'Your email has been successfully verified'}
            {verificationStatus === 'error' && 'There was a problem verifying your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className={`text-lg ${
            verificationStatus === 'success' ? 'text-green-600' : 
            verificationStatus === 'error' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {message}
          </p>
          
          {verificationStatus === 'success' && (
            <p className="text-sm text-gray-500">
              You will be redirected to the login page in a few seconds...
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={() => navigate('/patient/login')} 
            className="w-full bg-medical-blue hover:bg-medical-blue/90 text-white"
          >
            Go to Login
          </Button>
        </CardFooter>
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

export default PatientVerifyEmail;
