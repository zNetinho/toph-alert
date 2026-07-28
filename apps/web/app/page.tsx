import { DOMAIN_PACKAGE, computeFingerprint, type IngestPayload } from '@toph-alert/domain';
import { BROWSER_SDK_PACKAGE } from '@toph-alert/browser-sdk';
import { INTEGRATIONS_PACKAGE } from '@toph-alert/integrations';
import { fingerprintFromIngest } from '@/lib/domain-ports';

const workspacePackages = [DOMAIN_PACKAGE, BROWSER_SDK_PACKAGE, INTEGRATIONS_PACKAGE] as const;

const samplePayload: IngestPayload = {
  storeKey: 'demo-store',
  message: 'TypeError: Cannot read properties of undefined',
  type: 'TypeError',
  stack: 'TypeError: Cannot read properties of undefined\n    at checkout',
};

const sampleFingerprint = fingerprintFromIngest(samplePayload);
const sameFingerprint = computeFingerprint(samplePayload);

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center gap-6 px-6 py-16 font-sans">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">toph-alert</p>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Domain contracts ready
      </h1>
      <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
        Ports and fingerprint live in {DOMAIN_PACKAGE}. Sample fingerprint stable:{' '}
        {String(sampleFingerprint === sameFingerprint)}.
      </p>
      <p className="font-mono text-sm text-zinc-700 dark:text-zinc-300">fp={sampleFingerprint}</p>
      <ul className="space-y-2 font-mono text-sm text-zinc-700 dark:text-zinc-300">
        {workspacePackages.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </main>
  );
}
