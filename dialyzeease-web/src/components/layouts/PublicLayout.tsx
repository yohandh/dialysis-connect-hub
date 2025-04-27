
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const isHomePage = location.pathname === '/';
  
  const navLinks = [
    { name: 'Home', path: '/', isSection: false },
    { name: 'About', path: '/#about', isSection: true },
    { name: 'Centers', path: '/centers', isSection: false },
    { name: 'CKD Awareness', path: '/ckd-awareness', isSection: false },
    { name: 'FAQ', path: '/#faq', isSection: true },
    { name: 'Contact', path: '/#contact', isSection: true },
  ];
  
  // Function to determine if a link is active
  const isLinkActive = (link: typeof navLinks[0]) => {
    // For the Home link, it's active when we're at exactly '/' with no hash
    // OR when we're at the top of the page (scrollY near 0)
    if (link.path === '/' && !link.isSection) {
      // If we're at the root path with no hash OR we're at the top of the page
      return (location.pathname === '/' && !location.hash) || 
             (location.pathname === '/' && scrollPosition < 100);
    }
    
    // For section links (About, FAQ, Contact)
    if (link.isSection) {
      // Only active when we're on the home page, the hash matches, and we're not at the top of the page
      return location.pathname === '/' && 
             location.hash === link.path.substring(link.path.indexOf('#')) && 
             scrollPosition >= 100;
    }
    
    // For regular page links (Centers, CKD Awareness)
    return location.pathname === link.path;
  };

  // Handle smooth scrolling for section links when on home page
  useEffect(() => {
    if (location.hash && isHomePage) {
      const targetId = location.hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash, isHomePage]);

  // Handle scroll to top button visibility and update scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
      
      // Toggle scroll-to-top button visibility
      if (currentPosition > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.isSection && !isHomePage) {
      e.preventDefault();
      navigate(link.path);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div id="top" className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="DialyzeEase Logo" className="h-10 mr-2" />
                <span className="text-xl font-bold text-gray-900">DialyzeEase</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 md:ml-auto">
              <nav className="flex flex-wrap gap-2 md:gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isLinkActive(link)
                        ? 'bg-medical-blue/10 text-medical-blue'
                        : 'text-gray-700 hover:text-medical-blue hover:bg-medical-blue/5'
                    }`}
                    onClick={(e) => handleLinkClick(e, link)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <Link to="/patient/login">
                <Button variant="outline" className="bg-medical-blue text-white hover:bg-medical-blue hover:text-white">
                  Patient Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">DialyzeEase</h3>
              <p className="max-w-md text-gray-300">
                Providing comprehensive dialysis management and CKD education to improve
                patient outcomes and quality of life.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#top" className="text-gray-300 hover:text-white">Home</a></li>
                  <li><Link to="/#about" className="text-gray-300 hover:text-white">About</Link></li>
                  <li><Link to="/ckd-awareness#top" className="text-gray-300 hover:text-white">CKD Awareness</Link></li>
                  <li><Link to="/#faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-white">Contact Us</h4>
                <address className="not-italic text-gray-300 space-y-2">
                  <p>DialyzeEase Headquarters</p>
                  <p>349, Jayantha Weerasekara Mawatha<br />Colombo, Western Province 01000, Sri Lanka</p>
                  <p>(94) 11 242 2335</p>
                  <p><a href="mailto:dialyzeease@gmail.com" className="hover:text-white">dialyzeease@gmail.com</a></p>
                </address>
              </div>              
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} DialyzeEase. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-medical-blue text-white shadow-lg transition-all hover:bg-medical-blue/90 focus:outline-none ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Back to top"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
}

export default PublicLayout;
