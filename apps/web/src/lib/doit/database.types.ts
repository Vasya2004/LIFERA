export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      daily_habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          weekdays: number[];
          reminder_time: string | null;
          sort_order: number;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["daily_habits"]["Row"]> & {
          title: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_habits"]["Row"]>;
        Relationships: [];
      };
      daily_habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          log_date: string;
          completed_at: string;
          note: string | null;
        };
        Insert: Partial<
          Database["public"]["Tables"]["daily_habit_logs"]["Row"]
        > & {
          habit_id: string;
          user_id: string;
          log_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_habit_logs"]["Row"]>;
        Relationships: [];
      };
      creator_habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string | null;
          icon: string | null;
          color: string | null;
          weekly_target: number;
          sort_order: number;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["creator_habits"]["Row"]
        > & {
          title: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["creator_habits"]["Row"]>;
        Relationships: [];
      };
      creator_habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          week_start: string;
          completed_count: number;
          note: string | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["creator_habit_logs"]["Row"]
        > & {
          habit_id: string;
          user_id: string;
          week_start: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["creator_habit_logs"]["Row"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type DailyHabit = Database["public"]["Tables"]["daily_habits"]["Row"];
export type DailyHabitLog =
  Database["public"]["Tables"]["daily_habit_logs"]["Row"];
export type CreatorHabit =
  Database["public"]["Tables"]["creator_habits"]["Row"];
export type CreatorHabitLog =
  Database["public"]["Tables"]["creator_habit_logs"]["Row"];
