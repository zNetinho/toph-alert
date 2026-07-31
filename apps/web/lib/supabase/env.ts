import { ensureMonorepoEnv } from '@/lib/load-monorepo-env';

/**
 * Resolves public Supabase credentials.
 * Prefers publishable key (current docs); falls back to legacy anon key.
 */
export function getSupabasePublicEnv() {
  ensureMonorepoEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)',
    );
  }

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  ensureMonorepoEnv();
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

/** Service-role credentials required by ingest/worker (bypasses RLS). */
export function isSupabaseAdminConfigured(): boolean {
  ensureMonorepoEnv();
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
