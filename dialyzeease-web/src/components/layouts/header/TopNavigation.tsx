
import React from 'react';
import { Menu } from 'lucide-react';
import NotificationButton from './NotificationButton';
import HelpButton from './HelpButton';
import UserMenu from './UserMenu';

interface TopNavigationProps {
  portalName: string;
  userName: string;
  userRole: string;
  userImage?: string;
  onToggleSidebar: () => void;
  isMobile: boolean;
}

const TopNavigation = ({ 
  portalName, 
  userName, 
  userRole, 
  userImage, 
  onToggleSidebar,
  isMobile
}: TopNavigationProps) => {
  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center px-4 sticky top-0 z-20">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button onClick={onToggleSidebar} className="lg:hidden mr-4">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold hidden sm:block">{portalName}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationButton />
          <HelpButton />
          <UserMenu 
            userName={userName} 
            userRole={userRole} 
            userImage={userImage} 
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
