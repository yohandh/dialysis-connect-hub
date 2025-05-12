
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EducationTypeBadge from '@/components/EducationTypeBadge';

export interface EducationContent {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface EducationResourcesCardProps {
  educationContent: EducationContent[] | undefined;
}

const EducationResourcesCard: React.FC<EducationResourcesCardProps> = ({ educationContent }) => {
  return (
    <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="text-medical-blue">Education Resources</CardTitle>
        <CardDescription>Personalized content for your kidney health</CardDescription>
      </CardHeader>
      <CardContent>
        {educationContent && educationContent.length > 0 ? (
          <div className="space-y-4">
            {educationContent.slice(0, 3).map((content) => (
              <div key={content.id} className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium mb-1 text-medical-blue">{content.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{content.description}</p>
                <div className="flex items-center justify-between">
                  <EducationTypeBadge type={content.category} />
                  <Button variant="ghost" size="sm" asChild className="text-medical-blue hover:bg-medical-blue/10">
                    <Link to={`/patient/education/${content.id}`}>
                      Read More
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No education content available</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-blue-50/50">
        <Button className="w-full bg-medical-blue text-white hover:bg-medical-blue/90" asChild>
          <Link to="/patient/education">Browse All Resources</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EducationResourcesCard;
