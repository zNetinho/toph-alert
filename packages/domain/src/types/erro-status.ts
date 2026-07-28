/**
 * Error lifecycle for V1 pipeline.
 * Flow: novo → processing → ticket_aberto
 */
export const ERRO_STATUSES = ['novo', 'processing', 'ticket_aberto'] as const;

export type ErroStatus = (typeof ERRO_STATUSES)[number];

export function isErroStatus(value: string): value is ErroStatus {
  return (ERRO_STATUSES as readonly string[]).includes(value);
}
