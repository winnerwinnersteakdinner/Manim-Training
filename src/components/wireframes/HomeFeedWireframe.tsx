import React from 'react';
import { WireframeContainer, WireframeBox, WireframeNav } from './WireframeContainer';

export const HomeFeedWireframe: React.FC = () => {
  return (
    <WireframeContainer 
      title="Home / Feed Screen" 
      subtitle="Main content discovery (available to all users)"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="font-bold text-gray-800">Coffee Stories</div>
        <WireframeBox height="h-8" className="w-16" label="Profile" />
      </div>

      {/* Non-verified user notice */}
      <WireframeBox height="h-12" className="bg-yellow-50 border-yellow-300">
        <div className="text-xs text-center px-2">
          Browse public resources • Verify to share stories
        </div>
      </WireframeBox>

      {/* Story Cards */}
      <div className="space-y-3 flex-1">
        {/* Story Card 1 */}
        <div className="border border-gray-300 bg-white p-3 space-y-2">
          <div className="font-medium text-sm text-gray-800">My health wake-up call</div>
          <div className="text-xs text-gray-600">Snippet of reflective story about wellness journey...</div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-200 text-xs">Healing</span>
              <span className="px-2 py-1 bg-blue-100 text-xs">Anxious→Calm</span>
            </div>
            <span className="text-xs text-gray-500">2h ago</span>
          </div>
        </div>

        {/* Story Card 2 */}
        <div className="border border-gray-300 bg-white p-3 space-y-2">
          <div className="font-medium text-sm text-gray-800">Overcoming relationship stress</div>
          <div className="text-xs text-gray-600">Personal narrative about setting boundaries...</div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-200 text-xs">Reflection</span>
              <span className="px-2 py-1 bg-green-100 text-xs">Growth</span>
            </div>
            <span className="text-xs text-gray-500">5h ago</span>
          </div>
        </div>

        {/* Story Card 3 */}
        <div className="border border-gray-300 bg-white p-3 space-y-2">
          <div className="font-medium text-sm text-gray-800">Mental health journey</div>
          <div className="text-xs text-gray-600">Story of recovery and vulnerability...</div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-200 text-xs">Support</span>
              <span className="px-2 py-1 bg-purple-100 text-xs">Hope</span>
            </div>
            <span className="text-xs text-gray-500">1d ago</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WireframeNav items={["Home", "Tools", "Resources", "Account"]} />
    </WireframeContainer>
  );
};