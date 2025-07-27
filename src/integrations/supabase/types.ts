export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_id: string
          event_type: string
          id: string
          metadata: Json | null
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          event_type: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      community_violations: {
        Row: {
          created_at: string
          description: string
          evidence_urls: string[] | null
          id: string
          resolved_at: string | null
          status: string
          user_id: string | null
          violation_severity: string
          violation_type: string
        }
        Insert: {
          created_at?: string
          description: string
          evidence_urls?: string[] | null
          id?: string
          resolved_at?: string | null
          status?: string
          user_id?: string | null
          violation_severity?: string
          violation_type: string
        }
        Update: {
          created_at?: string
          description?: string
          evidence_urls?: string[] | null
          id?: string
          resolved_at?: string | null
          status?: string
          user_id?: string | null
          violation_severity?: string
          violation_type?: string
        }
        Relationships: []
      }
      content_reports: {
        Row: {
          created_at: string
          id: string
          moderator_notes: string | null
          report_details: string | null
          report_reason: string
          reported_content_id: string
          reported_content_type: string
          reporter_user_id: string | null
          resolved_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          moderator_notes?: string | null
          report_details?: string | null
          report_reason: string
          reported_content_id: string
          reported_content_type: string
          reporter_user_id?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          moderator_notes?: string | null
          report_details?: string | null
          report_reason?: string
          reported_content_id?: string
          reported_content_type?: string
          reporter_user_id?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_retention_settings: {
        Row: {
          auto_delete: boolean
          created_at: string
          data_type: string
          id: string
          retention_days: number
          updated_at: string
        }
        Insert: {
          auto_delete?: boolean
          created_at?: string
          data_type: string
          id?: string
          retention_days: number
          updated_at?: string
        }
        Update: {
          auto_delete?: boolean
          created_at?: string
          data_type?: string
          id?: string
          retention_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      file_access_log: {
        Row: {
          access_type: string
          bucket_name: string
          created_at: string
          file_path: string
          id: string
          ip_address: unknown | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          bucket_name: string
          created_at?: string
          file_path: string
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          bucket_name?: string
          created_at?: string
          file_path?: string
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
        }
        Relationships: []
      }
      moderation_actions: {
        Row: {
          action_details: string | null
          action_type: string
          content_report_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          moderator_id: string | null
        }
        Insert: {
          action_details?: string | null
          action_type: string
          content_report_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          moderator_id?: string | null
        }
        Update: {
          action_details?: string | null
          action_type?: string
          content_report_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          moderator_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_actions_content_report_id_fkey"
            columns: ["content_report_id"]
            isOneToOne: false
            referencedRelation: "content_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          is_verified: boolean
          role: string | null
          search_count: number
          search_reset_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          is_verified?: boolean
          role?: string | null
          search_count?: number
          search_reset_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          is_verified?: boolean
          role?: string | null
          search_count?: number
          search_reset_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          clicked_result_id: string | null
          id: string
          query: string
          results_count: number | null
          search_id: string
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          clicked_result_id?: string | null
          id?: string
          query: string
          results_count?: number | null
          search_id: string
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          clicked_result_id?: string | null
          id?: string
          query?: string
          results_count?: number | null
          search_id?: string
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          success: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      story_analytics: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_active: boolean | null
          story_id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          story_id: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          story_id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          duration_seconds: number | null
          ended_at: string | null
          events_count: number | null
          id: string
          session_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          duration_seconds?: number | null
          ended_at?: string | null
          events_count?: number | null
          id?: string
          session_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          duration_seconds?: number | null
          ended_at?: string | null
          events_count?: number | null
          id?: string
          session_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_trust_scores: {
        Row: {
          created_at: string
          email_verified: boolean
          last_violation_at: string | null
          phone_verified: boolean
          posts_flagged: number
          reports_received: number
          reports_upheld: number
          trust_score: number
          updated_at: string
          user_id: string
          verified_identity: boolean
        }
        Insert: {
          created_at?: string
          email_verified?: boolean
          last_violation_at?: string | null
          phone_verified?: boolean
          posts_flagged?: number
          reports_received?: number
          reports_upheld?: number
          trust_score?: number
          updated_at?: string
          user_id: string
          verified_identity?: boolean
        }
        Update: {
          created_at?: string
          email_verified?: boolean
          last_violation_at?: string | null
          phone_verified?: boolean
          posts_flagged?: number
          reports_received?: number
          reports_upheld?: number
          trust_score?: number
          updated_at?: string
          user_id?: string
          verified_identity?: boolean
        }
        Relationships: []
      }
      user_verifications: {
        Row: {
          created_at: string | null
          id: string
          id_document_url: string | null
          profile_photo_url: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
          verification_notes: string | null
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          id_document_url?: string | null
          profile_photo_url?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          id_document_url?: string | null
          profile_photo_url?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      verification_tokens: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          is_used: boolean | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          is_used?: boolean | null
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          is_used?: boolean | null
          token?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_reset_search_count: {
        Args: { user_uuid: string }
        Returns: number
      }
      cleanup_expired_data: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_search_count: {
        Args: { user_uuid: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
