import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SplashScreenWireframe } from './SplashScreenWireframe';
import { HomeFeedWireframe } from './HomeFeedWireframe';
import { VerificationWireframe } from './VerificationWireframe';
import { ProfileDashboardWireframe } from './ProfileDashboardWireframe';
import { WriteStoryWireframe } from './WriteStoryWireframe';
import { WellnessToolsWireframe } from './WellnessToolsWireframe';
import { UserFlowWireframe } from './UserFlowWireframe';

type WireframeType = 
  | 'splash' 
  | 'home' 
  | 'verification' 
  | 'profile' 
  | 'write' 
  | 'tools' 
  | 'flow';

export const WireframeShowcase: React.FC = () => {
  const [activeWireframe, setActiveWireframe] = useState<WireframeType>('splash');

  const wireframes = [
    { id: 'splash', label: 'Splash Screen', component: SplashScreenWireframe },
    { id: 'home', label: 'Home Feed', component: HomeFeedWireframe },
    { id: 'verification', label: 'Verification', component: VerificationWireframe },
    { id: 'profile', label: 'Profile', component: ProfileDashboardWireframe },
    { id: 'write', label: 'Write Story', component: WriteStoryWireframe },
    { id: 'tools', label: 'Wellness Tools', component: WellnessToolsWireframe },
    { id: 'flow', label: 'User Flow', component: UserFlowWireframe }
  ] as const;

  const ActiveComponent = wireframes.find(w => w.id === activeWireframe)?.component || SplashScreenWireframe;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Coffee App Wireframes
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Low-fidelity wireframes for the men's wellness storytelling platform. 
            Following Nielsen's usability heuristics and well-being supportive design principles.
          </p>
        </div>

        {/* Navigation */}
        <Card className="p-4 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {wireframes.map((wireframe) => (
              <Button
                key={wireframe.id}
                variant={activeWireframe === wireframe.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveWireframe(wireframe.id as WireframeType)}
                className="text-sm"
              >
                {wireframe.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Design Principles */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-green-50">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Design Principles Applied</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-800">Nielsen's Heuristics</h4>
              <ul className="text-gray-600 space-y-1 mt-1">
                <li>• Visibility of system status</li>
                <li>• User control and freedom</li>
                <li>• Consistency and standards</li>
                <li>• Error prevention</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Well-being Focus</h4>
              <ul className="text-gray-600 space-y-1 mt-1">
                <li>• Autonomy through choice</li>
                <li>• Competence building</li>
                <li>• Supportive feedback loops</li>
                <li>• Safe expression space</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Accessibility</h4>
              <ul className="text-gray-600 space-y-1 mt-1">
                <li>• High contrast elements</li>
                <li>• Clear navigation paths</li>
                <li>• Generous touch targets</li>
                <li>• Progressive disclosure</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Active Wireframe */}
        <div className="flex justify-center">
          <ActiveComponent />
        </div>

        {/* Implementation Notes */}
        <Card className="p-6 mt-8 bg-yellow-50 border-yellow-200">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Implementation Notes</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Testing Strategy:</strong> These wireframes should be tested with representative users 
              (both unverified and verified) to validate core flows before detailed visual design.
            </p>
            <p>
              <strong>Progressive Enhancement:</strong> The design moves from public browsing to verified community 
              participation, ensuring value at every access level.
            </p>
            <p>
              <strong>Next Steps:</strong> Transition to mid-fidelity with calming color palette (blues/greens), 
              refined typography, and interaction specifications for development.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};