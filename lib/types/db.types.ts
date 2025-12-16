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
          event_name: string
          name: string
          next_phase_name: string | null
          num_progressing_per_group: number
          tournament_id: number
        }
        Insert: {
          bracket_type_name: string
          event_name: string
          name: string
          next_phase_name?: string | null
          num_progressing_per_group: number
          tournament_id: number
        }
        Update: {
          bracket_type_name?: string
          event_name?: string
          name?: string
          next_phase_name?: string | null
          num_progressing_per_group?: number
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bracket_phases_bracket_phases_fk_01"
            columns: ["next_phase_name", "tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "bracket_phases"
            referencedColumns: ["name", "tournament_id", "event_name"]
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
            columns: ["tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["tournament_id", "name"]
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
          event_name: string
          team_name: string | null
          tournament_id: number
          user_id: string
        }
        Insert: {
          event_name: string
          team_name?: string | null
          tournament_id: number
          user_id: string
        }
        Update: {
          event_name?: string
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
            columns: ["tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["tournament_id", "name"]
          },
          {
            foreignKeyName: "entrants_teams_fk_01"
            columns: ["team_name", "tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name", "tournament_id", "event_name"]
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
          event_name: string
          match_identifier: string
          phase_group_identifier: string
          seed_num: number | null
          slot_num: number
          tournament_id: number
        }
        Insert: {
          event_name: string
          match_identifier: string
          phase_group_identifier: string
          seed_num?: number | null
          slot_num: number
          tournament_id: number
        }
        Update: {
          event_name?: string
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
              "match_identifier",
              "tournament_id",
              "event_name",
              "phase_group_identifier",
            ]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: [
              "identifier",
              "tournament_id",
              "event_name",
              "phase_group_identifier",
            ]
          },
          {
            foreignKeyName: "match_slots_seeds_fk_01"
            columns: ["seed_num", "tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "seeds"
            referencedColumns: ["seed_num", "tournament_id", "event_name"]
          },
        ]
      }
      matches: {
        Row: {
          advance_match_identifier: string | null
          advance_slot_num: number | null
          event_name: string
          identifier: string
          phase_group_identifier: string
          tournament_id: number
        }
        Insert: {
          advance_match_identifier?: string | null
          advance_slot_num?: number | null
          event_name: string
          identifier: string
          phase_group_identifier: string
          tournament_id: number
        }
        Update: {
          advance_match_identifier?: string | null
          advance_slot_num?: number | null
          event_name?: string
          identifier?: string
          phase_group_identifier?: string
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "matches_match_slots_fk_01"
            columns: [
              "advance_match_identifier",
              "tournament_id",
              "event_name",
              "phase_group_identifier",
              "advance_slot_num",
            ]
            isOneToOne: false
            referencedRelation: "match_slots"
            referencedColumns: [
              "match_identifier",
              "tournament_id",
              "event_name",
              "phase_group_identifier",
              "slot_num",
            ]
          },
          {
            foreignKeyName: "matches_phase_groups_fk_01"
            columns: ["phase_group_identifier", "tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "phase_groups"
            referencedColumns: ["identifier", "tournament_id", "event_name"]
          },
        ]
      }
      offline_events: {
        Row: {
          event_name: string
          location_id: number
          tournament_id: number
        }
        Insert: {
          event_name: string
          location_id: number
          tournament_id: number
        }
        Update: {
          event_name?: string
          location_id?: number
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "offline_events_events_fk_01"
            columns: ["tournament_id", "event_name"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["tournament_id", "name"]
          },
          {
            foreignKeyName: "offline_events_locations_fk_01"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_tournaments: {
        Row: {
          location_id: number
          tournament_id: number
        }
        Insert: {
          location_id: number
          tournament_id: number
        }
        Update: {
          location_id?: number
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "offline_tournaments_locations_fk_01"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offline_tournaments_tournaments_fk_01"
            columns: ["tournament_id"]
            isOneToOne: true
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      phase_groups: {
        Row: {
          bracket_phase_name: string
          event_name: string
          identifier: string
          tournament_id: number
          wave_identifier: string | null
        }
        Insert: {
          bracket_phase_name: string
          event_name: string
          identifier: string
          tournament_id: number
          wave_identifier?: string | null
        }
        Update: {
          bracket_phase_name?: string
          event_name?: string
          identifier?: string
          tournament_id?: number
          wave_identifier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phase_groups_bracket_phases_fk_01"
            columns: ["bracket_phase_name", "tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "bracket_phases"
            referencedColumns: ["name", "tournament_id", "event_name"]
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
      seeds: {
        Row: {
          entrant_user_id: string | null
          event_name: string
          seed_num: number
          team_name: string | null
          tournament_id: number
        }
        Insert: {
          entrant_user_id?: string | null
          event_name: string
          seed_num: number
          team_name?: string | null
          tournament_id: number
        }
        Update: {
          entrant_user_id?: string | null
          event_name?: string
          seed_num?: number
          team_name?: string | null
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "seeds_entrants_fk_01"
            columns: ["tournament_id", "event_name", "entrant_user_id"]
            isOneToOne: false
            referencedRelation: "entrants"
            referencedColumns: ["tournament_id", "event_name", "user_id"]
          },
          {
            foreignKeyName: "seeds_events_fk_01"
            columns: ["tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["tournament_id", "name"]
          },
          {
            foreignKeyName: "seeds_teams_fk_01"
            columns: ["team_name", "tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["name", "tournament_id", "event_name"]
          },
        ]
      }
      teams: {
        Row: {
          event_name: string
          name: string
          tournament_id: number
        }
        Insert: {
          event_name: string
          name: string
          tournament_id: number
        }
        Update: {
          event_name?: string
          name?: string
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "teams_events_fk_01"
            columns: ["tournament_id", "event_name"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["tournament_id", "name"]
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
          name: string
          slug: string | null
          start_time: string
        }
        Insert: {
          discord_invite?: string | null
          email_contact?: string | null
          end_time: string
          home_page?: string
          id?: number
          name: string
          slug?: string | null
          start_time: string
        }
        Update: {
          discord_invite?: string | null
          email_contact?: string | null
          end_time?: string
          home_page?: string
          id?: number
          name?: string
          slug?: string | null
          start_time?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          display_name: string
          first_name: string
          last_name: string
          prefix: string
          user_id: string
        }
        Insert: {
          display_name: string
          first_name: string
          last_name: string
          prefix: string
          user_id: string
        }
        Update: {
          display_name?: string
          first_name?: string
          last_name?: string
          prefix?: string
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
      insert_event: {
        Args: {
          address?: string
          end_time: string
          is_online: boolean
          latitude?: number
          longitude?: number
          max_team_size?: number
          name: string
          place_id?: string
          platform: string
          price: number
          start_time: string
          teams_allowed: boolean
          tournament_id: number
          video_game: string
        }
        Returns: number
      }
      insert_tournament: {
        Args: {
          is_online: boolean
          t_address?: string
          t_discord?: string
          t_email?: string
          t_end_time: string
          t_latitude?: number
          t_longitude?: number
          t_name: string
          t_place_id?: string
          t_slug?: string
          t_start_time: string
        }
        Returns: number
      }
      update_tournament: {
        Args: {
          is_online: boolean
          t_address?: string
          t_discord?: string
          t_email?: string
          t_end_time: string
          t_id: number
          t_latitude?: number
          t_longitude?: number
          t_name: string
          t_place_id?: string
          t_slug?: string
          t_start_time: string
        }
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
