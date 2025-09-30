import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PhaseContainer } from '../PhaseContainer';
import { Camera, Upload, RotateCcw, Check, Square } from 'lucide-react';

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
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && !isCapturing) {
      setIsCapturing(true);
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'installation-photo.jpg', { type: 'image/jpeg' });
            setPhoto(file);
            setPreviewUrl(canvas.toDataURL());
            stopCamera();
          }
          setIsCapturing(false);
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
        ) : showCamera ? (
          <>
            {/* Live Camera Feed with AR Overlay */}
            <div className="relative aspect-video bg-black overflow-hidden rounded-lg">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* AR Overlay for Windshield Alignment */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Windshield boundary frame */}
                <div className="absolute inset-4 border-2 border-white/70 bg-transparent rounded-lg">
                  <div className="absolute -top-6 left-2 text-white text-xs bg-black/70 px-2 py-1 rounded">
                    Align windshield within frame
                  </div>
                </div>
                
                {/* TagMax device target area */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-16 border-2 border-yellow-400 bg-yellow-400/10 rounded">
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs bg-black/70 px-2 py-1 rounded whitespace-nowrap">
                    TagMax location
                  </div>
                </div>
                
                {/* Corner guides */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/70"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/70"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/70"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/70"></div>
                
                {/* Center crosshair */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-white/50"></div>
                  <div className="w-0.5 h-8 bg-white/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">
                Position your windshield within the frame
              </p>
              <p className="text-xs text-muted-foreground">
                Align the TagMax device with the yellow target area
              </p>
            </div>
            
            {/* Camera Controls */}
            <div className="flex gap-3">
              <Button
                onClick={stopCamera}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              
              <Button
                onClick={capturePhoto}
                disabled={isCapturing}
                className="flex-1 flex items-center gap-2"
                variant="default"
              >
                {isCapturing ? (
                  <>
                    <Square className="w-4 h-4 animate-pulse" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    Capture Photo
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Photo Preview */}
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
