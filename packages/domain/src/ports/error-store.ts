import type { Erro, ErroId, Loja, LojaId } from '../types/erro';
import type { ErroStatus } from '../types/erro-status';
import type { Fingerprint } from '../types/fingerprint';
import type { IngestPayload } from '../types/ingest';
import type { OutboxStep } from '../types/outbox';

export type UpsertErroInput = {
  lojaId: LojaId;
  fingerprint: Fingerprint;
  payload: IngestPayload;
};

export type UpsertErroResult = {
  erro: Erro;
  /** True when this call created the row (first occurrence). */
  created: boolean;
};

export type EnqueueOutboxInput = {
  erroId: ErroId;
  step: OutboxStep;
  payload?: Record<string, unknown>;
};

/**
 * Persistence port for lojas, erros, and outbox enqueue.
 * Supabase adapter will live in `apps/web` — domain stays store-agnostic.
 */
export interface ErrorStore {
  findLojaByStoreKey(storeKey: string): Promise<Loja | null>;

  upsertErro(input: UpsertErroInput): Promise<UpsertErroResult>;

  findErroById(id: ErroId): Promise<Erro | null>;

  /**
   * Atomically claim an error for ticket creation.
   * Returns the claimed erro when transition novo → processing succeeds;
   * returns null when already claimed / processed (idempotent no-op).
   */
  claimProcessing(erroId: ErroId): Promise<Erro | null>;

  updateErroStatus(erroId: ErroId, status: ErroStatus): Promise<Erro>;

  enqueueOutbox(input: EnqueueOutboxInput): Promise<void>;
}
