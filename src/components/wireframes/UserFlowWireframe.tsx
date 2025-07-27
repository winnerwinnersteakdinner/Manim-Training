import React from 'react';
import { Card } from '@/components/ui/card';

export const UserFlowWireframe: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">User Flow Mapping</h2>
        <p className="text-gray-600">Complete journey from launch to active engagement</p>
      </div>

      {/* Flow Diagram */}
      <div className="space-y-6">
        {/* Unverified User Flow */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Unverified User Journey</h3>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex-shrink-0 text-center">
              <div className="w-24 h-16 border-2 border-gray-400 bg-gray-100 flex items-center justify-center text-xs">
                Splash Screen
              </div>
              <div className="text-xs text-gray-600 mt-1">Entry Point</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex-shrink-0 text-center">
              <div className="w-24 h-16 border-2 border-gray-400 bg-gray-100 flex items-center justify-center text-xs">
                Browse Mode
              </div>
              <div className="text-xs text-gray-600 mt-1">Public Feed</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex-shrink-0 text-center">
              <div className="w-24 h-16 border-2 border-gray-400 bg-gray-100 flex items-center justify-center text-xs">
                Resources
              </div>
              <div className="text-xs text-gray-600 mt-1">Wellness Tools</div>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex-shrink-0 text-center">
              <div className="w-24 h-16 border-2 border-yellow-500 bg-yellow-100 flex items-center justify-center text-xs">
                Verify Prompt
              </div>
              <div className="text-xs text-gray-600 mt-1">Join Community</div>
            </div>
          </div>
        </Card>

        {/* Verified User Flow */}
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Verified User Journey</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-full h-16 border-2 border-green-500 bg-green-100 flex items-center justify-center text-xs mb-2">
                Full Feed Access
              </div>
              <div className="text-xs text-gray-600">Read all stories</div>
            </div>
            <div className="text-center">
              <div className="w-full h-16 border-2 border-green-500 bg-green-100 flex items-center justify-center text-xs mb-2">
                Write Stories
              </div>
              <div className="text-xs text-gray-600">Share narratives</div>
            </div>
            <div className="text-center">
              <div className="w-full h-16 border-2 border-green-500 bg-green-100 flex items-center justify-center text-xs mb-2">
                Wellness Tools
              </div>
              <div className="text-xs text-gray-600">Full access</div>
            </div>
            <div className="text-center">
              <div className="w-full h-16 border-2 border-green-500 bg-green-100 flex items-center justify-center text-xs mb-2">
                Profile Hub
              </div>
              <div className="text-xs text-gray-600">Personal dashboard</div>
            </div>
          </div>
        </Card>

        {/* Verification Process Flow */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Verification Process</h3>
          <div className="flex items-center gap-3 justify-center">
            <div className="text-center">
              <div className="w-20 h-16 border-2 border-blue-400 bg-blue-100 flex items-center justify-center text-xs">
                Step 1
              </div>
              <div className="text-xs text-gray-600 mt-1">Selfie Upload</div>
            </div>
            <div className="text-blue-400">→</div>
            <div className="text-center">
              <div className="w-20 h-16 border-2 border-blue-400 bg-blue-100 flex items-center justify-center text-xs">
                Step 2
              </div>
              <div className="text-xs text-gray-600 mt-1">ID Upload</div>
            </div>
            <div className="text-blue-400">→</div>
            <div className="text-center">
              <div className="w-20 h-16 border-2 border-blue-400 bg-blue-100 flex items-center justify-center text-xs">
                Step 3
              </div>
              <div className="text-xs text-gray-600 mt-1">Terms & Privacy</div>
            </div>
            <div className="text-blue-400">→</div>
            <div className="text-center">
              <div className="w-20 h-16 border-2 border-green-500 bg-green-100 flex items-center justify-center text-xs">
                Verified
              </div>
              <div className="text-xs text-gray-600 mt-1">Full Access</div>
            </div>
          </div>
        </Card>

        {/* Key Interactions */}
        <Card className="p-6 bg-gray-50 border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Key Interaction Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Discovery</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• App store download</li>
                <li>• Splash screen impression</li>
                <li>• Public content browse</li>
                <li>• Verification prompt</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Onboarding</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Identity verification</li>
                <li>• Community guidelines</li>
                <li>• Privacy education</li>
                <li>• First story prompt</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Engagement</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Story reading/writing</li>
                <li>• Mood tracking</li>
                <li>• Wellness tools</li>
                <li>• Community interaction</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};