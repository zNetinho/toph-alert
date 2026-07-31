export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ErroStatus = 'novo' | 'processing' | 'ticket_aberto';
export type OutboxStep = 'create_ticket' | 'notify';
export type OutboxStatus = 'pending' | 'processing' | 'done' | 'failed';

export type Database = {
  public: {
    Tables: {
      lojas: {
        Row: {
          id: string;
          store_key: string;
          name: string | null;
          allowed_origins: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_key: string;
          name?: string | null;
          allowed_origins?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_key?: string;
          name?: string | null;
          allowed_origins?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      erros: {
        Row: {
          id: string;
          loja_id: string;
          fingerprint: string;
          message: string;
          type: string | null;
          stack: string | null;
          traces: Json | null;
          url: string | null;
          status: ErroStatus;
          occurrence_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          loja_id: string;
          fingerprint: string;
          message: string;
          type?: string | null;
          stack?: string | null;
          traces?: Json | null;
          url?: string | null;
          status?: ErroStatus;
          occurrence_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          loja_id?: string;
          fingerprint?: string;
          message?: string;
          type?: string | null;
          stack?: string | null;
          traces?: Json | null;
          url?: string | null;
          status?: ErroStatus;
          occurrence_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'erros_loja_id_fkey';
            columns: ['loja_id'];
            isOneToOne: false;
            referencedRelation: 'lojas';
            referencedColumns: ['id'];
          },
        ];
      };
      tickets: {
        Row: {
          id: string;
          erro_id: string;
          external_id: string;
          provider: string;
          title: string | null;
          raw: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          erro_id: string;
          external_id: string;
          provider?: string;
          title?: string | null;
          raw?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          erro_id?: string;
          external_id?: string;
          provider?: string;
          title?: string | null;
          raw?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tickets_erro_id_fkey';
            columns: ['erro_id'];
            isOneToOne: true;
            referencedRelation: 'erros';
            referencedColumns: ['id'];
          },
        ];
      };
      outbox: {
        Row: {
          id: string;
          erro_id: string;
          step: OutboxStep;
          status: OutboxStatus;
          payload: Json;
          retry_count: number;
          last_error: string | null;
          available_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          erro_id: string;
          step: OutboxStep;
          status?: OutboxStatus;
          payload?: Json;
          retry_count?: number;
          last_error?: string | null;
          available_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          erro_id?: string;
          step?: OutboxStep;
          status?: OutboxStatus;
          payload?: Json;
          retry_count?: number;
          last_error?: string | null;
          available_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'outbox_erro_id_fkey';
            columns: ['erro_id'];
            isOneToOne: false;
            referencedRelation: 'erros';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      erro_status: ErroStatus;
      outbox_step: OutboxStep;
      outbox_status: OutboxStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
