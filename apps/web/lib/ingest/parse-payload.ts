import type { IngestPayload } from '@toph-alert/domain';

export type ParsePayloadResult =
  { ok: true; payload: IngestPayload } | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/**
 * Accepts camelCase (domain) or snake_case (SDK transport) bodies.
 */
export function parseIngestPayload(body: unknown): ParsePayloadResult {
  if (!isRecord(body)) {
    return { ok: false, error: 'Body must be a JSON object' };
  }

  const storeKey =
    optionalString(body.storeKey)?.trim() ?? optionalString(body.store_key)?.trim() ?? '';
  const message = optionalString(body.message)?.trim() ?? '';

  if (!storeKey) {
    return { ok: false, error: 'store_key is required' };
  }
  if (!message) {
    return { ok: false, error: 'message is required' };
  }

  const tagsRaw = body.tags;
  let tags: Record<string, string> | undefined;
  if (isRecord(tagsRaw)) {
    tags = {};
    for (const [key, value] of Object.entries(tagsRaw)) {
      if (typeof value === 'string') tags[key] = value;
    }
  }

  const payload: IngestPayload = {
    storeKey,
    message,
    type: optionalString(body.type),
    stack: optionalString(body.stack),
    traces: body.traces,
    url: optionalString(body.url),
    filename: optionalString(body.filename),
    lineno: optionalNumber(body.lineno),
    colno: optionalNumber(body.colno),
    occurredAt: optionalString(body.occurredAt) ?? optionalString(body.occurred_at),
    tags,
  };

  return { ok: true, payload };
}
