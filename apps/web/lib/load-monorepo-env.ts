import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

let loaded = false;

/**
 * Ensures monorepo-root `.env` is present on `process.env` (server-only).
 * Safe to call repeatedly; does not override existing values.
 */
export function ensureMonorepoEnv() {
  if (loaded) return;
  loaded = true;

  const here = path.dirname(fileURLToPath(import.meta.url));
  // apps/web/lib → repo root
  const root = path.join(here, '../../..');
  const envPath = path.join(root, '.env');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
