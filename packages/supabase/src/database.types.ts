export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {

      activity_events: {
        Row: { id: string; app: string; actor_type: string; actor_id: string | null; actor_name: string | null; action: string; target_type: string; target_id: string; tone: string; payload: Json; created_at: string };
        Insert: { id: string; app: string; actor_type: string; actor_id?: string | null; actor_name?: string | null; action: string; target_type?: string; target_id?: string; tone?: string; payload?: Json; created_at?: string };
        Update: Partial<Database['public']['Tables']['activity_events']['Insert']>;
        Relationships: [];
      };
      app_state_snapshots: {
        Row: {
          id: string;
          app: string;
          payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          app: string;
          payload: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          app?: string;
          payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: { id: string; username: string; display_name: string; email: string | null; country: string | null; kyc_level: number; kyc_status: string; risk_level: string; status: string; wallet_address: string | null; created_at: string; updated_at: string };
        Insert: { id: string; username: string; display_name: string; email?: string | null; country?: string | null; kyc_level?: number; kyc_status?: string; risk_level?: string; status?: string; wallet_address?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      ads: {
        Row: { id: string; trader_id: string; side: string; asset: string; fiat: string; price: number; available_amount: number; min_fiat: number; max_fiat: number; payment_methods: string[]; status: string; terms: string | null; created_at: string; updated_at: string };
        Insert: { id: string; trader_id: string; side: string; asset: string; fiat: string; price: number; available_amount: number; min_fiat: number; max_fiat: number; payment_methods?: string[]; status?: string; terms?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['ads']['Insert']>;
        Relationships: [];
      };
      orders: {
        Row: { id: string; ad_id: string | null; buyer_id: string; seller_id: string; side: string; asset: string; asset_amount: number; fiat: string; fiat_amount: number; price: number; status: string; escrow_status: string; payment_method: string | null; payment_account_name: string | null; payment_account_masked: string | null; timer_ends_at: string | null; escrow_tx: string | null; fee_amount: number | null; created_at: string; updated_at: string };
        Insert: { id: string; ad_id?: string | null; buyer_id: string; seller_id: string; side: string; asset: string; asset_amount: number; fiat: string; fiat_amount: number; price: number; status?: string; escrow_status?: string; payment_method?: string | null; payment_account_name?: string | null; payment_account_masked?: string | null; timer_ends_at?: string | null; escrow_tx?: string | null; fee_amount?: number | null; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
        Relationships: [];
      };
      order_events: {
        Row: { id: string; order_id: string; type: string; label: string; description: string | null; actor_type: string; created_at: string };
        Insert: { id: string; order_id: string; type: string; label: string; description?: string | null; actor_type?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['order_events']['Insert']>;
        Relationships: [];
      };
      order_messages: {
        Row: { id: string; order_id: string; sender_id: string | null; sender_type: string; sender_name: string | null; body: string; attachment_url: string | null; created_at: string };
        Insert: { id: string; order_id: string; sender_id?: string | null; sender_type: string; sender_name?: string | null; body: string; attachment_url?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['order_messages']['Insert']>;
        Relationships: [];
      };

      notifications: {
        Row: { id: string; user_id: string | null; type: string; title: string; body: string; channel: string; status: string; read_at: string | null; created_at: string };
        Insert: { id: string; user_id?: string | null; type: string; title: string; body: string; channel: string; status?: string; read_at?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
        Relationships: [];
      };
      disputes: {
        Row: { id: string; order_id: string; reason: string; status: string; priority: string; amount: number; asset: string; buyer_evidence_count: number; seller_evidence_count: number; assigned_moderator: string | null; moderator_notes: string[]; created_at: string; updated_at: string };
        Insert: { id: string; order_id: string; reason: string; status?: string; priority?: string; amount: number; asset: string; buyer_evidence_count?: number; seller_evidence_count?: number; assigned_moderator?: string | null; moderator_notes?: string[]; created_at?: string; updated_at?: string };
        Update: Partial<Database['public']['Tables']['disputes']['Insert']>;
        Relationships: [];
      };
      admin_audit_logs: {
        Row: { id: string; admin_name: string; action: string; target_type: string; target_id: string; result: string; created_at: string };
        Insert: { id: string; admin_name: string; action: string; target_type: string; target_id: string; result?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['admin_audit_logs']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
