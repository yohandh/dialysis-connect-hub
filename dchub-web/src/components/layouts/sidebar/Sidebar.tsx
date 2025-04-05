
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import SidebarNav from './SidebarNav';

interface SidebarProps {
  portalName: string;
  navLinks: Array<{
    name: string;
    path: string;
    icon?: React.ReactNode;
  }>;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const Sidebar = ({ 
  portalName, 
  navLinks, 
  isOpen, 
  onClose, 
  isMobile 
}: SidebarProps) => {
  return (
    <div className={cn(
      "bg-white shadow-lg z-30 fixed inset-y-0 left-0 transition-transform transform lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full",
      isMobile ? "w-64" : "w-64"
    )}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-kidney-red flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="font-bold text-xl">{portalName}</span>
        </Link>
        {isMobile && (
          <button onClick={onClose} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* Sidebar Navigation */}
      <SidebarNav navLinks={navLinks} onMobileClose={isMobile ? onClose : undefined} />
      
      {/* Sidebar Footer */}
      <div className="absolute bottom-0 w-full border-t p-4">
        <div className="flex flex-col items-center text-center">
          <div className="text-xs text-gray-500">© 2023 Dialysis Connect</div>
          <div className="text-xs text-gray-500">All Rights Reserved</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
