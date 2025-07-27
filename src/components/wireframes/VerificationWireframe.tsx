import React, { useState } from 'react';
import { WireframeContainer, WireframeBox, WireframeButton, WireframeProgressBar } from './WireframeContainer';

export const VerificationWireframe: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="font-medium text-gray-800">Step 1: Upload Selfie</div>
              <div className="text-xs text-gray-600">
                Take a clear photo of yourself for identity verification
              </div>
            </div>
            
            <WireframeBox height="h-48" label="Camera Preview / Photo Upload Area" />
            
            <div className="space-y-3">
              <WireframeButton label="Take Photo" variant="outline" />
              <WireframeButton label="Upload from Gallery" variant="outline" />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="font-medium text-gray-800">Step 2: Upload ID</div>
              <div className="text-xs text-gray-600">
                Upload government-issued photo ID for age verification
              </div>
            </div>
            
            <WireframeBox height="h-48" label="ID Document Upload Area" />
            
            <div className="space-y-3">
              <WireframeButton label="Camera" variant="outline" />
              <WireframeButton label="Gallery" variant="outline" />
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Your ID is encrypted and only used for verification
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="font-medium text-gray-800">Step 3: Terms & Privacy</div>
              <div className="text-xs text-gray-600">
                Review our community guidelines and privacy policy
              </div>
            </div>
            
            <div className="space-y-4">
              <WireframeBox height="h-32" label="Terms of Service Summary" />
              <WireframeBox height="h-32" label="Privacy Policy Key Points" />
              <WireframeBox height="h-24" label="Verification Purpose Explanation" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 border border-gray-400 bg-white"></div>
                <span>I agree to Terms of Service</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 border border-gray-400 bg-white"></div>
                <span>I agree to Privacy Policy</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <WireframeContainer 
      title="Verification Onboarding Flow" 
      subtitle="3-step identity verification process"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="font-bold text-gray-800">Identity Verification</div>
        <div className="text-xs text-gray-600">× Close</div>
      </div>

      {/* Progress Bar */}
      <WireframeProgressBar step={currentStep} totalSteps={3} />

      {/* Step Content */}
      <div className="flex-1">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between space-x-3">
        <WireframeButton 
          label="Back" 
          variant="outline" 
          size="md"
        />
        {currentStep < 3 ? (
          <WireframeButton 
            label="Continue" 
            variant="primary" 
            size="md"
          />
        ) : (
          <WireframeButton 
            label="Submit for Review" 
            variant="primary" 
            size="md"
          />
        )}
      </div>

      {/* Step Navigation Controls */}
      <div className="flex justify-center gap-2 pt-2">
        {[1, 2, 3].map((step) => (
          <button
            key={step}
            onClick={() => setCurrentStep(step)}
            className={`w-2 h-2 rounded-full ${
              step === currentStep ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </WireframeContainer>
  );
};