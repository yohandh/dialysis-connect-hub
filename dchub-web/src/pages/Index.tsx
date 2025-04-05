
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PublicLayout from '@/components/layouts/PublicLayout';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CkdStagesSection from '@/components/home/CkdStagesSection';
import AboutSection from '@/components/home/AboutSection';
import FaqSection from '@/components/home/FaqSection';
import ContactSection from '@/components/home/ContactSection';
import PortalSection from '@/components/home/PortalSection';
import CallToActionSection from '@/components/home/CallToActionSection';

const Index = () => {
  const location = useLocation();
  
  // Process the hash on initial load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <PublicLayout>
      <HeroSection />
      <HowItWorksSection />
      <CkdStagesSection />
      <AboutSection />
      <FaqSection />
      <ContactSection />
      <PortalSection />
      <CallToActionSection />
    </PublicLayout>
  );
};

export default Index;
