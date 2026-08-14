import { DOMAIN_PACKAGE, computeFingerprint, type IngestPayload } from '@toph-alert/domain';
import { DashboardShell } from '@/components/dashboard-shell';
import { fingerprintFromIngest } from '@/lib/domain-ports';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { smokeSchemaReadWrite } from '@/lib/supabase/schema-smoke';

/** Workspace packages (names only — no imports from integrations/sdk outside composition root). */
const workspacePackages = [
  DOMAIN_PACKAGE,
  '@toph-alert/browser-sdk',
  '@toph-alert/integrations',
] as const;

const samplePayload: IngestPayload = {
  storeKey: 'demo-store',
  message: 'TypeError: Cannot read properties of undefined',
  type: 'TypeError',
  stack: 'TypeError: Cannot read properties of undefined\n    at checkout',
};

const sampleFingerprint = fingerprintFromIngest(samplePayload);
const sameFingerprint = computeFingerprint(samplePayload);

export default async function Home() {
  const supabaseConfigured = isSupabaseConfigured();
  const schemaSmoke = await smokeSchemaReadWrite();

  return (
    <DashboardShell>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <p className="font-display text-caption font-medium uppercase tracking-[0.2em] text-accent">
          toph-alert
        </p>
        <h2 className="font-display text-display-l font-black leading-none tracking-tight text-text">
          Schema V1 ready
        </h2>
        <p className="font-body text-body leading-6 text-text-muted">
          Domain fingerprint stable: {String(sampleFingerprint === sameFingerprint)}. Supabase env:{' '}
          {supabaseConfigured ? 'configured' : 'missing (copy .env.example)'}.
        </p>
        {schemaSmoke.configured ? (
          <p className="font-mono text-caption text-text-muted">
            schema smoke: {schemaSmoke.ok ? 'ok' : `fail — ${schemaSmoke.error}`}
          </p>
        ) : (
          <p className="font-mono text-caption text-text-muted">
            schema smoke: skipped (no service role)
          </p>
        )}
        <p className="font-mono text-caption text-text-muted">fp={sampleFingerprint}</p>
        <ul className="space-y-2 font-mono text-caption text-text-muted">
          {workspacePackages.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 pt-2">
          <span className="rounded-full border border-border px-3 py-1 font-body text-caption text-accent">
            accent #36CAD8
          </span>
          <span className="rounded-full bg-cta px-3 py-1 font-body text-caption font-semibold text-cta-fg">
            cta #F6AB00
          </span>
          <span className="rounded-full border border-danger px-3 py-1 font-body text-caption text-danger">
            danger
          </span>
        </div>
      </div>
    </DashboardShell>
  );
}
