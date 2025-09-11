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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          adresse: string | null
          created_at: string
          email: string
          id: string
          nom: string
          telephone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          email: string
          id?: string
          nom: string
          telephone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          adresse?: string | null
          created_at?: string
          email?: string
          id?: string
          nom?: string
          telephone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string
          company_name: string
          created_at: string
          email: string
          id: string
          logo_url: string | null
          phone: string
          primary_color: string
          secondary_color: string
          siret: string
          updated_at: string
          user_id: string
          website: string
        }
        Insert: {
          address?: string
          company_name?: string
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          phone?: string
          primary_color?: string
          secondary_color?: string
          siret?: string
          updated_at?: string
          user_id: string
          website?: string
        }
        Update: {
          address?: string
          company_name?: string
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          phone?: string
          primary_color?: string
          secondary_color?: string
          siret?: string
          updated_at?: string
          user_id?: string
          website?: string
        }
        Relationships: []
      }
      domaines: {
        Row: {
          created_at: string
          date_expiration: string
          date_rappel: string | null
          hebergement: boolean
          id: string
          nom_client: string
          nom_domaine: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_expiration: string
          date_rappel?: string | null
          hebergement?: boolean
          id?: string
          nom_client: string
          nom_domaine: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_expiration?: string
          date_rappel?: string | null
          hebergement?: boolean
          id?: string
          nom_client?: string
          nom_domaine?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hebergements: {
        Row: {
          created_at: string
          date_expiration: string
          date_rappel: string | null
          id: string
          nom_client: string
          serveur: string
          type_hebergement: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_expiration: string
          date_rappel?: string | null
          id?: string
          nom_client: string
          serveur: string
          type_hebergement: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_expiration?: string
          date_rappel?: string | null
          id?: string
          nom_client?: string
          serveur?: string
          type_hebergement?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          client_id: string | null
          created_at: string
          date_echeance: string
          date_facture: string
          id: string
          items: Json | null
          montant: number
          numero_facture: string
          province: string | null
          sous_total: number
          statut: string
          statut_label: string
          total: number
          tps: number
          tvq: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date_echeance: string
          date_facture?: string
          id?: string
          items?: Json | null
          montant: number
          numero_facture: string
          province?: string | null
          sous_total?: number
          statut?: string
          statut_label?: string
          total?: number
          tps?: number
          tvq?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date_echeance?: string
          date_facture?: string
          id?: string
          items?: Json | null
          montant?: number
          numero_facture?: string
          province?: string | null
          sous_total?: number
          statut?: string
          statut_label?: string
          total?: number
          tps?: number
          tvq?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      loi25_entries: {
        Row: {
          created_at: string
          date_expiration: string
          date_rappel: string | null
          domaine: string
          id: string
          nom_client: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_expiration: string
          date_rappel?: string | null
          domaine: string
          id?: string
          nom_client: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_expiration?: string
          date_rappel?: string | null
          domaine?: string
          id?: string
          nom_client?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          derniere_relance: string | null
          id: string
          invoice_id: string | null
          jours_retard: number
          statut: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          derniere_relance?: string | null
          id?: string
          invoice_id?: string | null
          jours_retard?: number
          statut?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          derniere_relance?: string | null
          id?: string
          invoice_id?: string | null
          jours_retard?: number
          statut?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          display_name: string
          email: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          email: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
