import React from 'react';
import { WireframeContainer, WireframeBox, WireframeButton } from './WireframeContainer';

export const SplashScreenWireframe: React.FC = () => {
  return (
    <WireframeContainer 
      title="Launch / Splash Screen" 
      subtitle="First impression & entry point"
    >
      {/* Logo/Brand Area */}
      <div className="text-center space-y-4 pt-20">
        <WireframeBox height="h-20" label="App Logo" />
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-800">Coffee</div>
          <div className="text-sm text-gray-600">Men's Stories & Wellness</div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Progress/Status Indicator */}
      <div className="space-y-4">
        <WireframeBox height="h-8" label="Verification Status Indicator" />
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <WireframeButton label="Sign In / Sign Up" variant="primary" size="lg" />
          <WireframeButton label="Browse Public Stories" variant="outline" size="md" />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 pt-4">
        Safe space for male wellness stories
      </div>
    </WireframeContainer>
  );
};