import type { Loja } from '@toph-alert/domain';

/**
 * Resolves request Origin for allowlist checks.
 * Prefer Origin; fall back to Referer origin for odd clients.
 */
export function resolveRequestOrigin(request: Request): string | null {
  const origin = request.headers.get('origin');
  if (origin) return origin;

  const referer = request.headers.get('referer');
  if (!referer) return null;

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

export type OriginCheckResult = { ok: true; origin: string | null } | { ok: false; error: string };

/**
 * Validates Origin against loja.allowedOrigins.
 * `*` in the allowlist permits any origin (including missing Origin — curl / server).
 */
export function checkAllowedOrigin(loja: Loja, origin: string | null): OriginCheckResult {
  const allowlist = loja.allowedOrigins.map((o) => o.trim()).filter(Boolean);

  if (allowlist.length === 0) {
    return { ok: false, error: 'Store has empty allowed_origins' };
  }

  if (allowlist.includes('*')) {
    return { ok: true, origin };
  }

  if (!origin) {
    return {
      ok: false,
      error: 'Origin header required (or add * to allowed_origins for non-browser clients)',
    };
  }

  if (!allowlist.includes(origin)) {
    return { ok: false, error: 'Origin not allowed for this store' };
  }

  return { ok: true, origin };
}
