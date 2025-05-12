
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PublicLayout from '@/components/layouts/PublicLayout';

const Faq = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Chronic Kidney Disease (CKD)?</AccordionTrigger>
                <AccordionContent>
                  Chronic Kidney Disease (CKD) is a condition characterized by a gradual loss of kidney function over time. The kidneys filter wastes and excess fluid from the blood, which are then excreted in the urine. When chronic kidney disease reaches an advanced stage, dangerous levels of fluid, electrolytes, and wastes can build up in your body.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I book an appointment?</AccordionTrigger>
                <AccordionContent>
                  You can book an appointment through the patient portal by clicking on the "Book Appointment" option in the main menu. Select your preferred date, time, and center, then confirm your booking. You'll receive a confirmation notification once your appointment is successfully scheduled.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>What should I bring to my dialysis appointment?</AccordionTrigger>
                <AccordionContent>
                  You should bring your identification card, insurance information, a current list of medications, any relevant medical records, comfortable clothing, and personal items to help pass the time during treatment (such as books, tablets, or headphones). Please also bring any new symptoms or concerns to discuss with your healthcare provider.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>How long does a dialysis session typically last?</AccordionTrigger>
                <AccordionContent>
                  A typical hemodialysis session lasts about 3-4 hours and is usually performed three times a week. Peritoneal dialysis, on the other hand, is performed daily and can be done at home. The exact duration and frequency will depend on your specific medical needs as determined by your healthcare provider.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How can I update my personal information?</AccordionTrigger>
                <AccordionContent>
                  You can update your personal information by accessing your profile in the patient portal. Click on the "Profile" option in the main menu, then select "Edit Profile" to make changes to your contact information, address, emergency contacts, or notification preferences.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>What dietary restrictions should I follow with CKD?</AccordionTrigger>
                <AccordionContent>
                  Dietary restrictions for CKD patients vary depending on the stage of kidney disease and individual health needs. Generally, patients may need to limit intake of sodium, potassium, phosphorus, and sometimes protein. It's important to work with a renal dietitian who can create a personalized meal plan based on your specific needs and laboratory results.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger>How do I contact support?</AccordionTrigger>
                <AccordionContent>
                  You can contact our support team by clicking on the "Contact Support" option in the Help menu, emailing support@example.com, or calling our helpline at 1-800-123-4567 during business hours. For urgent medical concerns, please contact your healthcare provider directly or visit the nearest emergency room.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default Faq;
