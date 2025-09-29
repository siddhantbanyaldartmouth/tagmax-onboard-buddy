import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhaseContainer } from '../PhaseContainer';
import { VehicleData } from '@/hooks/useOnboardingFlow';
// Assume this PNG exists in the same assets folder as your other images
import exampleLicensePlate from '@/assets/Example license plate.png';

interface LicenseEntryPhaseProps {
  vehicleData: Partial<VehicleData>;
  onUpdate: (data: Partial<VehicleData>) => void;
  onNext: () => void;
  onBack?: () => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const LicenseEntryPhase: React.FC<LicenseEntryPhaseProps> = ({
  vehicleData,
  onUpdate,
  onNext,
  onBack
}) => {
  const [entryMethod, setEntryMethod] = useState<'manual' | 'scan'>('manual');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScan = async () => {
    setEntryMethod('scan');
    setIsScanning(true);
    setScanMessage('Opening camera...');

    try {
      // Use front camera for the prototype effect
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Simple prototype: show live video briefly, then return to manual
      setScanMessage('Scanning...');
      setTimeout(() => {
        mediaStream.getTracks().forEach(t => t.stop());
        setStream(null);
        setIsScanning(false);
        setScanMessage(null);
        setEntryMethod('manual');
      }, 3000);
    } catch {
      setIsScanning(false);
      setScanMessage('Camera permission denied. Please enter plate manually.');
      setEntryMethod('manual');
    }
  };

  // Cleanup if user navigates away
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);

  const canProceed = !!(vehicleData.state && vehicleData.licensePlate && vehicleData.licensePlate.length > 0);

  return (
    <PhaseContainer
      currentPhase={0}
      totalPhases={4}
      title="Confirm Vehicle Details"
      subtitle="Let's get your vehicle information"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="state">State</Label>
          <Select
            value={vehicleData.state || ''}
            onValueChange={(value) => onUpdate({ state: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {vehicleData.state && (
          <div className="space-y-4">
            <Label>License Plate Entry Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={entryMethod === 'manual' ? 'default' : 'outline'}
                onClick={() => setEntryMethod('manual')}
                className="font-medium"
              >
                Manual Entry
              </Button>
              <Button
                variant={entryMethod === 'scan' ? 'default' : 'outline'}
                onClick={() => !isScanning && handleScan()}
                disabled={isScanning}
                className="font-medium"
              >
                {isScanning ? 'Scanning...' : 'Scan Plate'}
              </Button>
            </div>

            {entryMethod === 'scan' && (
              <div className="space-y-3">
                <div className="relative aspect-video bg-black overflow-hidden rounded-md">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
                {scanMessage && (
                  <p className="text-sm text-muted-foreground text-center">{scanMessage}</p>
                )}
              </div>
            )}

            {entryMethod === 'manual' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <img
                    src={exampleLicensePlate}
                    alt="License plate example"
