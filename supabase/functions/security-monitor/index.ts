import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, data } = await req.json();

    switch (action) {
      case 'log_file_access': {
        const { file_path, bucket_name, access_type } = data;
        
        // Log file access
        await supabase.from('file_access_log').insert({
          user_id: user.id,
          file_path,
          bucket_name,
          access_type,
          ip_address: req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     'unknown'
        });

        // Check for suspicious activity (multiple downloads of different users' files)
        const { data: recentAccess } = await supabase
          .from('file_access_log')
          .select('file_path')
          .eq('user_id', user.id)
          .eq('access_type', 'download')
          .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Last hour
          .limit(10);

        if (recentAccess && recentAccess.length > 5) {
          // Log potential security concern
          await supabase.from('security_audit_log').insert({
            user_id: user.id,
            action_type: 'suspicious_file_access',
            resource_type: 'file_access',
            success: true,
            details: {
              file_count: recentAccess.length,
              files: recentAccess.map(f => f.file_path)
            }
          });
        }

        break;
      }

      case 'log_security_event': {
        const { event_type, resource_type, resource_id, details } = data;
        
        await supabase.from('security_audit_log').insert({
          user_id: user.id,
          action_type: event_type,
          resource_type,
          resource_id,
          ip_address: req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     'unknown',
          user_agent: req.headers.get('user-agent'),
          success: true,
          details
        });

        break;
      }

      case 'get_security_stats': {
        // Only admins can view security stats
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (!profile || profile.role !== 'admin') {
          throw new Error('Insufficient permissions');
        }

        // Get security statistics
        const { data: fileAccessCount } = await supabase
          .from('file_access_log')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 86400000).toISOString()); // Last 24 hours

        const { data: securityEvents } = await supabase
          .from('security_audit_log')
          .select('action_type')
          .gte('created_at', new Date(Date.now() - 86400000).toISOString())
          .limit(100);

        const eventCounts = securityEvents?.reduce((acc, event) => {
          acc[event.action_type] = (acc[event.action_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        return new Response(JSON.stringify({
          file_access_count: fileAccessCount || 0,
          security_events: eventCounts,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Security monitor error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});