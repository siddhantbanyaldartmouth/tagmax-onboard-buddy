import React from 'react';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { WelcomePhase } from './phases/WelcomePhase';
import { LicenseEntryPhase } from './phases/LicenseEntryPhase';
import { LicenseConfirmPhase } from './phases/LicenseConfirmPhase';
import { ActivatePhase } from './phases/ActivatePhase';
import { LocatePhase } from './phases/LocatePhase';
import { ApplyPhase } from './phases/ApplyPhase';
import { PhotoUploadPhase } from './phases/PhotoUploadPhase';
import { CSATPhase } from './phases/CSATPhase';
import { CompletePhase } from './phases/CompletePhase';
import { useToast } from '@/hooks/use-toast';

export const TagMaxOnboarding: React.FC = () => {
  const {
    currentPhase,
    data,
    updateVehicleData,
    updateInstallationPhoto,
    updateCSATData,
    nextPhase,
    prevPhase,
    saveToGoogleSheets,
    uploadToGoogleDrive
  } = useOnboardingFlow();

  const { toast } = useToast();

  const handlePhotoUpload = async (file: File) => {
    updateInstallationPhoto(file);
    
    try {
      // Real Google Drive upload
      await uploadToGoogleDrive(file, data.vehicle?.licensePlate || 'unknown');
      
      toast({
        title: "Photo uploaded successfully",
        description: "Your installation photo has been saved.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try uploading your photo again.",
        variant: "destructive",
      });
    }
  };

  const handleCSATSubmit = async (rating: number, feedback?: string) => {
    updateCSATData({ rating, feedback });
    
    try {
      // Mock Google Sheets save for CSAT data
      await saveToGoogleSheets({
        licensePlate: data.vehicle?.licensePlate,
        rating,
        feedback,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try submitting your feedback again.",
        variant: "destructive",
      });
    }
  };

  const handleVehicleConfirm = async () => {
    try {
      // Mock Google Sheets save for vehicle data
      await saveToGoogleSheets({
        state: data.vehicle?.state,
        licensePlate: data.vehicle?.licensePlate,
        nickname: data.vehicle?.nickname,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Vehicle information saved",
        description: "Your Tag Max setup is in progress.",
      });
      
      nextPhase();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  switch (currentPhase) {
    case 'welcome':
      return <WelcomePhase onNext={nextPhase} />;
      
    case 'license-entry':
      return (
        <LicenseEntryPhase
          vehicleData={data.vehicle || {}}
          onUpdate={updateVehicleData}
          onNext={nextPhase}
          onBack={prevPhase}
        />
      );
      
    case 'license-confirm':
      return (
        <LicenseConfirmPhase
          vehicleData={data.vehicle!}
          onUpdate={updateVehicleData}
          onNext={handleVehicleConfirm}
          onBack={prevPhase}
        />
      );
      
    case 'activate':
      return <ActivatePhase onNext={nextPhase} onBack={prevPhase} />;
      
    case 'locate':
      return <LocatePhase onNext={nextPhase} onBack={prevPhase} />;
      
    case 'apply':
      return <ApplyPhase onNext={nextPhase} onBack={prevPhase} />;
      
    case 'photo-upload':
      return (
        <PhotoUploadPhase
          onPhotoUpload={handlePhotoUpload}
          onNext={nextPhase}
          onBack={prevPhase}
        />
      );
      
    case 'csat':
      return (
        <CSATPhase
          onSubmit={handleCSATSubmit}
          onNext={nextPhase}
        />
      );
      
    case 'complete':
      return <CompletePhase licensePlate={data.vehicle?.licensePlate} />;
      
    default:
      return <WelcomePhase onNext={nextPhase} />;
  }
};