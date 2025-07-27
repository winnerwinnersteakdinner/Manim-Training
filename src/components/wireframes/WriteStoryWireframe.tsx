import React from 'react';
import { WireframeContainer, WireframeBox, WireframeButton, WireframeInput } from './WireframeContainer';

export const WriteStoryWireframe: React.FC = () => {
  return (
    <WireframeContainer 
      title="Write Story Screen" 
      subtitle="Personal narrative creation (verified users only)"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">← Back</div>
        <div className="font-bold text-gray-800">Share Your Story</div>
        <div className="text-sm text-gray-600">Save</div>
      </div>

      {/* Story Type Selection */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-800">Story Type</div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-gray-800 text-white text-xs">Healing</span>
          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs">Lesson</span>
          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs">Reflection</span>
          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs">Support</span>
        </div>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-800">Title</div>
        <WireframeInput placeholder="Give your story a meaningful title..." />
      </div>

      {/* Main Content Area */}
      <div className="space-y-2 flex-1">
        <div className="text-sm font-medium text-gray-800">Your Story</div>
        <WireframeBox height="h-40" className="text-left p-3 text-xs text-gray-500">
          Share your personal narrative here...
          <br /><br />
          This is your safe space to express your journey, lessons learned, and experiences.
        </WireframeBox>
      </div>

      {/* Mood & Media Options */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-800">Enhancements (Optional)</div>
        
        <div className="grid grid-cols-3 gap-2">
          <WireframeButton label="🎭 Mood" variant="outline" size="sm" />
          <WireframeButton label="🎤 Audio" variant="outline" size="sm" />
          <WireframeButton label="📷 Photo" variant="outline" size="sm" />
        </div>
        
        {/* Mood Selection Example */}
        <WireframeBox height="h-12" className="bg-purple-50 border-purple-200">
          <div className="text-xs">Selected mood: Reflective → Hopeful</div>
        </WireframeBox>
      </div>

      {/* Privacy Notice */}
      <WireframeBox height="h-16" className="bg-green-50 border-green-200">
        <div className="text-xs text-center px-2">
          🔒 Private post to Coffee community
          <br />
          Only verified members can see your story
        </div>
      </WireframeBox>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <WireframeButton label="Save Draft" variant="outline" size="md" />
        <WireframeButton label="Submit Post" variant="primary" size="md" />
      </div>
    </WireframeContainer>
  );
};