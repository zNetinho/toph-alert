import type { Erro } from './erro';

/**
 * Input for opening a task in the ticketing system (Runrunit in V1).
 * Adapters map this to vendor-specific payloads.
 */
export type CreateTicketInput = {
  erro: Erro;
  title: string;
  description: string;
  /** Absolute deep-link to the authenticated error detail page. */
  deepLinkUrl?: string;
};

export type CreateTicketResult = {
  /** External task id from the provider (e.g. Runrunit task id). */
  externalId: string;
  /** HTTP-like status from the provider call (200/204 = success). */
  statusCode: number;
  raw?: unknown;
};
