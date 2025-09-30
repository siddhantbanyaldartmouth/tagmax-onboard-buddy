import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { PhaseContainer } from '../PhaseContainer';
import { VehicleData } from '@/hooks/useOnboardingFlow';
import { Check, Edit, Loader2, Upload } from 'lucide-react';

interface LicenseConfirmPhaseProps {
  vehicleData: VehicleData;
  onUpdate: (data: Partial<VehicleData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Generate a random VIN (17 characters, following VIN format)
const generateRandomVIN = (): string => {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let vin = '';
  
  // First character: Manufacturer (1-5 for North America)
  vin += '1';
  
  // Characters 2-3: Vehicle type and model
  vin += chars[Math.floor(Math.random() * chars.length)];
  vin += chars[Math.floor(Math.random() * chars.length)];
  
  // Characters 4-8: Vehicle attributes
  for (let i = 0; i < 5; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)];
  }
  
  // Character 9: Check digit (simplified)
  vin += Math.floor(Math.random() * 10).toString();
  
  // Characters 10-17: Sequential number
  for (let i = 0; i < 8; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return vin;
};

export const LicenseConfirmPhase: React.FC<LicenseConfirmPhaseProps> = ({
  vehicleData,
  onUpdate,
  onNext,
  onBack
}) => {
  const [nickname, setNickname] = useState(vehicleData.nickname || '');
  const [vin] = useState(vehicleData.vin || generateRandomVIN());
  const [isUploading, setIsUploading] = useState(false);

  const handleConfirm = async () => {
    setIsUploading(true);
    
    // Simulate Google Scripts upload delay (3-4 seconds)
    setTimeout(() => {
      onUpdate({ 
        nickname: nickname.trim() || undefined,
        vin: vin
      });
      setIsUploading(false);
      onNext();
    }, 3500);
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
                  disabled={isUploading}
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
                  disabled={isUploading}
                >
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">VIN:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {vin}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="h-6 w-6 p-0"
                  disabled={isUploading}
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
            disabled={isUploading}
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
            disabled={isUploading}
          >
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 flex items-center gap-2"
            variant="success"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading Data...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirm
              </>
            )}
          </Button>
        </div>
      </div>
    </PhaseContainer>
  );
};
