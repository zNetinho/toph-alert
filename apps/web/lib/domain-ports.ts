/**
 * Compile-time wiring surface for domain ports.
 * Real adapters (Supabase / Runrunit / Discord) are registered in later tasks;
 * this module proves `apps/web` can type ingest/worker against `@toph-alert/domain`.
 */

import type {
  CreateTicketInput,
  CreateTicketResult,
  EnqueueOutboxInput,
  Erro,
  ErroId,
  ErroStatus,
  ErrorStore,
  IngestPayload,
  Loja,
  NotifyInput,
  NotifyPort,
  NotifyResult,
  TicketPort,
  UpsertErroInput,
  UpsertErroResult,
} from '@toph-alert/domain';
import { computeFingerprint } from '@toph-alert/domain';

export type DomainPorts = {
  tickets: TicketPort;
  notify: NotifyPort;
  errors: ErrorStore;
};

/** Stub ticket adapter — replaced by Runrunit in T07. */
export const stubTicketPort: TicketPort = {
  async createTicket(_input: CreateTicketInput): Promise<CreateTicketResult> {
    return { externalId: 'stub-ticket', statusCode: 200 };
  },
};

/** Stub notify adapter — replaced by Discord in T08. */
export const stubNotifyPort: NotifyPort = {
  async notify(_input: NotifyInput): Promise<NotifyResult> {
    return { ok: true, statusCode: 204 };
  },
};

/** In-memory ErrorStore stub — replaced by Supabase in T03/T05. */
export function createStubErrorStore(): ErrorStore {
  const lojas = new Map<string, Loja>();
  const erros = new Map<ErroId, Erro>();

  return {
    async findLojaByStoreKey(storeKey: string) {
      return lojas.get(storeKey) ?? null;
    },

    async upsertErro(input: UpsertErroInput): Promise<UpsertErroResult> {
      const existing = [...erros.values()].find(
        (e) => e.lojaId === input.lojaId && e.fingerprint === input.fingerprint,
      );

      if (existing) {
        const updated: Erro = {
          ...existing,
          occurrenceCount: existing.occurrenceCount + 1,
          updatedAt: new Date().toISOString(),
          message: input.payload.message,
          stack: input.payload.stack,
          traces: input.payload.traces,
        };
        erros.set(updated.id, updated);
        return { erro: updated, created: false };
      }

      const now = new Date().toISOString();
      const created: Erro = {
        id: crypto.randomUUID(),
        lojaId: input.lojaId,
        fingerprint: input.fingerprint,
        message: input.payload.message,
        type: input.payload.type,
        stack: input.payload.stack,
        traces: input.payload.traces,
        url: input.payload.url,
        status: 'novo',
        occurrenceCount: 1,
        createdAt: now,
        updatedAt: now,
      };
      erros.set(created.id, created);
      return { erro: created, created: true };
    },

    async findErroById(id: ErroId) {
      return erros.get(id) ?? null;
    },

    async claimProcessing(erroId: ErroId) {
      const erro = erros.get(erroId);
      if (!erro || erro.status !== 'novo') return null;
      const claimed: Erro = {
        ...erro,
        status: 'processing',
        updatedAt: new Date().toISOString(),
      };
      erros.set(erroId, claimed);
      return claimed;
    },

    async updateErroStatus(erroId: ErroId, status: ErroStatus) {
      const erro = erros.get(erroId);
      if (!erro) throw new Error(`Erro not found: ${erroId}`);
      const updated: Erro = {
        ...erro,
        status,
        updatedAt: new Date().toISOString(),
      };
      erros.set(erroId, updated);
      return updated;
    },

    async enqueueOutbox(_input: EnqueueOutboxInput) {
      // no-op until outbox persistence (T05)
    },
  };
}

export function createDomainPorts(): DomainPorts {
  return {
    tickets: stubTicketPort,
    notify: stubNotifyPort,
    errors: createStubErrorStore(),
  };
}

/**
 * Helper used by future ingest route — fingerprint from payload at the boundary.
 */
export function fingerprintFromIngest(payload: IngestPayload) {
  return computeFingerprint(payload);
}
