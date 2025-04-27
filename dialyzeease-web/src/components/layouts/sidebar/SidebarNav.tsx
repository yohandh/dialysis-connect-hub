
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react'; // Import BookOpen icon for education

interface SidebarNavProps {
  navLinks: Array<{
    name: string;
    path: string;
    icon?: React.ReactNode;
  }>;
  onMobileClose?: () => void;
}

const SidebarNav = ({ navLinks, onMobileClose }: SidebarNavProps) => {
  const location = useLocation();
  
  return (
    <nav className="px-2 py-4">
      <ul className="space-y-1">
        {navLinks.map((item, i) => (
          <li key={i}>
            <Link 
              to={item.path} 
              className={cn(
                "flex items-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100",
                location.pathname === item.path ? "bg-gray-100 font-medium" : ""
              )}
              onClick={onMobileClose}
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
