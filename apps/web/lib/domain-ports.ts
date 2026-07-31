/**
 * Compile-time wiring stubs for domain ports.
 * Runtime wiring lives in `lib/composition-root.ts` (T05+).
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
  SaveTicketInput,
  SavedTicket,
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
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  async createTicket(_input: CreateTicketInput): Promise<CreateTicketResult> {
    return { externalId: `stub-ticket-${crypto.randomUUID()}`, statusCode: 200 };
  },
};

/** Stub notify adapter — replaced by Discord in T08. */
export const stubNotifyPort: NotifyPort = {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  async notify(_input: NotifyInput): Promise<NotifyResult> {
    return { ok: true, statusCode: 204 };
  },
};

/** In-memory ErrorStore stub — used when Supabase admin env is absent / unit tests. */
export function createStubErrorStore(seed?: { lojas?: Loja[] }): ErrorStore {
  const lojas = new Map<string, Loja>();
  const erros = new Map<ErroId, Erro>();
  const tickets = new Map<ErroId, SavedTicket>();
  const outbox: EnqueueOutboxInput[] = [];

  for (const loja of seed?.lojas ?? []) {
    lojas.set(loja.storeKey, loja);
  }

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

    async enqueueOutbox(input: EnqueueOutboxInput) {
      outbox.push(input);
    },

    async saveTicket(input: SaveTicketInput) {
      const saved: SavedTicket = {
        erroId: input.erroId,
        externalId: input.externalId,
        provider: input.provider ?? 'runrunit',
        title: input.title,
      };
      tickets.set(input.erroId, saved);
      return saved;
    },

    async findTicketByErroId(erroId: ErroId) {
      return tickets.get(erroId) ?? null;
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
 * Helper used by ingest route — fingerprint from payload at the boundary.
 */
export function fingerprintFromIngest(payload: IngestPayload) {
  return computeFingerprint(payload);
}
