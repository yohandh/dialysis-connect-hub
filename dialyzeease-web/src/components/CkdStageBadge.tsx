
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CkdStageBadgeProps {
  stage: number;  // CKD Stage (1-5)
  className?: string;
}

const CkdStageBadge: React.FC<CkdStageBadgeProps> = ({ stage, className }) => {
  const getStageVariant = (): "stage1" | "stage2" | "stage3" | "stage4" | "stage5" => {
    switch(stage) {
      case 1:
        return 'stage1';
      case 2:
        return 'stage2';
      case 3:
        return 'stage3';
      case 4:
        return 'stage4';
      case 5:
        return 'stage5';
      default:
        return 'stage3'; // Default to stage 3 if invalid
    }
  };

  return (
    <Badge 
      variant={getStageVariant()} 
      className={className}
    >
      Stage {stage}
    </Badge>
  );
};

export default CkdStageBadge;
