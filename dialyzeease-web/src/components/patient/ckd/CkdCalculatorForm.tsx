
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { addCkdRecord, AddCkdRecordRequest } from '@/api/patientApi';

interface CkdCalculatorFormProps {
  onCalculate: (stage: number) => void;
  refetchHistory: () => void;
}

const CkdCalculatorForm: React.FC<CkdCalculatorFormProps> = ({ onCalculate, refetchHistory }) => {
  const [calculationMethod, setCalculationMethod] = useState<'egfr' | 'creatinine'>('egfr');
  const [egfr, setEgfr] = useState<string>('');
  const [creatinine, setCreatinine] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('');
  
  // Mutation for adding new CKD record
  const addCkdRecordMutation = useMutation({
    mutationFn: (data: AddCkdRecordRequest) => addCkdRecord(data),
    onSuccess: () => {
      // Refetch CKD history after adding a new record
      refetchHistory();
    },
  });
  
  const calculateStageFromEgfr = (egfrValue: number) => {
    if (egfrValue >= 90) return 1;
    if (egfrValue >= 60) return 2;
    if (egfrValue >= 30) return 3;
    if (egfrValue >= 15) return 4;
    return 5;
  };
  
  const calculateEgfrFromCreatinine = (creatinineValue: number, ageValue: number, genderValue: string) => {
    // This is a simplified version of the CKD-EPI equation
    let egfr = 0;
    
    if (genderValue === 'female') {
      egfr = 166 * Math.pow(creatinineValue/0.7, -0.329) * Math.pow(0.993, ageValue);
      if (creatinineValue <= 0.7) {
        egfr = 166 * Math.pow(creatinineValue/0.7, -0.329) * Math.pow(0.993, ageValue);
      } else {
        egfr = 166 * Math.pow(creatinineValue/0.7, -1.209) * Math.pow(0.993, ageValue);
      }
    } else {
      if (creatinineValue <= 0.9) {
        egfr = 163 * Math.pow(creatinineValue/0.9, -0.411) * Math.pow(0.993, ageValue);
      } else {
        egfr = 163 * Math.pow(creatinineValue/0.9, -1.209) * Math.pow(0.993, ageValue);
      }
    }
    
    return Math.round(egfr);
  };
  
  const handleCalculate = () => {
    try {
      let stage: number | null = null;
      let calculatedEgfr = 0;
      let calculatedCreatinine = 0;
      
      if (calculationMethod === 'egfr') {
        const egfrValue = parseFloat(egfr);
        if (isNaN(egfrValue) || egfrValue <= 0) {
          toast("Please enter a valid eGFR value.");
          return;
        }
        calculatedEgfr = egfrValue;
        calculatedCreatinine = 0; // We don't know the creatinine value in this case
        stage = calculateStageFromEgfr(egfrValue);
      } else {
        const creatinineValue = parseFloat(creatinine);
        const ageValue = parseInt(age);
        
        if (isNaN(creatinineValue) || creatinineValue <= 0 || isNaN(ageValue) || ageValue <= 0) {
          toast("Please enter valid values for all fields.");
          return;
        }
        
        calculatedEgfr = calculateEgfrFromCreatinine(creatinineValue, ageValue, gender);
        calculatedCreatinine = creatinineValue;
        stage = calculateStageFromEgfr(calculatedEgfr);
      }
      
      // Add record to CKD history
      if (stage !== null) {
        // Save the CKD data to the API
        addCkdRecordMutation.mutate({
          eGFR: calculatedEgfr,
          creatinine: calculatedCreatinine,
          notes: `Calculated with ${calculationMethod} method`
        });
        
        onCalculate(stage);
        
        toast(`Your CKD Stage is: ${stage}`);
      }
    } catch (error) {
      toast("There was an error calculating your CKD stage. Please try again.");
    }
  };
  
  return (
    <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="text-medical-blue">Calculate Your CKD Stage</CardTitle>
        <CardDescription>
          Enter your lab values to determine your current CKD stage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="egfr" onValueChange={(v) => setCalculationMethod(v as 'egfr' | 'creatinine')}>
          <TabsList className="grid w-full grid-cols-2 bg-medical-blue/10">
            <TabsTrigger value="egfr" className="data-[state=active]:bg-medical-blue data-[state=active]:text-white">Using eGFR</TabsTrigger>
            <TabsTrigger value="creatinine" className="data-[state=active]:bg-medical-blue data-[state=active]:text-white">Using Creatinine</TabsTrigger>
          </TabsList>
          
          <TabsContent value="egfr" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="egfr">Enter your eGFR value (mL/min/1.73m²)</Label>
              <Input
                id="egfr"
                type="number"
                placeholder="e.g., 45"
                value={egfr}
                onChange={(e) => setEgfr(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                eGFR stands for estimated Glomerular Filtration Rate and measures your kidney function.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="creatinine" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="creatinine">Enter your serum creatinine value (mg/dL)</Label>
                <Input
                  id="creatinine"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.2"
                  value={creatinine}
                  onChange={(e) => setCreatinine(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Enter your age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 65"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select your gender at birth</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          onClick={handleCalculate}
          className="w-full mt-6 bg-medical-blue text-white hover:bg-medical-blue/90"
          disabled={addCkdRecordMutation.isPending}
        >
          {addCkdRecordMutation.isPending ? "Calculating..." : "Calculate CKD Stage"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CkdCalculatorForm;
