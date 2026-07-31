import type {
  EnqueueOutboxInput,
  Erro,
  ErroId,
  ErroStatus,
  ErrorStore,
  Fingerprint,
  Loja,
  UpsertErroInput,
  UpsertErroResult,
} from '@toph-alert/domain';
import { toFingerprint } from '@toph-alert/domain';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createAdminClient } from './admin';
import type { Database, Json, Tables } from './database.types';

type AdminClient = SupabaseClient<Database>;

function mapLoja(row: Tables<'lojas'>): Loja {
  return {
    id: row.id,
    storeKey: row.store_key,
    name: row.name ?? undefined,
    allowedOrigins: row.allowed_origins,
  };
}

function mapErro(row: Tables<'erros'>): Erro {
  return {
    id: row.id,
    lojaId: row.loja_id,
    fingerprint: toFingerprint(row.fingerprint),
    message: row.message,
    type: row.type ?? undefined,
    stack: row.stack ?? undefined,
    traces: row.traces ?? undefined,
    url: row.url ?? undefined,
    status: row.status,
    occurrenceCount: row.occurrence_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toJson(value: unknown): Json | null {
  if (value === undefined) return null;
  return value as Json;
}

function isUniqueViolation(error: { code?: string; message?: string } | null): boolean {
  return error?.code === '23505' || Boolean(error?.message?.includes('duplicate key'));
}

/**
 * Supabase-backed ErrorStore (service role — bypasses RLS for ingest/worker).
 */
export function createSupabaseErrorStore(
  getClient: () => AdminClient = createAdminClient,
): ErrorStore {
  return {
    async findLojaByStoreKey(storeKey: string) {
      const supabase = getClient();
      const { data, error } = await supabase
        .from('lojas')
        .select('*')
        .eq('store_key', storeKey)
        .maybeSingle();

      if (error) throw new Error(`findLojaByStoreKey: ${error.message}`);
      return data ? mapLoja(data) : null;
    },

    async upsertErro(input: UpsertErroInput): Promise<UpsertErroResult> {
      const supabase = getClient();
      const existing = await findErroByFingerprint(supabase, input.lojaId, input.fingerprint);

      if (existing) {
        const { data, error } = await supabase
          .from('erros')
          .update({
            occurrence_count: existing.occurrence_count + 1,
            message: input.payload.message,
            type: input.payload.type ?? null,
            stack: input.payload.stack ?? null,
            traces: toJson(input.payload.traces),
            url: input.payload.url ?? null,
          })
          .eq('id', existing.id)
          .select('*')
          .single();

        if (error) throw new Error(`upsertErro(update): ${error.message}`);
        return { erro: mapErro(data), created: false };
      }

      const { data, error } = await supabase
        .from('erros')
        .insert({
          loja_id: input.lojaId,
          fingerprint: input.fingerprint,
          message: input.payload.message,
          type: input.payload.type ?? null,
          stack: input.payload.stack ?? null,
          traces: toJson(input.payload.traces),
          url: input.payload.url ?? null,
          status: 'novo',
          occurrence_count: 1,
        })
        .select('*')
        .single();

      if (error) {
        if (isUniqueViolation(error)) {
          const raced = await findErroByFingerprint(supabase, input.lojaId, input.fingerprint);
          if (!raced) throw new Error(`upsertErro(race): ${error.message}`);

          const { data: updated, error: updateError } = await supabase
            .from('erros')
            .update({
              occurrence_count: raced.occurrence_count + 1,
              message: input.payload.message,
              type: input.payload.type ?? null,
              stack: input.payload.stack ?? null,
              traces: toJson(input.payload.traces),
              url: input.payload.url ?? null,
            })
            .eq('id', raced.id)
            .select('*')
            .single();

          if (updateError) throw new Error(`upsertErro(race-update): ${updateError.message}`);
          return { erro: mapErro(updated), created: false };
        }
        throw new Error(`upsertErro(insert): ${error.message}`);
      }

      return { erro: mapErro(data), created: true };
    },

    async findErroById(id: ErroId) {
      const supabase = getClient();
      const { data, error } = await supabase.from('erros').select('*').eq('id', id).maybeSingle();
      if (error) throw new Error(`findErroById: ${error.message}`);
      return data ? mapErro(data) : null;
    },

    async claimProcessing(erroId: ErroId) {
      const supabase = getClient();
      const { data, error } = await supabase
        .from('erros')
        .update({ status: 'processing' })
        .eq('id', erroId)
        .eq('status', 'novo')
        .select('*')
        .maybeSingle();

      if (error) throw new Error(`claimProcessing: ${error.message}`);
      return data ? mapErro(data) : null;
    },

    async updateErroStatus(erroId: ErroId, status: ErroStatus) {
      const supabase = getClient();
      const { data, error } = await supabase
        .from('erros')
        .update({ status })
        .eq('id', erroId)
        .select('*')
        .single();

      if (error) throw new Error(`updateErroStatus: ${error.message}`);
      return mapErro(data);
    },

    async enqueueOutbox(input: EnqueueOutboxInput) {
      const supabase = getClient();
      const { error } = await supabase.from('outbox').insert({
        erro_id: input.erroId,
        step: input.step,
        status: 'pending',
        payload: toJson(input.payload ?? {}) ?? {},
      });

      if (error) throw new Error(`enqueueOutbox: ${error.message}`);
    },
  };
}

async function findErroByFingerprint(
  supabase: AdminClient,
  lojaId: string,
  fingerprint: Fingerprint,
) {
  const { data, error } = await supabase
    .from('erros')
    .select('*')
    .eq('loja_id', lojaId)
    .eq('fingerprint', fingerprint)
    .maybeSingle();

  if (error) throw new Error(`findErroByFingerprint: ${error.message}`);
  return data;
}
