/**
 * T06 acceptance (in-memory): two identical payloads → one erro, one claim/ticket.
 * Run from packages/domain:
 *   node --experimental-strip-types --experimental-transform-types scripts/verify-pipeline.ts
 */

import {
  computeFingerprint,
  createErrorPipeline,
  type CreateTicketInput,
  type CreateTicketResult,
  type EnqueueOutboxInput,
  type Erro,
  type ErroId,
  type ErroStatus,
  type ErrorStore,
  type IngestPayload,
  type Loja,
  type NotifyInput,
  type NotifyResult,
  type SaveTicketInput,
  type SavedTicket,
  type UpsertErroInput,
  type UpsertErroResult,
} from '../src/index.ts';

function createMemoryStore(seedLojas: Loja[]): ErrorStore {
  const lojas = new Map(seedLojas.map((l) => [l.storeKey, l]));
  const erros = new Map<ErroId, Erro>();
  const tickets = new Map<ErroId, SavedTicket>();
  const outbox: EnqueueOutboxInput[] = [];

  return {
    async findLojaByStoreKey(storeKey) {
      return lojas.get(storeKey) ?? null;
    },
    async upsertErro(input: UpsertErroInput): Promise<UpsertErroResult> {
      const existing = [...erros.values()].find(
        (e) => e.lojaId === input.lojaId && e.fingerprint === input.fingerprint,
      );
      if (existing) {
        const updated = {
          ...existing,
          occurrenceCount: existing.occurrenceCount + 1,
          updatedAt: new Date().toISOString(),
          message: input.payload.message,
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
        status: 'novo',
        occurrenceCount: 1,
        createdAt: now,
        updatedAt: now,
      };
      erros.set(created.id, created);
      return { erro: created, created: true };
    },
    async findErroById(id) {
      return erros.get(id) ?? null;
    },
    async claimProcessing(erroId) {
      const erro = erros.get(erroId);
      if (!erro || erro.status !== 'novo') return null;
      const claimed = {
        ...erro,
        status: 'processing' as const,
        updatedAt: new Date().toISOString(),
      };
      erros.set(erroId, claimed);
      return claimed;
    },
    async updateErroStatus(erroId: ErroId, status: ErroStatus) {
      const erro = erros.get(erroId);
      if (!erro) throw new Error('missing');
      const updated = { ...erro, status, updatedAt: new Date().toISOString() };
      erros.set(erroId, updated);
      return updated;
    },
    async enqueueOutbox(input) {
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
    async findTicketByErroId(erroId) {
      return tickets.get(erroId) ?? null;
    },
  };
}

async function main() {
  let ticketCalls = 0;
  const tickets = {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    async createTicket(_input: CreateTicketInput): Promise<CreateTicketResult> {
      ticketCalls += 1;
      return { externalId: `stub-${ticketCalls}`, statusCode: 200 };
    },
  };
  const notify = {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    async notify(_input: NotifyInput): Promise<NotifyResult> {
      return { ok: true, statusCode: 204 };
    },
  };

  const lojaId = crypto.randomUUID();
  const errors = createMemoryStore([
    { id: lojaId, storeKey: 'verify-store', allowedOrigins: ['*'] },
  ]);
  const pipeline = createErrorPipeline({ errors, tickets, notify });

  const payload: IngestPayload = {
    storeKey: 'verify-store',
    message: 'TypeError: pipeline verify',
    type: 'TypeError',
    stack: 'TypeError: pipeline verify\n    at checkout',
  };
  const fingerprint = computeFingerprint(payload);

  const first = await errors.upsertErro({ lojaId, fingerprint, payload });
  const second = await errors.upsertErro({ lojaId, fingerprint, payload });

  if (!first.created || second.created || first.erro.id !== second.erro.id) {
    throw new Error('dedupe failed');
  }
  if (second.erro.occurrenceCount !== 2) {
    throw new Error(`occurrenceCount=${second.erro.occurrenceCount}`);
  }

  const claim1 = await pipeline.processCreateTicket(first.erro.id);
  const claim2 = await pipeline.processCreateTicket(first.erro.id);

  if (claim1.outcome !== 'created') throw new Error(JSON.stringify(claim1));
  if (claim2.outcome !== 'skipped') throw new Error(JSON.stringify(claim2));
  if (ticketCalls !== 1) throw new Error(`ticketCalls=${ticketCalls}`);

  const erro = await errors.findErroById(first.erro.id);
  if (erro?.status !== 'ticket_aberto') throw new Error(`status=${erro?.status}`);

  console.log(
    JSON.stringify({
      ok: true,
      erroId: first.erro.id,
      occurrenceCount: second.erro.occurrenceCount,
      ticketCalls,
      secondOutcome: claim2.outcome,
      status: erro.status,
    }),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
