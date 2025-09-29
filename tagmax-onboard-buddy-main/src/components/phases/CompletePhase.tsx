import React from 'react';
import { Button } from '@/components/ui/button';
import { PhaseContainer } from '../PhaseContainer';
import { CheckCircle, Home } from 'lucide-react';

interface CompletePhaseProps {
  licensePlate?: string;
}

export const CompletePhase: React.FC<CompletePhaseProps> = ({ licensePlate }) => {
  const handleComplete = () => {
    // In a real app, this might redirect to a success page or close the onboarding
    window.location.reload();
  };

  return (
    <PhaseContainer
      currentPhase={3}
      totalPhases={4}
      title="Installation Complete!"
      subtitle="Thank you for setting up Tag Max"
    >
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-success mx-auto" />
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              🎉 All Done!
            </h2>
            <p className="text-muted-foreground">
              Your Tag Max has been successfully set up for vehicle:
            </p>
            {licensePlate && (
              <div className="bg-accent/20 px-4 py-2 rounded-lg inline-block">
                <span className="font-mono font-bold text-lg">
                  {licensePlate}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
          <h4 className="font-medium text-success mb-2">What's Next?</h4>
          <ul className="text-sm text-success/80 space-y-1">
            <li>• Your Tag Max is now active and charging</li>
            <li>• Data will be synced within 24 hours</li>
            <li>• You'll receive confirmation via email</li>
            <li>• Your device will start working immediately</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 text-center">
          <div className="space-y-3 text-sm">
            <div>
              <strong>Need Help?</strong>
              <br />
              <a href="https://signup.cmt-alpha.cmtelematics.com/faq" className="text-blue-600 underline">
                Visit our FAQ
              </a>
            </div>
            <div>
              <strong>Support:</strong>
              <br />
              <a href="mailto:solotagsupport@cmtelematics.com" className="text-blue-600 underline">
                solotagsupport@cmtelematics.com
              </a>
            </div>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          className="w-full flex items-center gap-2"
          variant="default"
        >
          <Home className="w-4 h-4" />
          Finish Setup
        </Button>
      </div>
    </PhaseContainer>
  );
};