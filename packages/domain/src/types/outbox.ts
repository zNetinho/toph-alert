/**
 * Outbox steps processed by the worker (order: create_ticket → notify).
 */
export const OUTBOX_STEPS = ['create_ticket', 'notify'] as const;

export type OutboxStep = (typeof OUTBOX_STEPS)[number];

export const OUTBOX_STATUSES = ['pending', 'processing', 'done', 'failed'] as const;

export type OutboxStatus = (typeof OUTBOX_STATUSES)[number];
