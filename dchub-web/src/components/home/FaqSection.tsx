
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const FaqSection = () => {
  const faqCategories = [
    {
      category: "General",
      questions: [
        {
          question: "What is Dialysis Connect Hub?",
          answer: "Dialysis Connect Hub is a comprehensive platform designed to streamline dialysis appointment management and provide educational resources for CKD patients. It connects patients, healthcare providers, and administrators to improve kidney care outcomes."
        },
        {
          question: "Who can use Dialysis Connect Hub?",
          answer: "The platform is designed for three main user groups: patients with CKD who require dialysis, healthcare staff managing dialysis centers, and administrators overseeing multiple centers and users."
        },
        {
          question: "Is my medical information secure on this platform?",
          answer: "Yes, Dialysis Connect Hub implements robust security measures to protect all user data, especially sensitive medical information. We comply with healthcare data protection regulations and use encryption to safeguard your information."
        }
      ]
    },
    {
      category: "For Patients",
      questions: [
        {
          question: "How do I book a dialysis appointment?",
          answer: "After logging into the Patient Portal, navigate to the 'Book Appointment' page. There, you can select available time slots from your assigned dialysis center. The booking process is straightforward and will guide you through each step."
        },
        {
          question: "Can I check my CKD stage through the platform?",
          answer: "Yes, the Patient Portal includes a 'CKD Stage' tool where you can input your eGFR or creatinine levels to determine your CKD stage. The system will also provide relevant advice based on your stage."
        }
      ]
    }
  ];

  return (
    <section id="faq" className="py-16 bg-light-gray-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-slate mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Common questions about Dialysis Connect Hub and CKD management
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, index) => (
            <Card key={index} className="mb-8">
              <CardHeader>
                <CardTitle>{category.category} Questions</CardTitle>
                <CardDescription>
                  Common questions about {category.category.toLowerCase()} aspects of the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center">
            <Button
              variant="outline"
              className="border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white"
              onClick={() => {
                const faqSection = document.getElementById('faq');
                if (faqSection) {
                  faqSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              See More FAQs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
