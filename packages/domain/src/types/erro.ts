import type { ErroStatus } from './erro-status';
import type { Fingerprint } from './fingerprint';

export type LojaId = string;
export type ErroId = string;

export type Loja = {
  id: LojaId;
  storeKey: string;
  name?: string;
  allowedOrigins: string[];
};

/**
 * Persisted error aggregate (unique per loja + fingerprint).
 */
export type Erro = {
  id: ErroId;
  lojaId: LojaId;
  fingerprint: Fingerprint;
  message: string;
  type?: string;
  stack?: string;
  traces?: unknown;
  url?: string;
  status: ErroStatus;
  occurrenceCount: number;
  createdAt: string;
  updatedAt: string;
};
