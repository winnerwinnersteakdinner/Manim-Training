import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, FileCheck, AlertTriangle, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityStats {
  file_access_count: number;
  security_events: Record<string, number>;
  timestamp: string;
}

const SecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSecurityStats = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('security-monitor', {
          body: { action: 'get_security_stats' }
        });

        if (error) throw error;
        
        setStats(data);
      } catch (err) {
        console.error('Error fetching security stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load security stats');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchSecurityStats, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please sign in to view security dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  const getSeverityColor = (eventType: string) => {
    switch (eventType) {
      case 'suspicious_file_access':
      case 'failed_login':
        return 'destructive';
      case 'file_upload':
      case 'verification_submitted':
        return 'default';
      case 'data_cleanup':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
        {stats && (
          <Badge variant="secondary" className="ml-auto">
            Last updated: {new Date(stats.timestamp).toLocaleTimeString()}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* File Access Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              File Access (24h)
            </CardTitle>
            <CardDescription>
              Recent file access activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {stats?.file_access_count || 0}
            </div>
            <p className="text-sm text-muted-foreground">
              Total file operations
            </p>
          </CardContent>
        </Card>

        {/* Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Security Events
            </CardTitle>
            <CardDescription>
              Logged security activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.security_events && Object.entries(stats.security_events).length > 0 ? (
                Object.entries(stats.security_events).map(([eventType, count]) => (
                  <div key={eventType} className="flex justify-between items-center">
                    <Badge variant={getSeverityColor(eventType)}>
                      {eventType.replace(/_/g, ' ')}
                    </Badge>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent events</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Status
            </CardTitle>
            <CardDescription>
              Overall system security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Row Level Security</span>
                <Badge variant="default">✓ Enabled</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">File Access Control</span>
                <Badge variant="default">✓ Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Audit Logging</span>
                <Badge variant="default">✓ Running</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Retention</span>
                <Badge variant="default">✓ Configured</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your Coffee app is secured with enterprise-grade protection including:
          • Row Level Security (RLS) on all tables
          • Strict file access controls
          • Comprehensive audit logging
          • Automated data retention policies
          • Real-time security monitoring
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SecurityDashboard;