/**
 * Domain package — ports, types, and pure business rules.
 * HTTP adapters (Runrunit, Discord) live in `@toph-alert/integrations`.
 */

export const DOMAIN_PACKAGE = '@toph-alert/domain' as const;

export type { Fingerprint } from './types/fingerprint';
export { toFingerprint } from './types/fingerprint';

export type { ErroStatus } from './types/erro-status';
export { ERRO_STATUSES, isErroStatus } from './types/erro-status';

export type { IngestPayload } from './types/ingest';

export type { Erro, ErroId, Loja, LojaId } from './types/erro';

export type { CreateTicketInput, CreateTicketResult } from './types/ticket';

export type { NotifyInput, NotifyResult } from './types/notify';

export type { OutboxStep, OutboxStatus } from './types/outbox';
export { OUTBOX_STEPS, OUTBOX_STATUSES } from './types/outbox';

export type { TicketPort } from './ports/ticket-port';
export type { NotifyPort } from './ports/notify-port';
export type {
  ErrorStore,
  UpsertErroInput,
  UpsertErroResult,
  EnqueueOutboxInput,
  SaveTicketInput,
  SavedTicket,
} from './ports/error-store';

export type { FingerprintSource } from './fingerprint/compute-fingerprint';
export { computeFingerprint } from './fingerprint/compute-fingerprint';

export type {
  ErrorPipelineDeps,
  ProcessCreateTicketOptions,
  ProcessCreateTicketResult,
  ProcessNotifyOptions,
  ProcessNotifyResult,
} from './pipeline/error-pipeline';
export { ErrorPipeline, createErrorPipeline } from './pipeline/error-pipeline';
