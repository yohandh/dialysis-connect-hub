
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './sidebar/Sidebar';
import TopNavigation from './header/TopNavigation';

interface PortalLayoutProps {
  children: React.ReactNode;
  portalName: string;
  navLinks: Array<{
    name: string;
    path: string;
    icon?: React.ReactNode;
  }>;
  userName: string;
  userRole: string;
  userImage?: string;
}

const PortalLayout = ({ 
  children, 
  portalName,
  navLinks,
  userName,
  userRole,
  userImage
}: PortalLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        portalName={portalName}
        navLinks={navLinks}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />
      
      {/* Content Area */}
      <div className="flex-1">
        {/* Top Navigation */}
        <TopNavigation 
          portalName={portalName}
          userName={userName}
          userRole={userRole}
          userImage={userImage}
          onToggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
      
      {/* Mobile Sidebar Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default PortalLayout;
