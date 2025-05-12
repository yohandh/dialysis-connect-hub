import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EducationTypeBadgeProps {
  type: string;  // Education material type (diet, lifestyle, monitoring, general)
  className?: string;
}

const EducationTypeBadge: React.FC<EducationTypeBadgeProps> = ({ type, className }) => {
  const getTypeVariant = (): "diet" | "lifestyle" | "monitoring" | "general" => {
    switch(type.toLowerCase()) {
      case 'diet':
        return 'diet';
      case 'lifestyle':
        return 'lifestyle';
      case 'monitoring':
        return 'monitoring';
      case 'general':
      default:
        return 'general';
    }
  };

  return (
    <Badge 
      variant={getTypeVariant()} 
      className={className}
    >
      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
    </Badge>
  );
};

export default EducationTypeBadge;
