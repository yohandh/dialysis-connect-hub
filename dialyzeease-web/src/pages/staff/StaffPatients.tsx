import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, UserPlus } from 'lucide-react';
import { patients } from '@/data/patientData';
import { users } from '@/data/userData';
import { Link } from 'react-router-dom';
import { getUserFirstName, getUserLastName, isSameId } from '@/utils/userUtils';
import CkdStageBadge from '@/components/CkdStageBadge';

const StaffPatients = () => {
  const [search, setSearch] = useState('');
  
  // Combine patients data with user data
  const patientsWithUserInfo = patients.map(patient => {
    const user = users.find(u => isSameId(u.id, patient.userId));
    return {
      ...patient,
      firstName: user ? getUserFirstName(user) : '',
      lastName: user ? getUserLastName(user) : '',
      email: user?.email || '',
    };
  });
  
  // Filter patients based on search
  const filteredPatients = patientsWithUserInfo.filter(patient => 
    patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
    patient.email.toLowerCase().includes(search.toLowerCase())
  );
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dark-slate">Patients</h1>
        <Button className="bg-medical-blue hover:bg-medical-blue/90">
          <UserPlus className="mr-2 h-4 w-4" /> Add Patient
        </Button>
      </div>
      
      <Card className="border-medical-blue/20 mb-6">
        <CardHeader className="bg-medical-blue/5">
          <CardTitle className="text-medical-blue flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Patient Directory
          </CardTitle>
          <CardDescription>
            View and manage all patients in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name or email"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="ml-4">
              <Button variant="outline" onClick={() => setSearch('')}>
                Clear
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>CKD Stage</TableHead>
                <TableHead>Primary Nephrologist</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    {patient.firstName} {patient.lastName}
                  </TableCell>
                  <TableCell>
                    {calculateAge(patient.dateOfBirth)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {patient.gender}
                  </TableCell>
                  <TableCell>
                    <CkdStageBadge stage={patient.ckdStage} />
                  </TableCell>
                  <TableCell>
                    {patient.primaryNephrologist}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{patient.bloodType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/staff/patient/${patient.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredPatients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No patients match your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-medical-blue/5">
            <CardTitle className="text-medical-blue text-lg">CKD Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(stage => {
                const count = patients.filter(p => p.ckdStage === stage).length;
                const percentage = Math.round((count / patients.length) * 100);
                
                let stageColorClass;
                if (stage <= 2) stageColorClass = 'bg-success-green';
                else if (stage === 3) stageColorClass = 'bg-warning-yellow';
                else stageColorClass = 'bg-danger-red';
                
                return (
                  <div key={stage} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className={`h-3 w-3 rounded-full ${stageColorClass} mr-2`}></span>
                        <span className="text-sm font-medium">Stage {stage}</span>
                      </div>
                      <span className="text-sm">{count} patients ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${stageColorClass}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-medical-blue/5">
            <CardTitle className="text-medical-blue text-lg">Access Type</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {['fistula', 'graft', 'catheter', undefined].map(accessType => {
                const label = accessType || 'None';
                const count = patients.filter(p => p.accessType === accessType).length;
                const percentage = Math.round((count / patients.length) * 100);
                
                return (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{label}</span>
                      <span className="text-sm">{count} patients ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-medical-blue"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-medical-blue/5">
            <CardTitle className="text-medical-blue text-lg">Patient Gender</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {['male', 'female', 'other'].map(gender => {
                const count = patients.filter(p => p.gender === gender).length;
                const percentage = Math.round((count / patients.length) * 100);
                
                return (
                  <div key={gender} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{gender}</span>
                      <span className="text-sm">{count} patients ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          gender === 'male' ? 'bg-blue-500' : 
                          gender === 'female' ? 'bg-pink-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffPatients;
