
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, Activity, BookOpen, User, Bell, Clipboard, BookText } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const PatientHorizontalNav: React.FC = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
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
    },
    { 
      name: 'Notifications', 
      path: '/patient/notifications',
      icon: <Bell className="h-4 w-4" />
    }
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                location.pathname === item.path
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default PatientHorizontalNav;
