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
  const [showCamera, setShowCamera] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionSuccess, setDetectionSuccess] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      streamRef.current = stream;
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start AR detection simulation
      setTimeout(() => {
        setIsDetecting(true);
        // Simulate detection after 2 seconds
        setTimeout(() => {
          setIsDetecting(false);
          // Random success/failure for demo
          const success = Math.random() > 0.3;
          setDetectionSuccess(success);
        }, 2000);
      }, 1000);
      
    } catch (error) {
      console.error('Camera access denied:', error);
      // Fallback to file input
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsDetecting(false);
    setDetectionSuccess(null);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      if (context) {
        context.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'installation-photo.jpg', { type: 'image/jpeg' });
            setPhoto(file);
            setPreviewUrl(canvas.toDataURL());
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleRetry = () => {
    setPhoto(null);
    setPreviewUrl(null);
    setDetectionSuccess(null);
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
        {!showCamera && !photo ? (
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

            <Button
              onClick={startCamera}
              className="w-full flex items-center gap-2"
              variant="default"
            >
              <Camera className="w-4 h-4" />
              Take Photo
            </Button>
          </>
        ) : showCamera ? (
          <>
            <div className="relative aspect-video bg-black overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* AR Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Windshield boundary */}
                <div className="absolute inset-4 border-2 border-white/50 bg-transparent">
                  <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1">
                    Position windshield within frame
                  </div>
                </div>
                
                {/* TagMax device target */}
                <div className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-12 border-2 ${
                  detectionSuccess === true ? 'border-green-400 bg-green-400/20' : 
                  detectionSuccess === false ? 'border-red-400 bg-red-400/20' : 
                  'border-yellow-400 bg-yellow-400/20'
                }`}>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/50 px-2 py-1 whitespace-nowrap">
                    TagMax location
                  </div>
                </div>
                
                {/* Detection status */}
                {isDetecting && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/70 px-4 py-2">
                    Detecting TagMax...
                  </div>
                )}
                
                {detectionSuccess === false && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-red-600/80 px-4 py-2 text-center">
                    We can't detect your TagMax.<br />Please adjust your camera and try again.
                  </div>
                )}
                
                {detectionSuccess === true && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-green-600/80 px-4 py-2">
                    TagMax detected! Ready to capture.
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={stopCamera}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              
              {detectionSuccess === false ? (
                <Button
                  onClick={() => {
                    setDetectionSuccess(null);
                    setIsDetecting(true);
                    setTimeout(() => {
                      setIsDetecting(false);
                      setDetectionSuccess(Math.random() > 0.3);
                    }, 2000);
                  }}
                  className="flex-1"
                  variant="default"
                >
                  Retry Detection
                </Button>
              ) : (
                <Button
                  onClick={capturePhoto}
                  disabled={isDetecting}
                  className="flex-1"
                  variant="default"
                >
                  {detectionSuccess === true ? 'Capture Photo' : 'Continue Anyway'}
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="aspect-video bg-muted overflow-hidden">
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