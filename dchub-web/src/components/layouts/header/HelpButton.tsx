
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Book, FileQuestion, HeartPulse, ExternalLink, BookOpen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';

const HelpButton = () => {
  const navigate = useNavigate();

  const handleAction = (path: string) => {
    navigate(path);
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Help & Resources</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction('/resources/guide')}>
                <Book className="mr-2 h-4 w-4" />
                <span>User Guide</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('/resources/faq')}>
                <FileQuestion className="mr-2 h-4 w-4" />
                <span>FAQ</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('/resources/ckd')}>
                <HeartPulse className="mr-2 h-4 w-4" />
                <span>CKD Resources</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('/admin/education')}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Manage Education</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction('/support')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Contact Support</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>Help & Resources</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpButton;
