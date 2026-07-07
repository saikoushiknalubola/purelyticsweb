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
      asset_assignments: {
        Row: {
          asset_id: string
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          notes: string | null
          returned_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_id: string
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          returned_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_id?: string
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          returned_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_assignments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_requests: {
        Row: {
          category: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          id: string
          reason: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          id?: string
          reason: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          id?: string
          reason?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          category: string
          condition: string
          created_at: string
          id: string
          name: string
          notes: string | null
          purchase_cost: number | null
          purchase_date: string | null
          serial_no: string | null
          status: string
          tag: string
          updated_at: string
        }
        Insert: {
          category?: string
          condition?: string
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_no?: string | null
          status?: string
          tag: string
          updated_at?: string
        }
        Update: {
          category?: string
          condition?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_no?: string | null
          status?: string
          tag?: string
          updated_at?: string
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
      course_enrollments: {
        Row: {
          certificate_no: string | null
          completed_at: string | null
          completed_modules: string[]
          course_id: string
          created_at: string
          enrolled_at: string
          id: string
          progress: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          certificate_no?: string | null
          completed_at?: string | null
          completed_modules?: string[]
          course_id: string
          created_at?: string
          enrolled_at?: string
          id?: string
          progress?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          certificate_no?: string | null
          completed_at?: string | null
          completed_modules?: string[]
          course_id?: string
          created_at?: string
          enrolled_at?: string
          id?: string
          progress?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          duration_minutes: number | null
          id: string
          position: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          position?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          position?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          cover_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          title?: string
          updated_at?: string
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
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "employee_directory"
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
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "employee_directory"
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
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
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
      expense_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      expense_items: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          merchant: string | null
          receipt_url: string | null
          report_id: string
          spent_on: string
        }
        Insert: {
          amount?: number
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          merchant?: string | null
          receipt_url?: string | null
          report_id: string
          spent_on?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          merchant?: string | null
          receipt_url?: string | null
          report_id?: string
          spent_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_items_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "expense_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_reports: {
        Row: {
          approver_id: string | null
          created_at: string
          currency: string
          decided_at: string | null
          decision_note: string | null
          id: string
          purpose: string | null
          status: string
          submitted_at: string | null
          submitter_id: string
          title: string
          total: number
          updated_at: string
        }
        Insert: {
          approver_id?: string | null
          created_at?: string
          currency?: string
          decided_at?: string | null
          decision_note?: string | null
          id?: string
          purpose?: string | null
          status?: string
          submitted_at?: string | null
          submitter_id: string
          title: string
          total?: number
          updated_at?: string
        }
        Update: {
          approver_id?: string | null
          created_at?: string
          currency?: string
          decided_at?: string | null
          decision_note?: string | null
          id?: string
          purpose?: string | null
          status?: string
          submitted_at?: string | null
          submitter_id?: string
          title?: string
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      goal_checkins: {
        Row: {
          created_at: string
          current_value: number | null
          goal_id: string
          id: string
          notes: string | null
          progress_pct: number
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          goal_id: string
          id?: string
          notes?: string | null
          progress_pct: number
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          goal_id?: string
          id?: string
          notes?: string | null
          progress_pct?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_checkins_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string
          created_by: string | null
          current_value: number | null
          cycle_id: string | null
          description: string | null
          due_date: string | null
          goal_type: string
          id: string
          metric: string | null
          parent_goal_id: string | null
          progress_pct: number | null
          start_value: number | null
          status: string
          target_value: number | null
          title: string
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          cycle_id?: string | null
          description?: string | null
          due_date?: string | null
          goal_type?: string
          id?: string
          metric?: string | null
          parent_goal_id?: string | null
          progress_pct?: number | null
          start_value?: number | null
          status?: string
          target_value?: number | null
          title: string
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          cycle_id?: string | null
          description?: string | null
          due_date?: string | null
          goal_type?: string
          id?: string
          metric?: string | null
          parent_goal_id?: string | null
          progress_pct?: number | null
          start_value?: number | null
          status?: string
          target_value?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_created_by_profiles_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_created_by_profiles_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "review_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_parent_goal_id_fkey"
            columns: ["parent_goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      helpdesk_categories: {
        Row: {
          created_at: string
          default_sla_hours: number
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          default_sla_hours?: number
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          default_sla_hours?: number
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      helpdesk_comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          ticket_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          ticket_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "helpdesk_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "helpdesk_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      helpdesk_tickets: {
        Row: {
          assignee_id: string | null
          category_id: string | null
          created_at: string
          description: string
          id: string
          priority: string
          requester_id: string
          resolved_at: string | null
          sla_due_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          category_id?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string
          requester_id: string
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string
          requester_id?: string
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "helpdesk_tickets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "helpdesk_categories"
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
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
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
      payroll_runs: {
        Row: {
          created_at: string
          created_by: string | null
          employee_count: number
          finalized_at: string | null
          id: string
          notes: string | null
          period_month: number
          period_year: number
          status: string
          total_deductions: number
          total_gross: number
          total_net: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          employee_count?: number
          finalized_at?: string | null
          id?: string
          notes?: string | null
          period_month: number
          period_year: number
          status?: string
          total_deductions?: number
          total_gross?: number
          total_net?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          employee_count?: number
          finalized_at?: string | null
          id?: string
          notes?: string | null
          period_month?: number
          period_year?: number
          status?: string
          total_deductions?: number
          total_gross?: number
          total_net?: number
          updated_at?: string
        }
        Relationships: []
      }
      payslips: {
        Row: {
          created_at: string
          currency: string
          deductions: Json
          earnings: Json
          employee_id: string
          gross: number
          id: string
          issued_at: string | null
          lop_days: number
          net_pay: number
          period_month: number
          period_year: number
          run_id: string
          status: string
          total_deductions: number
          updated_at: string
          working_days: number
        }
        Insert: {
          created_at?: string
          currency?: string
          deductions?: Json
          earnings?: Json
          employee_id: string
          gross?: number
          id?: string
          issued_at?: string | null
          lop_days?: number
          net_pay?: number
          period_month: number
          period_year: number
          run_id: string
          status?: string
          total_deductions?: number
          updated_at?: string
          working_days?: number
        }
        Update: {
          created_at?: string
          currency?: string
          deductions?: Json
          earnings?: Json
          employee_id?: string
          gross?: number
          id?: string
          issued_at?: string | null
          lop_days?: number
          net_pay?: number
          period_month?: number
          period_year?: number
          run_id?: string
          status?: string
          total_deductions?: number
          updated_at?: string
          working_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "payslips_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "payroll_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          comments: string | null
          created_at: string
          cycle_id: string
          employee_id: string
          id: string
          improvements: string | null
          rating: number | null
          review_type: string
          reviewer_id: string | null
          status: string
          strengths: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          cycle_id: string
          employee_id: string
          id?: string
          improvements?: string | null
          rating?: number | null
          review_type: string
          reviewer_id?: string | null
          status?: string
          strengths?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          cycle_id?: string
          employee_id?: string
          id?: string
          improvements?: string | null
          rating?: number | null
          review_type?: string
          reviewer_id?: string | null
          status?: string
          strengths?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "review_cycles"
            referencedColumns: ["id"]
          },
        ]
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
      project_members: {
        Row: {
          allocation_pct: number | null
          created_at: string
          id: string
          project_id: string
          project_role: string
          user_id: string
        }
        Insert: {
          allocation_pct?: number | null
          created_at?: string
          id?: string
          project_id: string
          project_role?: string
          user_id: string
        }
        Update: {
          allocation_pct?: number | null
          created_at?: string
          id?: string
          project_id?: string
          project_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          billable: boolean
          client: string | null
          code: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          billable?: boolean
          client?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          billable?: boolean
          client?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_cycles: {
        Row: {
          created_at: string
          id: string
          manager_review_due: string | null
          name: string
          period_end: string
          period_start: string
          self_review_due: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          manager_review_due?: string | null
          name: string
          period_end: string
          period_start: string
          self_review_due?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          manager_review_due?: string | null
          name?: string
          period_end?: string
          period_start?: string
          self_review_due?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      salary_structures: {
        Row: {
          basic: number
          created_at: string
          ctc_annual: number
          currency: string
          effective_from: string
          employee_id: string
          hra: number
          id: string
          notes: string | null
          other_allowances: number
          other_deductions: number
          pf_deduction: number
          special_allowance: number
          tax_deduction: number
          updated_at: string
        }
        Insert: {
          basic?: number
          created_at?: string
          ctc_annual?: number
          currency?: string
          effective_from?: string
          employee_id: string
          hra?: number
          id?: string
          notes?: string | null
          other_allowances?: number
          other_deductions?: number
          pf_deduction?: number
          special_allowance?: number
          tax_deduction?: number
          updated_at?: string
        }
        Update: {
          basic?: number
          created_at?: string
          ctc_annual?: number
          currency?: string
          effective_from?: string
          employee_id?: string
          hra?: number
          id?: string
          notes?: string | null
          other_allowances?: number
          other_deductions?: number
          pf_deduction?: number
          special_allowance?: number
          tax_deduction?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_structures_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_structures_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_visits: {
        Row: {
          id: string
          path: string | null
          ua: string | null
          visited_at: string
        }
        Insert: {
          id?: string
          path?: string | null
          ua?: string | null
          visited_at?: string
        }
        Update: {
          id?: string
          path?: string | null
          ua?: string | null
          visited_at?: string
        }
        Relationships: []
      }
      timesheet_entries: {
        Row: {
          billable: boolean
          created_at: string
          entry_date: string
          hours: number
          id: string
          notes: string | null
          project_id: string | null
          task: string | null
          updated_at: string
          user_id: string
          week_id: string | null
        }
        Insert: {
          billable?: boolean
          created_at?: string
          entry_date: string
          hours: number
          id?: string
          notes?: string | null
          project_id?: string | null
          task?: string | null
          updated_at?: string
          user_id: string
          week_id?: string | null
        }
        Update: {
          billable?: boolean
          created_at?: string
          entry_date?: string
          hours?: number
          id?: string
          notes?: string | null
          project_id?: string | null
          task?: string | null
          updated_at?: string
          user_id?: string
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timesheet_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheet_entries_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "timesheet_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheet_weeks: {
        Row: {
          billable_hours: number | null
          created_at: string
          id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          total_hours: number | null
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          billable_hours?: number | null
          created_at?: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          total_hours?: number | null
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          billable_hours?: number | null
          created_at?: string
          id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          total_hours?: number | null
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "timesheet_weeks_reviewed_by_profiles_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheet_weeks_reviewed_by_profiles_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheet_weeks_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "employee_directory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheet_weeks_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_requests: {
        Row: {
          approver_id: string | null
          created_at: string
          currency: string
          decided_at: string | null
          decision_note: string | null
          destination: string
          estimated_cost: number | null
          from_date: string
          id: string
          purpose: string
          status: string
          to_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approver_id?: string | null
          created_at?: string
          currency?: string
          decided_at?: string | null
          decision_note?: string | null
          destination: string
          estimated_cost?: number | null
          from_date: string
          id?: string
          purpose: string
          status?: string
          to_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approver_id?: string | null
          created_at?: string
          currency?: string
          decided_at?: string | null
          decision_note?: string | null
          destination?: string
          estimated_cost?: number | null
          from_date?: string
          id?: string
          purpose?: string
          status?: string
          to_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      employee_directory: {
        Row: {
          avatar_url: string | null
          department_id: string | null
          designation: string | null
          email: string | null
          employee_id: string | null
          employment_type: string | null
          full_name: string | null
          id: string | null
          joining_date: string | null
          location: string | null
          manager_id: string | null
          status: string | null
          work_mode: string | null
        }
        Insert: {
          avatar_url?: string | null
          department_id?: string | null
          designation?: string | null
          email?: string | null
          employee_id?: string | null
          employment_type?: string | null
          full_name?: string | null
          id?: string | null
          joining_date?: string | null
          location?: string | null
          manager_id?: string | null
          status?: string | null
          work_mode?: string | null
        }
        Update: {
          avatar_url?: string | null
          department_id?: string | null
          designation?: string | null
          email?: string | null
          employee_id?: string | null
          employment_type?: string | null
          full_name?: string | null
          id?: string | null
          joining_date?: string | null
          location?: string | null
          manager_id?: string | null
          status?: string | null
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
    }
    Functions: {
      [_ in never]: never
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
