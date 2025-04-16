
import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CKDStage } from '@/data/ckdData';

interface DietLifestyleCardProps {
  ckdStageInfo: CKDStage | undefined;
}

const DietLifestyleCard: React.FC<DietLifestyleCardProps> = ({ ckdStageInfo }) => {
  return (
    <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-100">
        <CardTitle className="text-sm font-medium text-medical-blue">
          Diet & Lifestyle
        </CardTitle>
        <Utensils className="h-4 w-4 text-medical-blue" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="text-xs text-muted-foreground mb-1">Dietary Recommendations:</h4>
            <ul className="text-xs space-y-1">
              {ckdStageInfo?.recommendations.diet.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-baseline">
                  <span className="h-1 w-1 rounded-full bg-medical-blue mr-2 mt-1"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs text-muted-foreground mb-1">Lifestyle Tips:</h4>
            <ul className="text-xs space-y-1">
              {ckdStageInfo?.recommendations.lifestyle.slice(0, 2).map((item, i) => (
                <li key={i} className="flex items-baseline">
                  <span className="h-1 w-1 rounded-full bg-medical-blue mr-2 mt-1"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-blue-50/50">
        <Link to="/patient/recommendations" className="text-xs text-center w-full text-medical-blue hover:underline">
          View all recommendations
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DietLifestyleCard;
