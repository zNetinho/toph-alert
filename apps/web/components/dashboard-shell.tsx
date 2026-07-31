import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { label: 'Overview', href: '/', active: true },
  { label: 'Errors', href: '#', active: false },
  { label: 'Stores', href: '#', active: false },
] as const;

type DashboardShellProps = {
  children: ReactNode;
};

/** Minimal N1 dashboard chrome — sidebar + main — consuming design tokens. */
export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-full flex-1 bg-bg text-text">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border-subtle bg-surface">
        <div className="border-b border-border-subtle px-5 py-6">
          <p className="font-display text-nav font-medium tracking-wide text-accent">toph-alert</p>
          <p className="mt-1 font-body text-caption text-text-muted">N1 monitoring</p>
        </div>
        <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={
                item.active
                  ? 'rounded-lg bg-surface-elevated px-3 py-2 font-display text-nav font-medium text-text'
                  : 'rounded-lg px-3 py-2 font-display text-nav font-medium text-text-muted hover:bg-surface-elevated hover:text-text'
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-border-subtle px-4 py-4">
          <ThemeToggle />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h1 className="font-display text-h3-sub font-bold text-text">Dashboard</h1>
          <a
            href="#"
            className="inline-flex items-center rounded-full bg-cta px-4 py-2 font-body text-cta-size font-semibold text-cta-fg"
          >
            New alert
          </a>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
