import React from 'react';
import { WireframeContainer, WireframeBox, WireframeButton, WireframeNav } from './WireframeContainer';

export const ProfileDashboardWireframe: React.FC = () => {
  return (
    <WireframeContainer 
      title="User Profile / Dashboard" 
      subtitle="Personal wellness hub for verified users"
    >
      {/* Profile Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <WireframeBox height="h-16" className="w-16 rounded-full" label="Photo" />
          <div className="flex-1 space-y-1">
            <div className="font-medium text-gray-800">Display Name</div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-xs">✓ Verified</span>
              <span className="text-xs text-gray-500">Member since Oct 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Tracker Widget */}
      <div className="space-y-3">
        <div className="font-medium text-sm text-gray-800">Today's Wellness Check</div>
        <WireframeBox height="h-24" className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-xs text-gray-600">Mood Tracker Widget</div>
            <div className="text-xs text-gray-500 mt-1">Current: Calm • 7-day streak</div>
          </div>
        </WireframeBox>
        <WireframeButton label="Log Today's Mood" variant="outline" size="sm" />
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <div className="font-medium text-sm text-gray-800">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <WireframeButton label="Write Story" variant="primary" size="sm" />
          <WireframeButton label="Journal Entry" variant="outline" size="sm" />
        </div>
      </div>

      {/* Story Archive */}
      <div className="space-y-3 flex-1">
        <div className="font-medium text-sm text-gray-800">My Stories</div>
        
        {/* Story List */}
        <div className="space-y-2">
          <div className="border border-gray-300 bg-white p-2 space-y-1">
            <div className="text-xs font-medium">My healing journey</div>
            <div className="text-xs text-gray-500">Published 2 days ago • 12 hearts</div>
          </div>
          
          <div className="border border-gray-300 bg-white p-2 space-y-1">
            <div className="text-xs font-medium">Overcoming anxiety</div>
            <div className="text-xs text-gray-500">Draft • Started 1 week ago</div>
          </div>
        </div>
        
        <WireframeButton label="View All Stories" variant="outline" size="sm" />
      </div>

      {/* Bottom Navigation */}
      <WireframeNav items={["Home", "Tools", "Resources", "Account"]} />
    </WireframeContainer>
  );
};