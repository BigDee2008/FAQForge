import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import { useLocation } from "wouter";

export default function Navigation() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-white">FAQforge</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-gray-300 hover:text-primary transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-gray-300 hover:text-primary transition-colors"
            >
              Pricing
            </button>
            {user ? (
              <Button 
                onClick={() => setLocation('/dashboard')}
                className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
              >
                Dashboard
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={() => setLocation('/sign-in')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                  onClick={() => setLocation('/sign-up')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
