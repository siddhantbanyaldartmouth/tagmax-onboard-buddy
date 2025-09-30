import React from 'react';
import { Button } from '@/components/ui/button';
import { PhaseContainer } from '../PhaseContainer';
import { MapPin, Smartphone, Wifi } from 'lucide-react';

interface LocatePhaseProps {
  onNext: () => void;
  onBack: () => void;
}

export const LocatePhase: React.FC<LocatePhaseProps> = ({ onNext, onBack }) => {
  return (
    <PhaseContainer
      currentPhase={1}
      totalPhases={4}
      title="Locate Installation Spot"
      subtitle="Find the perfect spot for your Tag Max device"
    >
      <div className="space-y-6">
        {/* Installation Guidelines */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Important Guidelines</h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-blue-900">Clean thoroughly with alcohol pad</p>
                <p className="text-sm text-blue-700 mt-1">
                  Use the provided alcohol pad to clean the installation surface completely
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-blue-900">Ensure surface is completely dry</p>
                <p className="text-sm text-blue-700 mt-1">
                  Wait for the surface to be completely dry before applying the device
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-green-900">Choose optimal location</p>
                <p className="text-sm text-green-700 mt-1">
                  Select a flat, clean surface on your windshield or dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Location Requirements</h3>
          
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Flat Surface</p>
                <p className="text-sm text-muted-foreground">Choose a level, non-curved area</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Smartphone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Easy Access</p>
                <p className="text-sm text-muted-foreground">Ensure you can easily reach the device</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Wifi className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Good Signal</p>
                <p className="text-sm text-muted-foreground">Avoid metal objects that block signal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Guide */}
        <div className="bg-accent/20 border border-accent rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Recommended Locations</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Upper corner of windshield (driver's side)</p>
            <p>• Dashboard (away from air vents)</p>
            <p>• Center console (if flat surface available)</p>
          </div>
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
            className="flex-1"
            variant="default"
          >
            Next: Apply Device
          </Button>
        </div>
      </div>
    </PhaseContainer>
  );
};
