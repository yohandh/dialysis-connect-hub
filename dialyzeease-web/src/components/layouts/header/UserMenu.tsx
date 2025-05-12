
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, Settings } from 'lucide-react';

interface UserMenuProps {
  userName: string;
  userRole: string;
  userImage?: string;
}

const UserMenu = ({ userName, userRole, userImage }: UserMenuProps) => {
  const navigate = useNavigate();
  
  const handleAccountSettings = () => {
    // Determine the correct account settings path based on the current path
    const path = window.location.pathname;
    
    if (path.includes('/admin')) {
      navigate('/admin/account-settings');
    } else if (path.includes('/staff')) {
      navigate('/staff/account-settings');
    } else if (path.includes('/patient')) {
      navigate('/patient/profile');
    } else {
      navigate('/account-settings');
    }
  };
  
  const handleSignOut = () => {
    navigate('/');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">{userName}</div>
            <div className="text-xs text-gray-500">{userRole}</div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col p-2 space-y-1 md:hidden">
          <p className="text-sm font-medium">{userName}</p>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
        {/* 
        <DropdownMenuSeparator className="md:hidden" />
        <DropdownMenuItem onClick={handleAccountSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem> 
        */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
