import { computeFingerprint } from '@toph-alert/domain';
import { NextResponse } from 'next/server';

import { getDomainPorts } from '@/lib/composition-root';
import { checkAllowedOrigin, resolveRequestOrigin } from '@/lib/ingest/origin';
import { parseIngestPayload } from '@/lib/ingest/parse-payload';
import { consumeStoreRateLimit } from '@/lib/ingest/rate-limit';
import { isSupabaseAdminConfigured } from '@/lib/supabase/env';

export const runtime = 'nodejs';

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Origin',
    Vary: 'Origin',
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

export async function OPTIONS(request: Request) {
  const origin = resolveRequestOrigin(request);
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

/**
 * POST /api/ingest — ACK 202 + upsert erros + enqueue outbox (create_ticket).
 * Never calls Runrunit/Discord synchronously.
 */
export async function POST(request: Request) {
  const requestOrigin = resolveRequestOrigin(request);
  const headers = corsHeaders(requestOrigin);

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: 'Ingest unavailable: Supabase admin credentials missing' },
      { status: 503, headers },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers });
  }

  const parsed = parseIngestPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400, headers });
  }

  const { payload } = parsed;
  const rate = consumeStoreRateLimit(payload.storeKey);
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          ...headers,
          'Retry-After': String(rate.retryAfterSec),
        },
      },
    );
  }

  const { errors } = getDomainPorts();

  try {
    const loja = await errors.findLojaByStoreKey(payload.storeKey);
    if (!loja) {
      return NextResponse.json({ error: 'Unknown store_key' }, { status: 404, headers });
    }

    const originCheck = checkAllowedOrigin(loja, requestOrigin);
    if (!originCheck.ok) {
      return NextResponse.json({ error: originCheck.error }, { status: 403, headers });
    }

    // Reflect validated origin on response (browser SDK).
    if (originCheck.origin) {
      headers['Access-Control-Allow-Origin'] = originCheck.origin;
    }

    const fingerprint = computeFingerprint(payload);
    const { erro, created } = await errors.upsertErro({
      lojaId: loja.id,
      fingerprint,
      payload,
    });

    // First occurrence enqueues create_ticket; reoccurrences only bump count (T06 claim is idempotent).
    if (created) {
      await errors.enqueueOutbox({
        erroId: erro.id,
        step: 'create_ticket',
        payload: {
          storeKey: payload.storeKey,
          fingerprint,
          message: payload.message,
        },
      });
    }

    return NextResponse.json(
      {
        accepted: true,
        erroId: erro.id,
        fingerprint,
        created,
        occurrenceCount: erro.occurrenceCount,
      },
      { status: 202, headers },
    );
  } catch (error) {
    console.error('[ingest]', error);
    return NextResponse.json({ error: 'Ingest failed' }, { status: 500, headers });
  }
}
