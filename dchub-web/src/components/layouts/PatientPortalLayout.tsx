
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import PatientHorizontalNav from '../patient/PatientHorizontalNav';
import { UserCircle, Bell as BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PatientPortalLayoutProps {
  children: React.ReactNode;
}

const PatientPortalLayout: React.FC<PatientPortalLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b h-16 flex items-center px-4 sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/patient/dashboard" className="text-xl font-bold text-primary">
            DiaCare
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  <DropdownMenuItem className="cursor-pointer">
                    <div>
                      <p className="font-medium">Appointment Reminder</p>
                      <p className="text-sm text-muted-foreground">You have a dialysis appointment tomorrow at 10:00 AM.</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <div>
                      <p className="font-medium">Lab Results Ready</p>
                      <p className="text-sm text-muted-foreground">Your latest lab results are available for review.</p>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/patient/notifications" className="w-full cursor-pointer justify-center">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>John Smith</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/patient/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/patient">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <PatientHorizontalNav />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © 2023 DiaCare. All rights reserved.
          </p>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default PatientPortalLayout;
