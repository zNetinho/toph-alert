/**
 * Branded fingerprint string used for dedupe scoped by loja.
 */
export type Fingerprint = string & { readonly __brand: 'Fingerprint' };

export function toFingerprint(value: string): Fingerprint {
  if (!value) {
    throw new Error('Fingerprint cannot be empty');
  }
  return value as Fingerprint;
}
