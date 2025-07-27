import React from 'react';
import { VerificationFlow } from '@/components/VerificationFlow';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Verification = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Identity Verification</h1>
            <p className="text-muted-foreground">
              Verify your identity to ensure a safe and trusted community for all users.
            </p>
          </div>
          <VerificationFlow />
        </div>
      </div>
    </div>
  );
};

export default Verification;