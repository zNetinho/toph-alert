import { isSupabaseConfigured } from './env';
import { createAdminClient } from './admin';
import type { TablesInsert } from './database.types';

export type SchemaSmokeResult =
  | { configured: false }
  | {
      configured: true;
      ok: boolean;
      lojaCount: number;
      error?: string;
    };

/**
 * Verifies the V1 schema is reachable via the service-role client.
 * Safe no-op when env vars are absent (local scaffold without Supabase).
 */
export async function smokeSchemaReadWrite(): Promise<SchemaSmokeResult> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { configured: false };
  }

  try {
    const supabase = createAdminClient();

    const probeKey = `t03-smoke-${Date.now()}`;
    const insertRow: TablesInsert<'lojas'> = {
      store_key: probeKey,
      name: 'T03 schema smoke',
      allowed_origins: ['http://localhost:3000'],
    };

    const { data: inserted, error: insertError } = await supabase
      .from('lojas')
      .insert(insertRow)
      .select('id')
      .single();

    if (insertError) {
      return {
        configured: true,
        ok: false,
        lojaCount: 0,
        error: insertError.message,
      };
    }

    const { count, error: countError } = await supabase
      .from('lojas')
      .select('*', { count: 'exact', head: true });

    if (inserted?.id) {
      await supabase.from('lojas').delete().eq('id', inserted.id);
    }

    if (countError) {
      return {
        configured: true,
        ok: false,
        lojaCount: 0,
        error: countError.message,
      };
    }

    return {
      configured: true,
      ok: true,
      lojaCount: count ?? 0,
    };
  } catch (error) {
    return {
      configured: true,
      ok: false,
      lojaCount: 0,
      error: error instanceof Error ? error.message : 'Unknown smoke error',
    };
  }
}
