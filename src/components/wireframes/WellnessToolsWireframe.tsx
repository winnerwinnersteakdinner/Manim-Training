import React from 'react';
import { WireframeContainer, WireframeBox, WireframeNav } from './WireframeContainer';

export const WellnessToolsWireframe: React.FC = () => {
  return (
    <WireframeContainer 
      title="Wellness Tools & Resources" 
      subtitle="Public view vs verified user access"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="font-bold text-gray-800">Wellness Hub</div>
        <WireframeBox height="h-6" className="w-20" label="Search" />
      </div>

      {/* Access Level Indicator */}
      <WireframeBox height="h-10" className="bg-yellow-50 border-yellow-300">
        <div className="text-xs text-center">
          📋 Public Resources • Verify for full access
        </div>
      </WireframeBox>

      {/* Resource Categories */}
      <div className="space-y-4 flex-1">
        {/* Mental Health */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-800">Mental Health</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-2 space-y-1">
              <div className="text-xs font-medium">Crisis Resources</div>
              <div className="text-xs text-gray-500">988 Hotline info</div>
              <div className="text-xs text-green-600">✓ Public</div>
            </div>
            <div className="border border-gray-300 p-2 space-y-1 opacity-50">
              <div className="text-xs font-medium">Mood Tracking</div>
              <div className="text-xs text-gray-500">Personal tools</div>
              <div className="text-xs text-gray-400">🔒 Verify</div>
            </div>
          </div>
        </div>

        {/* Physical Wellness */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-800">Physical Wellness</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 p-2 space-y-1">
              <div className="text-xs font-medium">STD Awareness</div>
              <div className="text-xs text-gray-500">CDC resources</div>
              <div className="text-xs text-green-600">✓ Public</div>
            </div>
            <div className="border border-gray-300 p-2 space-y-1 opacity-50">
              <div className="text-xs font-medium">Health Reminders</div>
              <div className="text-xs text-gray-500">Personal calendar</div>
              <div className="text-xs text-gray-400">🔒 Verify</div>
            </div>
          </div>
        </div>

        {/* Community Support */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-800">Community Support</div>
          <div className="space-y-2">
            <div className="border border-gray-300 p-2 space-y-1">
              <div className="text-xs font-medium">Support Groups</div>
              <div className="text-xs text-gray-500">Local & online groups</div>
              <div className="text-xs text-green-600">✓ Public</div>
            </div>
            <div className="border border-gray-300 p-2 space-y-1 opacity-50">
              <div className="text-xs font-medium">Peer Connections</div>
              <div className="text-xs text-gray-500">Connect with others</div>
              <div className="text-xs text-gray-400">🔒 Verify</div>
            </div>
          </div>
        </div>

        {/* Featured Article */}
        <WireframeBox height="h-20" className="bg-blue-50 border-blue-200">
          <div className="text-center space-y-1">
            <div className="text-xs font-medium">Featured: Men's Mental Health</div>
            <div className="text-xs text-gray-600">Breaking stigma around vulnerability</div>
          </div>
        </WireframeBox>
      </div>

      {/* Bottom Navigation */}
      <WireframeNav items={["Home", "Tools", "Resources", "Account"]} />
    </WireframeContainer>
  );
};