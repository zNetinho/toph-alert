import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getCompositionRoot } from '../lib/composition-root';
import { createAdminClient } from '../lib/supabase/admin';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function loadEnv(root: string) {
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
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

async function main() {
  loadEnv(rootDir);

  const message = `TypeError: T06 supabase verify ${Date.now()}`;
  const ingestRes = await fetch('http://localhost:3000/api/ingest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
    body: JSON.stringify({
      store_key: 'demo-pilot',
      message,
      type: 'TypeError',
      stack: `${message}\n    at checkout`,
    }),
  });
  const ingestBody = (await ingestRes.json()) as {
    erroId?: string;
    error?: string;
  };
  console.log('ingest', ingestRes.status, ingestBody);
  if (ingestRes.status !== 202 || !ingestBody.erroId) {
    process.exit(1);
  }

  const { pipeline, errors } = getCompositionRoot();
  const first = await pipeline.processCreateTicket(ingestBody.erroId, {
    deepLinkBaseUrl: 'http://localhost:3000',
  });
  const second = await pipeline.processCreateTicket(ingestBody.erroId, {
    deepLinkBaseUrl: 'http://localhost:3000',
  });

  const ticket = await errors.findTicketByErroId(ingestBody.erroId);
  const erro = await errors.findErroById(ingestBody.erroId);

  const supabase = createAdminClient();
  const { count } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('erro_id', ingestBody.erroId);

  const summary = {
    firstOutcome: first.outcome,
    secondOutcome: second.outcome,
    status: erro?.status,
    ticketExternalId: ticket?.externalId,
    ticketsCount: count,
  };
  console.log(JSON.stringify(summary, null, 2));

  if (first.outcome !== 'created' || second.outcome !== 'skipped' || count !== 1) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
