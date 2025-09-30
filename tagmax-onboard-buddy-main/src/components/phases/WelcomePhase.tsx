import React from 'react';
import { Button } from '@/components/ui/button';
import { PhaseContainer } from '../PhaseContainer';
import progressiveLogo from '@/assets/progressive-logo.png';
import cmtLogo from '@/assets/cmt-logo.png';
import tagMaxPhoto from '@/assets/tag-max-photo.jpg';

interface WelcomePhaseProps {
  onNext: () => void;
}

export const WelcomePhase: React.FC<WelcomePhaseProps> = ({ onNext }) => {
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

        <div className="flex-1 flex items-end">
          <Button
            onClick={onNext}
            className="w-full text-lg py-6 font-semibold"
            variant="default"
          >
            Begin
          </Button>
        </div>
      </div>
    </PhaseContainer>
  );
};
