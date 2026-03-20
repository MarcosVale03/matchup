export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          permission_level: number
          tournament_id: number
          user_id: string
        }
        Insert: {
          permission_level: number
          tournament_id: number
          user_id: string
        }
        Update: {
          permission_level?: number
          tournament_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_permission_levels_fk_01"
            columns: ["permission_level"]
            isOneToOne: false
            referencedRelation: "permission_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admins_tournaments_fk_01"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admins_users_fk_01"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      attendees: {
        Row: {
          tournament_id: number
          user_id: string
        }
        Insert: {
          tournament_id: number
          user_id: string
        }
        Update: {
          tournament_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendees_tournaments_fk_01"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendees_users_fk_01"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      bracket_phases: {
        Row: {
          bracket_type_name: string
          event_id: number
          id: number
          name: string
          next_phase_id: number | null
          num_progressing_per_group: number
          tournament_id: number
        }
        Insert: {
          bracket_type_name: string
          event_id: number
          id?: number
          name: string
          next_phase_id?: number | null
          num_progressing_per_group: number
          tournament_id: number
        }
        Update: {
          bracket_type_name?: string
          event_id?: number
          id?: number
          name?: string
          next_phase_id?: number | null
          num_progressing_per_group?: number
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bracket_phases_bracket_phases_fk_01"
            columns: ["tournament_id", "event_id", "next_phase_id"]
            isOneToOne: false
            referencedRelation: "bracket_phases"
            referencedColumns: ["tournament_id", "event_id", "id"]
          },
          {
            foreignKeyName: "bracket_phases_bracket_types_fk_01"
            columns: ["bracket_type_name"]
            isOneToOne: false
            referencedRelation: "bracket_types"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "bracket_phases_events_fk_01"
            columns: ["tournament_id", "event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["tournament_id", "id"]
          },
        ]
      }
      bracket_types: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      entrants: {
        Row: {
          event_id: number
          placement: number | null
          team_name: string | null
          tournament_id: number
          user_id: string
        }
        Insert: {
          event_id: number
          placement?: number | null
          team_name?: string | null
          tournament_id: number
          user_id: string
        }
        Update: {
          event_id?: number
          placement?: number | null
          team_name?: string | null
          tournament_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entrants_attendees_fk_01"
            columns: ["tournament_id", "user_id"]
            isOneToOne: false
            referencedRelation: "attendees"
            referencedColumns: ["tournament_id", "user_id"]
          },
          {
            foreignKeyName: "entrants_events_fk_01"
            columns: ["tournament_id", "event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["tournament_id", "id"]
          },
          {
            foreignKeyName: "entrants_teams_fk_01"
            columns: ["tournament_id", "event_id", "team_name"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["tournament_id", "event_id", "name"]
          },
          {
            foreignKeyName: "entrants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      event_video_games: {
        Row: {
          gaming_platform_name: string
          video_game_name: string
        }
        Insert: {
          gaming_platform_name: string
          video_game_name: string
        }
        Update: {
          gaming_platform_name?: string
          video_game_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_video_games_gaming_platforms_fk_01"
            columns: ["gaming_platform_name"]
            isOneToOne: false
            referencedRelation: "gaming_platforms"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "event_video_games_video_games_fk_01"
            columns: ["video_game_name"]
            isOneToOne: false
            referencedRelation: "video_games"
            referencedColumns: ["name"]
          },
        ]
      }
      events: {
        Row: {
          end_time: string
          gaming_platform_name: string
          id: number
          max_team_size: number | null
          name: string
          price: number
          start_time: string
          teams_allowed: boolean
          tournament_id: number
          video_game_name: string
        }
        Insert: {
          end_time: string
          gaming_platform_name: string
          id?: number
          max_team_size?: number | null
          name: string
          price: number
          start_time: string
          teams_allowed: boolean
          tournament_id: number
          video_game_name: string
        }
        Update: {
          end_time?: string
          gaming_platform_name?: string
          id?: number
          max_team_size?: number | null
          name?: string
          price?: number
          start_time?: string
          teams_allowed?: boolean
          tournament_id?: number
          video_game_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_event_video_games_fk_01"
            columns: ["video_game_name", "gaming_platform_name"]
            isOneToOne: false
            referencedRelation: "event_video_games"
            referencedColumns: ["video_game_name", "gaming_platform_name"]
          },
          {
            foreignKeyName: "events_tournaments_fk_01"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          thread_id: string
        }
        Insert: {
          author_id: string
          content?: string
          created_at?: string
          id?: string
          thread_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_thread"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_thread: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_thread_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      gaming_platforms: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          id: number
          latitude: number
          longitude: number
          maps_place_id: string
        }
        Insert: {
          address: string
          id?: number
          latitude: number
          longitude: number
          maps_place_id: string
        }
        Update: {
          address?: string
          id?: number
          latitude?: number
          longitude?: number
          maps_place_id?: string
        }
        Relationships: []
      }
      match_slots: {
        Row: {
          event_id: number
          match_identifier: string
          phase_group_identifier: string
          seed_num: number | null
          slot_num: number
          tournament_id: number
        }
        Insert: {
          event_id: number
          match_identifier: string
          phase_group_identifier: string
          seed_num?: number | null
          slot_num: number
          tournament_id: number
        }
        Update: {
          event_id?: number
          match_identifier?: string
          phase_group_identifier?: string
          seed_num?: number | null
          slot_num?: number
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "match_slots_matches_fk_01"
            columns: [
              "tournament_id",
              "event_id",
              "match_identifier",
              "phase_group_identifier",
            ]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: [
              "tournament_id",
              "event_id",
              "identifier",
              "phase_group_identifier",
            ]
          },
          {
            foreignKeyName: "match_slots_seeds_fk_01"
            columns: ["tournament_id", "event_id", "seed_num"]
            isOneToOne: false
            referencedRelation: "seeds"
            referencedColumns: ["tournament_id", "event_id", "seed_num"]
          },
        ]
      }
      matches: {
        Row: {
          advance_match_identifier: string | null
          advance_slot_num: number | null
          event_id: number
          identifier: string
          phase_group_identifier: string
          tournament_id: number
        }
        Insert: {
          advance_match_identifier?: string | null
          advance_slot_num?: number | null
          event_id: number
          identifier: string
          phase_group_identifier: string
          tournament_id: number
        }
        Update: {
          advance_match_identifier?: string | null
          advance_slot_num?: number | null
          event_id?: number
          identifier?: string
          phase_group_identifier?: string
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "matches_match_slots_fk_01"
            columns: [
              "tournament_id",
              "event_id",
              "phase_group_identifier",
              "advance_match_identifier",
              "advance_slot_num",
            ]
            isOneToOne: false
            referencedRelation: "match_slots"
            referencedColumns: [
              "tournament_id",
              "event_id",
              "phase_group_identifier",
              "match_identifier",
              "slot_num",
            ]
          },
          {
            foreignKeyName: "matches_phase_groups_fk_01"
            columns: ["tournament_id", "event_id", "phase_group_identifier"]
            isOneToOne: false
            referencedRelation: "phase_groups"
            referencedColumns: ["tournament_id", "event_id", "identifier"]
          },
        ]
      }
      permission_levels: {
        Row: {
          description: string
          id: number
          name: string
        }
        Insert: {
          description: string
          id: number
          name: string
        }
        Update: {
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      phase_groups: {
        Row: {
          bracket_phase_id: number
          event_id: number
          identifier: string
          tournament_id: number
          wave_identifier: string | null
        }
        Insert: {
          bracket_phase_id: number
          event_id: number
          identifier: string
          tournament_id: number
          wave_identifier?: string | null
        }
        Update: {
          bracket_phase_id?: number
          event_id?: number
          identifier?: string
          tournament_id?: number
          wave_identifier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phase_groups_bracket_phases_fk_01"
            columns: ["tournament_id", "event_id", "bracket_phase_id"]
            isOneToOne: false
            referencedRelation: "bracket_phases"
            referencedColumns: ["tournament_id", "event_id", "id"]
          },
          {
            foreignKeyName: "phase_groups_waves_fk_01"
            columns: ["wave_identifier", "tournament_id"]
            isOneToOne: false
            referencedRelation: "waves"
            referencedColumns: ["identifier", "tournament_id"]
          },
        ]
      }
      schedule_conflicts: {
        Row: {
          end_time: string
          id: number
          start_time: string
          tournament_id: number
          user_id: string
        }
        Insert: {
          end_time: string
          id?: number
          start_time: string
          tournament_id: number
          user_id: string
        }
        Update: {
          end_time?: string
          id?: number
          start_time?: string
          tournament_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_conflicts_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_conflicts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      seeds: {
        Row: {
          entrant_user_id: string | null
          event_id: number
          seed_num: number
          team_name: string | null
          tournament_id: number
        }
        Insert: {
          entrant_user_id?: string | null
          event_id: number
          seed_num: number
          team_name?: string | null
          tournament_id: number
        }
        Update: {
          entrant_user_id?: string | null
          event_id?: number
          seed_num?: number
          team_name?: string | null
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "seeds_entrants_fk_01"
            columns: ["tournament_id", "event_id", "entrant_user_id"]
            isOneToOne: false
            referencedRelation: "entrants"
            referencedColumns: ["tournament_id", "event_id", "user_id"]
          },
          {
            foreignKeyName: "seeds_events_fk_01"
            columns: ["tournament_id", "event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["tournament_id", "id"]
          },
          {
            foreignKeyName: "seeds_teams_fk_01"
            columns: ["tournament_id", "event_id", "team_name"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["tournament_id", "event_id", "name"]
          },
        ]
      }
      teams: {
        Row: {
          event_id: number
          name: string
          tournament_id: number
        }
        Insert: {
          event_id: number
          name: string
          tournament_id: number
        }
        Update: {
          event_id?: number
          name?: string
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "teams_events_fk_01"
            columns: ["tournament_id", "event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["tournament_id", "id"]
          },
        ]
      }
      tournaments: {
        Row: {
          discord_invite: string | null
          email_contact: string | null
          end_time: string
          home_page: string
          id: number
          is_online: boolean
          is_public: boolean
          location_id: number | null
          name: string
          owner: string
          slug: string | null
          start_time: string
        }
        Insert: {
          discord_invite?: string | null
          email_contact?: string | null
          end_time: string
          home_page?: string
          id?: number
          is_online: boolean
          is_public?: boolean
          location_id?: number | null
          name: string
          owner: string
          slug?: string | null
          start_time: string
        }
        Update: {
          discord_invite?: string | null
          email_contact?: string | null
          end_time?: string
          home_page?: string
          id?: number
          is_online?: boolean
          is_public?: boolean
          location_id?: number | null
          name?: string
          owner?: string
          slug?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_locations_fk_01"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_users_fk_01"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          country: string | null
          display_name: string
          first_name: string
          last_name: string
          prefix: string | null
          show_results: boolean
          state: string | null
          time_joined: string
          user_id: string
        }
        Insert: {
          country?: string | null
          display_name: string
          first_name: string
          last_name: string
          prefix?: string | null
          show_results?: boolean
          state?: string | null
          time_joined: string
          user_id: string
        }
        Update: {
          country?: string | null
          display_name?: string
          first_name?: string
          last_name?: string
          prefix?: string | null
          show_results?: boolean
          state?: string | null
          time_joined?: string
          user_id?: string
        }
        Relationships: []
      }
      video_games: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      waves: {
        Row: {
          identifier: string
          tournament_id: number
        }
        Insert: {
          identifier: string
          tournament_id: number
        }
        Update: {
          identifier?: string
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "waves_tournaments_fk_01"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_permission_level: {
        Args: { plevel: number; tid: number; uid: string }
        Returns: boolean
      }
      insert_admin: {
        Args: {
          a_permission_level: number
          a_tournament_id: number
          a_user_id: string
        }
        Returns: undefined
      }
      insert_event: {
        Args: {
          e_end_time: string
          e_gaming_platform_name: string
          e_max_team_size?: number
          e_name: string
          e_price: number
          e_start_time: string
          e_teams_allowed: boolean
          e_tournament_id: number
          e_video_game_name: string
        }
        Returns: number
      }
      insert_post: {
        Args: { p_content: string; p_thread_id: string }
        Returns: undefined
      }
      insert_schedule_conflict: {
        Args: {
          s_end_time: string
          s_start_time: string
          s_tournament_id: number
          s_user_id: string
        }
        Returns: undefined
      }
      insert_thread: {
        Args: { t_content: string; t_title: string }
        Returns: undefined
      }
      insert_tournament: {
        Args: {
          t_address?: string
          t_discord?: string
          t_email?: string
          t_end_time: string
          t_is_online: boolean
          t_is_public: boolean
          t_latitude?: number
          t_longitude?: number
          t_name: string
          t_place_id?: string
          t_slug?: string
          t_start_time: string
        }
        Returns: number
      }
      insert_wave: {
        Args: { w_identifier: string; w_tournament_id: number }
        Returns: undefined
      }
      update_admins: {
        Args: {
          a_permission_level: number
          a_tournament_id: number
          a_user_id: string
        }
        Returns: undefined
      }
      update_event: {
        Args: {
          e_end_time: string
          e_gaming_platform_name: string
          e_id: number
          e_max_team_size?: number
          e_name: string
          e_price: number
          e_start_time: string
          e_teams_allowed: boolean
          e_tournament_id: number
          e_video_game_name: string
        }
        Returns: number
      }
      update_post: {
        Args: { p_new_content: string; p_post_id: string }
        Returns: undefined
      }
      update_schedule_conflict: {
        Args: {
          s_end_time: string
          s_id: number
          s_start_time: string
          s_tournament_id: number
          s_user_id: string
        }
        Returns: undefined
      }
      update_tournament: {
        Args: {
          t_address?: string
          t_discord?: string
          t_email?: string
          t_end_time: string
          t_id: number
          t_is_online: boolean
          t_is_public: boolean
          t_latitude?: number
          t_longitude?: number
          t_name: string
          t_place_id?: string
          t_slug?: string
          t_start_time: string
        }
        Returns: number
      }
      update_user: {
        Args: {
          u_country: string
          u_display_name: string
          u_first_name: string
          u_last_name: string
          u_prefix: string
          u_show_results: boolean
          u_state: string
        }
        Returns: undefined
      }
      update_wave: {
        Args: {
          w_new_identifier: string
          w_old_identifier: string
          w_tournament_id: number
        }
        Returns: undefined
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
