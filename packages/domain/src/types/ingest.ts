/**
 * Payload received from the browser SDK at POST /api/ingest.
 * Keep transport-agnostic — no HTTP or vendor types here.
 */
export type IngestPayload = {
  /** Public key identifying the store (loja). */
  storeKey: string;
  /** Human-readable error message. */
  message: string;
  /** Error name/class (e.g. TypeError). */
  type?: string;
  /** Stack trace string when available. */
  stack?: string;
  /** Structured traces / breadcrumbs for ticket enrichment. */
  traces?: unknown;
  /** Page URL where the error occurred. */
  url?: string;
  /** Source filename if known. */
  filename?: string;
  /** Source line number if known. */
  lineno?: number;
  /** Source column if known. */
  colno?: number;
  /** Client timestamp (ISO-8601) when the error was captured. */
  occurredAt?: string;
  /** Free-form tags (platform, release, etc.). */
  tags?: Record<string, string>;
};
