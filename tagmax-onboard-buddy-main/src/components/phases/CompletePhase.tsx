import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PhaseContainer } from '../PhaseContainer';
import { CheckCircle, PartyPopper, Home, Phone, Mail } from 'lucide-react';

interface CompletePhaseProps {
  licensePlate?: string;
}

export const CompletePhase: React.FC<CompletePhaseProps> = ({ licensePlate }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation on mount
    setShowConfetti(true);
    
    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleFinishSetup = () => {
    // Close the browser tab
    window.close();
  };

  return (
    <PhaseContainer
      currentPhase={3}
      totalPhases={4}
      title="Setup Complete!"
      subtitle="Your Tag Max device is ready to go"
    >
      <div className="space-y-6">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute top-1/4 left-1/4 animate-bounce">
              <PartyPopper className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-bounce delay-100">
              <PartyPopper className="w-6 h-6 text-pink-500" />
            </div>
            <div className="absolute top-1/2 left-1/3 animate-bounce delay-200">
              <PartyPopper className="w-7 h-7 text-blue-500" />
            </div>
            <div className="absolute top-2/3 right-1/3 animate-bounce delay-300">
              <PartyPopper className="w-5 h-5 text-green-500" />
            </div>
            <div className="absolute top-3/4 left-1/2 animate-bounce delay-500">
              <PartyPopper className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        )}

        {/* Success Message */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-muted-foreground">
              Your Tag Max device has been successfully set up and is now tracking your driving.
            </p>
          </div>
        </div>

        {/* Vehicle Information */}
        {licensePlate && (
          <div className="bg-accent/20 border border-accent rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">Vehicle Information</h3>
            <p className="text-sm text-muted-foreground">
              License Plate: <span className="font-mono font-semibold">{licensePlate}</span>
            </p>
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">What's Next?</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Home className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Start Driving</p>
                <p className="text-sm text-blue-700">
                  Your device will automatically begin tracking your driving behavior
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Data Collection</p>
                <p className="text-sm text-green-700">
                  Your driving data will be securely collected and analyzed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-muted/30 border rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-3">Need Help?</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Call: 1-800-TAG-MAX</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email: solotagsupport@cmtelematics.com</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-auto">
          <Button
            onClick={handleFinishSetup}
            className="w-full text-lg py-6 font-semibold"
            variant="default"
          >
            Finish Setup
          </Button>
        </div>
      </div>
    </PhaseContainer>
  );
};
