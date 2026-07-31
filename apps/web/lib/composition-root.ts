/**
 * Composition root — single factory for domain ports used by ingest, worker, and pipeline.
 * Adapters swap here; callers never construct HTTP clients inline.
 */

import type { DomainPorts } from '@/lib/domain-ports';
import { createStubErrorStore, stubNotifyPort, stubTicketPort } from '@/lib/domain-ports';
import { createSupabaseErrorStore } from '@/lib/supabase/error-store';
import { isSupabaseAdminConfigured } from '@/lib/supabase/env';

export type { DomainPorts };

/**
 * Builds wired ports for the current process.
 * Uses Supabase ErrorStore when service role is configured; otherwise in-memory stub (local compile).
 */
export function createCompositionRoot(): DomainPorts {
  const errors = isSupabaseAdminConfigured() ? createSupabaseErrorStore() : createStubErrorStore();

  if (!isSupabaseAdminConfigured()) {
    console.warn(
      '[composition-root] SUPABASE_SERVICE_ROLE_KEY missing — using in-memory ErrorStore stub',
    );
  }

  return {
    tickets: stubTicketPort,
    notify: stubNotifyPort,
    errors,
  };
}

let cached: DomainPorts | null = null;

/** Lazy singleton for route handlers / workers in the same isolate. */
export function getDomainPorts(): DomainPorts {
  if (!cached) {
    cached = createCompositionRoot();
  }
  return cached;
}
