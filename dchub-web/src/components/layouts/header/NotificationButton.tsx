
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NotificationButtonProps {
  count?: number;
}

const NotificationButton = ({ count = 3 }: NotificationButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-kidney-red text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
                {count}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotificationButton;
