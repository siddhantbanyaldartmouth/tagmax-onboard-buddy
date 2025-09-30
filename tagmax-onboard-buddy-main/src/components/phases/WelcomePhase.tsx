import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhaseContainer } from '../PhaseContainer';
import progressiveLogo from '@/assets/progressive-logo.png';
import cmtLogo from '@/assets/cmt-logo.png';
import tagMaxPhoto from '@/assets/tag-max-photo.jpg';

interface WelcomePhaseProps {
  onNext: () => void;
}

export const WelcomePhase: React.FC<WelcomePhaseProps> = ({ onNext }) => {
  // Generate random 4-digit number for Box ID
  const generateBoxId = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
    return `Solo-${randomNumber}`;
  };

  const [boxId, setBoxId] = useState(generateBoxId());

  const handleBoxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoxId(e.target.value);
  };

  const canProceed = boxId.trim().length > 0;

  return (
    <PhaseContainer
      currentPhase={0}
      totalPhases={4}
      title="Welcome!"
      subtitle="Let's get your Tag Max setup"
    >
      <div className="space-y-8">
        <div className="flex justify-center items-center space-x-6 mb-6">
          <img src={progressiveLogo} alt="Progressive" className="h-6" />
          <img src={cmtLogo} alt="Cambridge Mobile Telematics" className="h-20" />
        </div>
        
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <img 
              src={tagMaxPhoto} 
              alt="Tag Max device" 
              className="w-64 h-48 object-cover border border-border"
            />
          </div>
        </div>

        {/* Box ID Field */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="boxId">Box ID</Label>
            <Input
              id="boxId"
              value={boxId}
              onChange={handleBoxIdChange}
              placeholder="Solo-XXXX"
              className="font-mono text-center text-lg"
            />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Enter the Box ID from your Tag Max package
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-end">
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="w-full text-lg py-6 font-semibold"
            variant="default"
          >
            Confirm & Begin
          </Button>
        </div>
      </div>
    </PhaseContainer>
  );
};
