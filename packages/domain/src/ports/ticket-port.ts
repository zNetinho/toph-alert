import type { CreateTicketInput, CreateTicketResult } from '../types/ticket';

/**
 * Port for creating tickets in an external tracker (Runrunit V1).
 * Implementations live in `@toph-alert/integrations` — no HTTP here.
 */
export interface TicketPort {
  createTicket(input: CreateTicketInput): Promise<CreateTicketResult>;
}
