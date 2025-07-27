import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { contentId, contentType, moderatorAction, moderatorNotes, actionDetails } = await req.json()

    console.log('Processing moderation action:', { contentId, contentType, moderatorAction })

    // Get the moderator's user ID from the JWT
    const authHeader = req.headers.get('Authorization')!
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    
    if (authError || !user) {
      throw new Error('Unauthorized: Invalid token')
    }

    // Verify the user is a moderator
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile || !['moderator', 'admin'].includes(profile.role)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    // Process the moderation action
    let response = { success: true, message: 'Action completed successfully' }

    switch (moderatorAction) {
      case 'content_removed':
        // In a real app, you would mark content as removed or delete it
        console.log(`Content ${contentId} of type ${contentType} has been removed`)
        
        // Update the related report if it exists
        const { error: reportUpdateError } = await supabase
          .from('content_reports')
          .update({ 
            status: 'resolved',
            moderator_notes,
            resolved_at: new Date().toISOString()
          })
          .eq('reported_content_id', contentId)
          .eq('reported_content_type', contentType)

        if (reportUpdateError) {
          console.error('Error updating report:', reportUpdateError)
        }
        break

      case 'user_warned':
      case 'user_suspended':
      case 'user_banned':
        // Create a community violation record
        const violationType = moderatorAction === 'user_banned' ? 'severe' : 
                            moderatorAction === 'user_suspended' ? 'major' : 'minor'

        const { error: violationError } = await supabase
          .from('community_violations')
          .insert({
            user_id: contentId, // In this case, contentId should be the user_id
            violation_type: actionDetails?.violationType || 'inappropriate_content',
            violation_severity: violationType,
            description: moderatorNotes || `${moderatorAction} applied by moderator`,
            status: 'active'
          })

        if (violationError) {
          console.error('Error creating violation record:', violationError)
          throw violationError
        }

        // Update trust score based on action
        const scoreReduction = moderatorAction === 'user_banned' ? 50 :
                              moderatorAction === 'user_suspended' ? 30 : 10

        const { error: trustScoreError } = await supabase
          .from('user_trust_scores')
          .update({
            trust_score: Math.max(0, Math.min(100, supabase.sql`trust_score - ${scoreReduction}`)),
            last_violation_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', contentId)

        if (trustScoreError) {
          console.error('Error updating trust score:', trustScoreError)
        }
        break

      case 'content_flagged':
        // Flag content for review but don't remove it
        console.log(`Content ${contentId} has been flagged for review`)
        break

      case 'no_action':
        // Dismiss the report
        const { error: dismissError } = await supabase
          .from('content_reports')
          .update({ 
            status: 'dismissed',
            moderator_notes,
            resolved_at: new Date().toISOString()
          })
          .eq('reported_content_id', contentId)
          .eq('reported_content_type', contentType)

        if (dismissError) {
          console.error('Error dismissing report:', dismissError)
        }
        break

      default:
        throw new Error(`Unknown moderation action: ${moderatorAction}`)
    }

    // Log the moderation action
    const { error: actionLogError } = await supabase
      .from('moderation_actions')
      .insert({
        moderator_id: user.id,
        action_type: moderatorAction,
        action_details: JSON.stringify({ 
          contentId, 
          contentType, 
          notes: moderatorNotes,
          ...actionDetails 
        })
      })

    if (actionLogError) {
      console.error('Error logging moderation action:', actionLogError)
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in moderate-content function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})