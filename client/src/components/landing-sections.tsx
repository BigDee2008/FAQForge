import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SignUpButton } from "@clerk/clerk-react";
import { 
  Lightbulb, 
  Code, 
  Copy, 
  Smartphone, 
  Search, 
  Zap,
  Check
} from "lucide-react";

export function HeroSection() {
  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-cyan-900/20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Generate Professional{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            FAQs with AI
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Create comprehensive FAQ sections for your website in seconds. Our AI understands your business and generates relevant questions with detailed answers, plus clean HTML code ready to copy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 text-lg font-semibold hover:opacity-90 shadow-lg"
            onClick={() => window.location.href = '/sign-up'}
          >
            Start Generating FAQs
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={scrollToFeatures}
            className="border-gray-600 text-gray-300 px-8 py-4 text-lg font-semibold hover:bg-gray-800"
          >
            See Features
          </Button>
        </div>
        <div className="mt-12">
          <Card className="max-w-4xl mx-auto shadow-2xl bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <Card className="p-4 shadow-sm bg-gray-700 border-gray-600">
                    <h4 className="font-medium text-white">How does your service work?</h4>
                    <p className="text-gray-300 text-sm mt-1">Our platform uses advanced AI to analyze your business...</p>
                  </Card>
                  <Card className="p-4 shadow-sm bg-gray-700 border-gray-600">
                    <h4 className="font-medium text-white">What are your pricing options?</h4>
                    <p className="text-gray-300 text-sm mt-1">We offer flexible pricing plans to suit businesses...</p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: Lightbulb,
      title: "AI-Powered Generation",
      description: "Advanced AI analyzes your business description to create relevant, comprehensive FAQ questions and answers.",
      color: "bg-gradient-to-br from-primary to-blue-500"
    },
    {
      icon: Code,
      title: "Clean HTML Output",
      description: "Get production-ready HTML and CSS code with proper semantic structure and responsive design.",
      color: "bg-gradient-to-br from-secondary to-purple-500"
    },
    {
      icon: Copy,
      title: "One-Click Copy",
      description: "Copy generated code to your clipboard instantly and paste directly into your website or CMS.",
      color: "bg-gradient-to-br from-accent to-cyan-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Generated FAQs automatically work perfectly on all devices with responsive design built-in.",
      color: "bg-gradient-to-br from-purple-600 to-pink-500"
    },
    {
      icon: Search,
      title: "SEO Optimized",
      description: "Generated FAQs include proper schema markup and semantic HTML for better search engine visibility.",
      color: "bg-gradient-to-br from-indigo-600 to-blue-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate comprehensive FAQ sections in seconds, not hours. Save time and focus on your business.",
      color: "bg-gradient-to-br from-pink-600 to-red-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to create perfect FAQs
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our AI-powered platform makes it easy to generate, customize, and implement professional FAQ sections.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start for free and generate professional FAQ sections for your business.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Card className="relative bg-gray-900 border-gray-700 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-white mb-2">Free Plan</h3>
              <div className="text-4xl font-bold mb-6 text-white">
                $0
                <span className="text-base font-normal text-gray-300">
                  /forever
                </span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-3 text-accent" />
                  <span className="text-gray-300">3 FAQ generations per day</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-3 text-accent" />
                  <span className="text-gray-300">Professional HTML + CSS output</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-3 text-accent" />
                  <span className="text-gray-300">Multiple FAQ styles</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-3 text-accent" />
                  <span className="text-gray-300">Copy-to-clipboard functionality</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-3 text-accent" />
                  <span className="text-gray-300">Mobile responsive design</span>
                </li>
              </ul>
              <Button 
                className="w-full py-3 px-6 font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                onClick={() => window.location.href = '/sign-up'}
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">FAQforge</span>
            </div>
            <p className="text-gray-400 mb-4">
              Generate professional FAQ sections with AI-powered technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>
          <div></div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 FAQforge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
