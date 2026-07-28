import type { NotifyInput, NotifyResult } from '../types/notify';

/**
 * Port for notifying the team after a ticket is created (Discord V1).
 * Keep pluggable for Slack / WhatsApp / Gmail later.
 */
export interface NotifyPort {
  notify(input: NotifyInput): Promise<NotifyResult>;
}
