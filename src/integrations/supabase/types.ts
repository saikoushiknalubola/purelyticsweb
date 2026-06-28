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
      announcements: {
        Row: {
          body: string
          created_at: string
          id: string
          posted_by: string | null
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          posted_by?: string | null
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          posted_by?: string | null
          title?: string
        }
        Relationships: []
      }
      attendance_breaks: {
        Row: {
          break_end: string | null
          break_start: string
          created_at: string
          id: string
          reason: string | null
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          break_end?: string | null
          break_start?: string
          created_at?: string
          id?: string
          reason?: string | null
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          break_end?: string | null
          break_start?: string
          created_at?: string
          id?: string
          reason?: string | null
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_breaks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_sessions: {
        Row: {
          check_in_at: string
          check_out_at: string | null
          created_at: string
          id: string
          note: string | null
          notes: string | null
          source: string | null
          user_id: string
          work_mode: string | null
        }
        Insert: {
          check_in_at?: string
          check_out_at?: string | null
          created_at?: string
          id?: string
          note?: string | null
          notes?: string | null
          source?: string | null
          user_id: string
          work_mode?: string | null
        }
        Update: {
          check_in_at?: string
          check_out_at?: string | null
          created_at?: string
          id?: string
          note?: string | null
          notes?: string | null
          source?: string | null
          user_id?: string
          work_mode?: string | null
        }
        Relationships: []
      }
      beta_signups: {
        Row: {
          age: string | null
          categories: string[] | null
          city: string | null
          created_at: string
          email: string
          frustration: string | null
          id: string
          name: string
        }
        Insert: {
          age?: string | null
          categories?: string[] | null
          city?: string | null
          created_at?: string
          email: string
          frustration?: string | null
          id?: string
          name: string
        }
        Update: {
          age?: string | null
          categories?: string[] | null
          city?: string | null
          created_at?: string
          email?: string
          frustration?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          description: string | null
          employee_id: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_confidential: boolean
          mime_type: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          employee_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_confidential?: boolean
          mime_type?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          employee_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_confidential?: boolean
          mime_type?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_onboarding: {
        Row: {
          assigned_by: string | null
          created_at: string
          employee_id: string
          id: string
          start_date: string
          status: string
          target_complete_date: string | null
          template_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          employee_id: string
          id?: string
          start_date?: string
          status?: string
          target_complete_date?: string | null
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          start_date?: string
          status?: string
          target_complete_date?: string | null
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_onboarding_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_onboarding_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_onboarding_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "onboarding_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_onboarding_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          employee_id: string
          id: string
          is_completed: boolean
          notes: string | null
          task_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          employee_id: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          task_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          is_completed?: boolean
          notes?: string | null
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_onboarding_progress_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_onboarding_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "onboarding_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          holiday_date: string
          id: string
          is_optional: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          holiday_date: string
          id?: string
          is_optional?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          holiday_date?: string
          id?: string
          is_optional?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          id: string
          leave_type_id: string
          total: number
          used: number
          user_id: string
          year: number
        }
        Insert: {
          id?: string
          leave_type_id: string
          total?: number
          used?: number
          user_id: string
          year: number
        }
        Update: {
          id?: string
          leave_type_id?: string
          total?: number
          used?: number
          user_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          created_at: string
          days: number
          from_date: string
          id: string
          leave_type_id: string
          reason: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          reviewer_note: string | null
          status: string
          to_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days: number
          from_date: string
          id?: string
          leave_type_id: string
          reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_note?: string | null
          status?: string
          to_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days?: number
          from_date?: string
          id?: string
          leave_type_id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_note?: string | null
          status?: string
          to_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          created_at: string
          default_annual_quota: number
          id: string
          name: string
          paid: boolean
        }
        Insert: {
          created_at?: string
          default_annual_quota?: number
          id?: string
          name: string
          paid?: boolean
        }
        Update: {
          created_at?: string
          default_annual_quota?: number
          id?: string
          name?: string
          paid?: boolean
        }
        Relationships: []
      }
      newsletter_signups: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      onboarding_tasks: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          due_offset_days: number
          id: string
          sort_order: number
          template_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          due_offset_days?: number
          id?: string
          sort_order?: number
          template_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          due_offset_days?: number
          id?: string
          sort_order?: number
          template_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "onboarding_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      org_settings: {
        Row: {
          full_day_threshold_hours: number
          half_day_threshold_hours: number
          id: number
          updated_at: string
          weekend_days: number[]
          working_hours: number
        }
        Insert: {
          full_day_threshold_hours?: number
          half_day_threshold_hours?: number
          id?: number
          updated_at?: string
          weekend_days?: number[]
          working_hours?: number
        }
        Update: {
          full_day_threshold_hours?: number
          half_day_threshold_hours?: number
          id?: number
          updated_at?: string
          weekend_days?: number[]
          working_hours?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          department_id: string | null
          designation: string | null
          email: string | null
          emergency_contact: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          employment_type: string | null
          full_name: string | null
          gender: string | null
          id: string
          joining_date: string | null
          location: string | null
          manager_id: string | null
          phone: string | null
          status: string
          updated_at: string
          work_mode: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          designation?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          employment_type?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          joining_date?: string | null
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          work_mode?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          designation?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          employment_type?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          joining_date?: string | null
          location?: string | null
          manager_id?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          work_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_manager_of: {
        Args: { _employee: string; _manager: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "employee"
      document_category:
        | "offer_letter"
        | "contract"
        | "id_proof"
        | "address_proof"
        | "education"
        | "experience"
        | "payslip"
        | "tax"
        | "other"
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
    Enums: {
      app_role: ["admin", "manager", "employee"],
      document_category: [
        "offer_letter",
        "contract",
        "id_proof",
        "address_proof",
        "education",
        "experience",
        "payslip",
        "tax",
        "other",
      ],
    },
  },
} as const
