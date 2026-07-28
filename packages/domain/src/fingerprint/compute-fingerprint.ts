import { toFingerprint, type Fingerprint } from '../types/fingerprint';
import type { IngestPayload } from '../types/ingest';

/** Fields that participate in stable dedupe identity. */
export type FingerprintSource = Pick<
  IngestPayload,
  'message' | 'type' | 'stack' | 'filename' | 'lineno'
>;

/**
 * Builds a stable fingerprint from ingest fields.
 * Same logical error → same fingerprint (scoped later by loja_id in persistence).
 */
export function computeFingerprint(source: FingerprintSource): Fingerprint {
  const material = [
    normalizeMessage(source.message),
    normalizeType(source.type),
    normalizeStack(source.stack),
    normalizeFilename(source.filename),
    source.lineno != null ? String(source.lineno) : '',
  ].join('\u0000');

  return toFingerprint(stableHashHex(material));
}

function normalizeMessage(message: string): string {
  return message.trim().replace(/\s+/g, ' ');
}

function normalizeType(type: string | undefined): string {
  return (type ?? 'Error').trim();
}

/**
 * Collapse volatile noise while keeping the actionable frame shape.
 */
function normalizeStack(stack: string | undefined): string {
  if (!stack) return '';
  return stack
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) =>
      line
        .trim()
        // Strip query strings / hashes from URLs in frames
        .replace(/(\/[^:\s]+)\?[^:\s]*/g, '$1')
        .replace(/\/_next\/static\/[^/]+\//g, '/_next/static/[build]/'),
    )
    .filter(Boolean)
    .join('\n');
}

function normalizeFilename(filename: string | undefined): string {
  if (!filename) return '';
  return filename.replace(/\\/g, '/').replace(/\?.*$/, '');
}

/**
 * Dual 32-bit FNV-1a mix → 16-char hex.
 * Avoids BigInt so consumers targeting ES2017 (Next default) typecheck cleanly.
 */
function stableHashHex(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ 0xa5a5a5a5;

  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ c, 0x01000193);
  }

  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}
