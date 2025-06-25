import { SignIn } from "@clerk/clerk-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export default function SignInPage() {
  const { user, isLoaded } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoaded && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoaded, setLocation]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-2xl font-bold text-white">FAQforge</span>
          </div>
          <p className="text-gray-300">Sign in to access your dashboard</p>
        </div>
        <SignIn 
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-900 border border-gray-700",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-300",
              socialButtonsBlockButton: "bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
              formFieldInput: "bg-gray-800 border-gray-600 text-white",
              formButtonPrimary: "bg-gradient-to-r from-primary to-secondary hover:opacity-90",
              footerActionLink: "text-primary hover:text-secondary"
            }
          }}
        />
      </div>
    </div>
  );
}