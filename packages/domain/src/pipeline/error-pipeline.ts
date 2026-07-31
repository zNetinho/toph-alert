import type { ErrorStore } from '../ports/error-store';
import type { NotifyPort } from '../ports/notify-port';
import type { TicketPort } from '../ports/ticket-port';
import type { Erro, ErroId } from '../types/erro';

export type ErrorPipelineDeps = {
  errors: ErrorStore;
  tickets: TicketPort;
  notify: NotifyPort;
};

export type ProcessCreateTicketOptions = {
  /** Base URL for deep-links, e.g. https://alert.example.com */
  deepLinkBaseUrl?: string;
};

export type ProcessCreateTicketResult =
  | { outcome: 'created'; erro: Erro; ticketExternalId: string }
  | { outcome: 'skipped'; reason: 'already_claimed_or_missing' | 'ticket_already_exists' }
  | { outcome: 'failed'; erro: Erro; statusCode: number };

export type ProcessNotifyOptions = {
  ticketExternalId: string;
  title?: string;
  deepLinkBaseUrl?: string;
};

export type ProcessNotifyResult =
  | { outcome: 'notified'; erro: Erro; ticketExternalId: string }
  | { outcome: 'skipped'; reason: 'erro_missing' }
  | { outcome: 'failed'; erro: Erro; statusCode?: number };

function isSuccessStatus(statusCode: number): boolean {
  return statusCode === 200 || statusCode === 204;
}

function buildTitle(erro: Erro): string {
  const type = erro.type?.trim() || 'Error';
  const message = erro.message.trim().slice(0, 120);
  return `[toph-alert] ${type}: ${message}`;
}

function buildDescription(erro: Erro, deepLinkUrl?: string): string {
  const parts = [
    `fingerprint: ${erro.fingerprint}`,
    `occurrences: ${erro.occurrenceCount}`,
    erro.url ? `url: ${erro.url}` : null,
    deepLinkUrl ? `panel: ${deepLinkUrl}` : null,
    '',
    erro.stack?.trim() || erro.message,
  ];
  return parts.filter((p) => p !== null).join('\n');
}

function deepLinkFor(erroId: ErroId, baseUrl?: string): string | undefined {
  if (!baseUrl) return undefined;
  return `${baseUrl.replace(/\/$/, '')}/errors/${erroId}`;
}

/**
 * Domain orchestration: claim → ticket → ticket_aberto → enqueue notify.
 * HTTP details stay behind TicketPort / NotifyPort.
 */
export class ErrorPipeline {
  constructor(private readonly deps: ErrorPipelineDeps) {}

  /**
   * Outbox step `create_ticket`.
   * Claim is atomic (novo → processing); a second call is a no-op (no second ticket).
   */
  async processCreateTicket(
    erroId: ErroId,
    options: ProcessCreateTicketOptions = {},
  ): Promise<ProcessCreateTicketResult> {
    const existingTicket = await this.deps.errors.findTicketByErroId(erroId);
    if (existingTicket) {
      return { outcome: 'skipped', reason: 'ticket_already_exists' };
    }

    const claimed = await this.deps.errors.claimProcessing(erroId);
    if (!claimed) {
      return { outcome: 'skipped', reason: 'already_claimed_or_missing' };
    }

    const deepLinkUrl = deepLinkFor(claimed.id, options.deepLinkBaseUrl);
    const title = buildTitle(claimed);
    const description = buildDescription(claimed, deepLinkUrl);

    try {
      const ticket = await this.deps.tickets.createTicket({
        erro: claimed,
        title,
        description,
        deepLinkUrl,
      });

      if (!isSuccessStatus(ticket.statusCode)) {
        await this.deps.errors.updateErroStatus(claimed.id, 'novo');
        return { outcome: 'failed', erro: claimed, statusCode: ticket.statusCode };
      }

      await this.deps.errors.saveTicket({
        erroId: claimed.id,
        externalId: ticket.externalId,
        provider: 'runrunit',
        title,
        raw: ticket.raw,
      });

      const opened = await this.deps.errors.updateErroStatus(claimed.id, 'ticket_aberto');

      await this.deps.errors.enqueueOutbox({
        erroId: claimed.id,
        step: 'notify',
        payload: {
          ticketExternalId: ticket.externalId,
          title,
        },
      });

      return {
        outcome: 'created',
        erro: opened,
        ticketExternalId: ticket.externalId,
      };
    } catch (error) {
      await this.deps.errors.updateErroStatus(claimed.id, 'novo');
      throw error;
    }
  }

  /**
   * Outbox step `notify` — Discord (or other) after ticket is confirmed.
   * Never opens a ticket; safe to retry independently of create_ticket.
   */
  async processNotify(erroId: ErroId, options: ProcessNotifyOptions): Promise<ProcessNotifyResult> {
    const erro = await this.deps.errors.findErroById(erroId);
    if (!erro) {
      return { outcome: 'skipped', reason: 'erro_missing' };
    }

    const deepLinkUrl = deepLinkFor(erro.id, options.deepLinkBaseUrl);
    const title = options.title ?? buildTitle(erro);

    const result = await this.deps.notify.notify({
      erro,
      ticketExternalId: options.ticketExternalId,
      title,
      summary: erro.message,
      deepLinkUrl,
    });

    if (!result.ok) {
      return { outcome: 'failed', erro, statusCode: result.statusCode };
    }

    return {
      outcome: 'notified',
      erro,
      ticketExternalId: options.ticketExternalId,
    };
  }
}

export function createErrorPipeline(deps: ErrorPipelineDeps): ErrorPipeline {
  return new ErrorPipeline(deps);
}
