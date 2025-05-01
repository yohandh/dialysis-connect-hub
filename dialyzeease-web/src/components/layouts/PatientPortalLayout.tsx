
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { UserCircle, Bell as BellIcon, Calendar, Activity, BookOpen, User, Clipboard, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/patient/dashboard',
      icon: <User className="h-4 w-4" />
    },
    {
      name: 'Calendar',
      path: '/patient/calendar',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      name: 'Book Appointment',
      path: '/patient/book',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      name: 'CKD Stage',
      path: '/patient/ckd-stage',
      icon: <Activity className="h-4 w-4" />
    },
    {
      name: 'Recommendations',
      path: '/patient/recommendations',
      icon: <Clipboard className="h-4 w-4" />
    },
    {
      name: 'Education',
      path: '/patient/education',
      icon: <BookText className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b py-4 sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Link to="/patient/dashboard" className="flex items-center">
                <img src="/logo.png" alt="DialyzeEase Logo" className="h-10 mr-2" />
                <span className="text-xl font-bold text-gray-900">DialyzeEase</span>
              </Link>
            </div>
            <div className="flex items-center gap-6 md:ml-auto">
              <nav className="flex overflow-x-auto md:ml-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      location.pathname === item.path
                        ? "bg-medical-blue/10 text-medical-blue"
                        : "text-gray-700 hover:text-medical-blue hover:bg-medical-blue/5"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4 md:ml-auto">
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-medical-blue hover:bg-medical-blue/5">
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
                    <Button variant="ghost" size="icon" className="text-gray-700 hover:text-medical-blue hover:bg-medical-blue/5">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">DialyzeEase</h3>
              <p className="max-w-md text-gray-300">
                Providing comprehensive dialysis management and CKD education to improve
                patient outcomes and quality of life.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/patient/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link></li>
                  <li><Link to="/patient/calendar" className="text-gray-300 hover:text-white">Calendar</Link></li>
                  <li><Link to="/patient/education" className="text-gray-300 hover:text-white">Education</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-white">Contact Us</h4>
                <address className="not-italic text-gray-300 space-y-2">
                  <p>DialyzeEase Support</p>
                  <p>349, Jayantha Weerasekara Mawatha<br />Colombo, Western Province 01000, Sri Lanka</p>
                  <p>011 242 2335</p>
                  <p><a href="mailto:support@dialyzeease.org" className="hover:text-white">support@dialyzeease.org</a></p>
                </address>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} DialyzeEase. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default PatientPortalLayout;
