import type { Erro } from './erro';

/**
 * Notification after a ticket was successfully created.
 * Provider-agnostic so Slack/WhatsApp/Gmail can plug in later.
 */
export type NotifyInput = {
  erro: Erro;
  /** External ticket id already created. */
  ticketExternalId: string;
  title: string;
  summary: string;
  deepLinkUrl?: string;
};

export type NotifyResult = {
  ok: boolean;
  statusCode?: number;
  raw?: unknown;
};
