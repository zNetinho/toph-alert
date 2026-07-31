/**
 * Composition root — single factory for domain ports + pipeline used by ingest/worker.
 * Adapters swap here; callers never construct HTTP clients inline.
 */

import { createErrorPipeline, type ErrorPipeline } from '@toph-alert/domain';

import type { DomainPorts } from '@/lib/domain-ports';
import { createStubErrorStore, stubNotifyPort, stubTicketPort } from '@/lib/domain-ports';
import { createSupabaseErrorStore } from '@/lib/supabase/error-store';
import { isSupabaseAdminConfigured } from '@/lib/supabase/env';

export type { DomainPorts };

export type CompositionRoot = DomainPorts & {
  pipeline: ErrorPipeline;
};

/**
 * Builds wired ports for the current process.
 * Uses Supabase ErrorStore when service role is configured; otherwise in-memory stub.
 */
export function createCompositionRoot(): CompositionRoot {
  const errors = isSupabaseAdminConfigured() ? createSupabaseErrorStore() : createStubErrorStore();

  if (!isSupabaseAdminConfigured()) {
    console.warn(
      '[composition-root] SUPABASE_SERVICE_ROLE_KEY missing — using in-memory ErrorStore stub',
    );
  }

  const ports: DomainPorts = {
    tickets: stubTicketPort,
    notify: stubNotifyPort,
    errors,
  };

  return {
    ...ports,
    pipeline: createErrorPipeline(ports),
  };
}

let cached: CompositionRoot | null = null;

/** Lazy singleton for route handlers / workers in the same isolate. */
export function getCompositionRoot(): CompositionRoot {
  if (!cached) {
    cached = createCompositionRoot();
  }
  return cached;
}

export function getDomainPorts(): DomainPorts {
  const root = getCompositionRoot();
  return {
    tickets: root.tickets,
    notify: root.notify,
    errors: root.errors,
  };
}
