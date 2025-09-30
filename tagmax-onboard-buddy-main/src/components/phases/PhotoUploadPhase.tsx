import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PhaseContainer } from '../PhaseContainer';
import { Camera, Upload, RotateCcw, Check } from 'lucide-react';

interface PhotoUploadPhaseProps {
  onPhotoUpload: (file: File) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PhotoUploadPhase: React.FC<PhotoUploadPhaseProps> = ({
  onPhotoUpload,
  onNext,
  onBack
}) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create a simple camera interface
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Show camera in a simple way
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // For simplicity, just capture after 2 seconds
      setTimeout(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'installation-photo.jpg', { type: 'image/jpeg' });
            setPhoto(file);
            setPreviewUrl(canvas.toDataURL());
          }
        }, 'image/jpeg', 0.8);
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
      }, 2000);
      
    } catch (error) {
      console.error('Camera access denied:', error);
      // Fallback to file input
      fileInputRef.current?.click();
    }
  };

  const handleRetry = () => {
    setPhoto(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmUpload = async () => {
    if (photo) {
      setIsUploading(true);
      try {
        onPhotoUpload(photo);
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        onNext();
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <PhaseContainer
      currentPhase={2}
      totalPhases={4}
      title="Final Step: Confirm Installation"
      subtitle="Upload a photo of your installed TagMax"
    >
      <div className="space-y-6">
        {!photo ? (
          <>
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">📸</div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  Take a photo of TagMax on your windshield
                </p>
                <p className="text-sm text-muted-foreground">
                  Make sure the device and windshield are clearly visible
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4">
              <h4 className="font-medium text-amber-800 mb-2">Photo Guidelines:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Show the full windshield area</li>
                <li>• Ensure TagMax is clearly visible</li>
                <li>• No tint or obstructions in view</li>
                <li>• Good lighting for clear image</li>
              </ul>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-3">
              <Button
                onClick={startCamera}
                className="w-full flex items-center gap-2"
                variant="default"
              >
                <Camera className="w-4 h-4" />
                Auto Capture
              </Button>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2"
                variant="outline"
              >
                <Upload className="w-4 h-4" />
                Take a Photo
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="aspect-video bg-muted overflow-hidden rounded-lg">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="TagMax installation preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Does this photo clearly show your TagMax installation?
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake
              </Button>
              <Button
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="flex-1 flex items-center gap-2"
                variant="default"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        <div className="flex gap-3 mt-auto">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isUploading}
          >
            Back
          </Button>
        </div>
      </div>
    </PhaseContainer>
  );
};
