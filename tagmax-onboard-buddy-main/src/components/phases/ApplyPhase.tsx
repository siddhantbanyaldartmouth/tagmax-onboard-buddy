import React from 'react';
import { Button } from '@/components/ui/button';
import { PhaseContainer } from '../PhaseContainer';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface ApplyPhaseProps {
  onNext: () => void;
  onBack: () => void;
}

export const ApplyPhase: React.FC<ApplyPhaseProps> = ({ onNext, onBack }) => {
  return (
    <PhaseContainer
      currentPhase={1}
      totalPhases={4}
      title="Apply Tag Max Device"
      subtitle="Secure your device in place"
    >
      <div className="space-y-6">
        {/* Step-by-step Instructions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Installation Steps</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-blue-900">Remove adhesive backing</p>
                <p className="text-sm text-blue-700 mt-1">
                  Peel off the protective film from the adhesive side of your Tag Max device
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-green-900">Position the device</p>
                <p className="text-sm text-green-700 mt-1">
                  Place the device on the prepared surface with the adhesive side down
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-purple-900">Press firmly</p>
                <p className="text-sm text-purple-700 mt-1">
                  Apply firm pressure for 10-15 seconds to ensure strong adhesion
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Placement Tips */}
        <div className="bg-accent/20 border border-accent rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Placement Tips</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Press from center outward to avoid air bubbles</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Ensure device is secure before releasing pressure</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Check that all edges are properly adhered</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <p className="font-medium text-success">Device Successfully Installed!</p>
          </div>
          <p className="text-sm text-success/80 mt-1">
            Your Tag Max device is now securely in place and ready to track your driving.
          </p>
        </div>

        <div className="flex gap-3 mt-auto">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={onNext}
            className="flex-1 flex items-center gap-2"
            variant="default"
          >
            Next: Take Photo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </PhaseContainer>
  );
};
