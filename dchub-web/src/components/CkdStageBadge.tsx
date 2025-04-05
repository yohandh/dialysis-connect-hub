
import React from 'react';

interface CkdStageBadgeProps {
  stage: number;  // CKD Stage (1-5)
}

const CkdStageBadge: React.FC<CkdStageBadgeProps> = ({ stage }) => {
  const getClassNames = () => {
    switch(stage) {
      case 1:
        return 'kidney-stage-1';
      case 2:
        return 'kidney-stage-2';
      case 3:
        return 'kidney-stage-3';
      case 4:
        return 'kidney-stage-4';
      case 5:
        return 'kidney-stage-5';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`${getClassNames()} px-3 py-1 text-xs font-medium rounded-full`}>
      Stage {stage}
    </span>
  );
};

export default CkdStageBadge;
