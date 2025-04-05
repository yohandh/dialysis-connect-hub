
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <Card>
      <CardHeader>
        <CardTitle>Education Resources</CardTitle>
        <CardDescription>Personalized content for your kidney health</CardDescription>
      </CardHeader>
      <CardContent>
        {educationContent && educationContent.length > 0 ? (
          <div className="space-y-4">
            {educationContent.slice(0, 3).map((content) => (
              <div key={content.id} className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium mb-1">{content.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{content.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {content.category}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
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
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/patient/education">Browse All Resources</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EducationResourcesCard;
