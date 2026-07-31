import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';
import { ensureMonorepoEnv } from '@/lib/load-monorepo-env';

/**
 * Service-role client for ingest/worker (bypasses RLS).
 * Never import from Client Components.
 */
export function createAdminClient() {
  ensureMonorepoEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
