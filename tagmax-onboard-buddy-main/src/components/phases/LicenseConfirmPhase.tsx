import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { PhaseContainer } from '../PhaseContainer';
import { VehicleData } from '@/hooks/useOnboardingFlow';
import { Check, Edit } from 'lucide-react';

interface LicenseConfirmPhaseProps {
  vehicleData: VehicleData;
  onUpdate: (data: Partial<VehicleData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LicenseConfirmPhase: React.FC<LicenseConfirmPhaseProps> = ({
  vehicleData,
  onUpdate,
  onNext,
  onBack
}) => {
  const [nickname, setNickname] = useState(vehicleData.nickname || '');

  const handleConfirm = () => {
    onUpdate({ nickname: nickname.trim() || undefined });
    onNext();
  };

  return (
    <PhaseContainer
      currentPhase={0}
      totalPhases={4}
      title="Confirm Vehicle Details"
    >
      <div className="space-y-6">
        <Card className="p-4 bg-accent/20 border-accent">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">State:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{vehicleData.state}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">License Plate:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold">
                  {vehicleData.licensePlate}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div>
          <Label htmlFor="nickname">Vehicle Nickname (Optional)</Label>
          <Input
            id="nickname"
            placeholder="e.g., My Car, Work Truck, etc."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={50}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Give your vehicle a friendly name for easy identification
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
            onClick={handleConfirm}
            className="flex-1 flex items-center gap-2"
            variant="success"
          >
            <Check className="w-4 h-4" />
            Confirm
          </Button>
        </div>
      </div>
    </PhaseContainer>
  );
};
